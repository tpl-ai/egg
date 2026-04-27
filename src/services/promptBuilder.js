const JSON_FORMAT_INSTRUCTION = `
IMPORTANT: Respond ONLY in valid JSON format. No prose, no markdown, no explanation outside the JSON.
Use exactly this structure:
{
  "groups": [
    {
      "name": "group name",
      "exercises": [
        {
          "name": "exercise name",
          "type": "strength|duration|cardio",
          "weight": number or null,
          "reps": number or null,
          "sets": number or null,
          "duration": seconds or null,
          "bodyweight": true or null,
          "guidance": "one sentence, max 15 words, e.g. 'Last session 68kg felt strong — try 72.5kg today.'",
          "note": "string or null"
        }
      ]
    }
  ],
  "cardio_position": "first|last|none",
  "coach": "2-3 sentence coaching note",
  "insights": "one insight or null",
  "substitutes": {
    "Exercise Name": ["Alt 1", "Alt 2"]
  }
}`;

// Build the daily briefing prompt (delta - for ongoing chat)
export function buildDailyBriefing(data, timeAvailable) {
  const lastSession = data.sessions?.[0];
  const lastSessionText = lastSession
    ? formatSessionCompact(lastSession)
    : 'No previous sessions logged.';

  return `${timeAvailable} minutes today.

Last session:
${lastSessionText}
${JSON_FORMAT_INSTRUCTION}`;
}

// Build the full handoff prompt (for new chat)
export function buildFullHandoff(data, timeAvailable) {
  const profile = data.profile || {};
  const sessions = data.sessions || [];
  const prs = data.prs || {};
  const insights = data.insights || [];
  const exercises = data.exercises || {};

  // Recent 14 days of sessions
  const recentSessions = sessions
    .slice(0, 14)
    .map(formatSessionCompact)
    .join('\n');

  // PRs
  const prList = Object.entries(prs)
    .map(([name, pr]) => 
      `${name}: ${pr.weight}kg × ${pr.reps} (${formatDate(pr.date)})`)
    .join('\n') || 'No PRs recorded yet.';

  // Exercise frequency
  const frequent = Object.entries(exercises)
    .filter(([, ex]) => ex.sessions >= 6)
    .map(([name]) => name);
  const neglected = Object.entries(exercises)
    .filter(([, ex]) => ex.sessions <= 1)
    .map(([name]) => name);

  // Insights
  const insightList = insights
    .map(i => `- ${i.text}`)
    .join('\n') || '- None recorded yet.';

  return `I'm starting a new EGG session. Here's my complete fitness profile:

ATHLETE:
${profile.name ? `Name: ${profile.name}` : ''}
${profile.age ? `Age: ${profile.age}` : ''}
${profile.weight ? `Weight: ${profile.weight}lbs` : ''}
${profile.notes ? `Notes: ${profile.notes}` : ''}

PERSONAL RECORDS (LIFETIME BESTS):
${prList}

PERSONAL INSIGHTS (learned over time):
${insightList}

RECENT SESSIONS (last 14 days):
${recentSessions || 'No sessions yet — this is my first session.'}

EXERCISE FREQUENCY:
${frequent.length > 0 ? `Frequent (may need variety): ${frequent.join(', ')}` : ''}
${neglected.length > 0 ? `Neglected (consider including): ${neglected.join(', ')}` : ''}

TODAY: ${timeAvailable} minutes available.

Please act as my personal trainer. You know my full history above. Plan a workout for today.

Rules to always follow:
- Introduce at least one neglected or new exercise per session
- Pull-up goal work always first when included
- Compound movements before isolation
- Never shoulders before chest on same day
- If under 30 min: max 4 exercises, no cardio unless specified
- Flag if rest day is needed based on pattern
- Warm-up and cool-down always included — tailor stretches to what was worked
- Keep it fresh — vary exercises, don't default to same routine every time
- For bodyweight exercises set bodyweight to true and weight to null
- For each exercise, include a "guidance" field: one short sentence (max 15 words) about the target weight/reps based on their history and progression. Example: "Last session 68kg felt strong — aim for 70kg today."
${JSON_FORMAT_INSTRUCTION}`;
}

// Build session summary for end of workout
export function buildSessionSummary(session) {
  const lines = [];
  lines.push(`Session complete:`);
  lines.push(`${formatDate(session.date)} — ${session.groups.map(g => g.name).join(' + ')} — ${session.duration}min`);
  lines.push('');

  session.groups.forEach(group => {
    lines.push(`${group.name}:`);
    group.exercises.forEach(exercise => {
      if (exercise.status === 'done' && exercise.sets) {
        const sets = exercise.sets
          .filter(s => s.completed)
          .map(s => {
            if (s.duration) return `${s.duration}sec`;
            return `${s.weight}kg × ${s.reps}`;
          })
          .join(', ');
        const delta = exercise.delta ? ` ${exercise.delta}` : '';
        lines.push(`✓ ${exercise.name}: ${sets}${delta}`);
      } else if (exercise.status === 'unavailable') {
        lines.push(`⊘ ${exercise.name}: machine unavailable`);
      } else if (exercise.status === 'skipped') {
        lines.push(`○ ${exercise.name}: skipped`);
      }
    });
    lines.push('');
  });

  if (session.notes) {
    lines.push(`Notes: ${session.notes}`);
  }

  lines.push(`How did I do? What should I focus on next session?`);

  return lines.join('\n');
}

// Parse Claude's JSON response into session config
export function parseClaudeResponse(text) {
  // Strip markdown fences if present
  const cleaned = text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');

  let raw;
  try {
    raw = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'Could not read AI response — make sure you copied the full response including the { brackets'
    );
  }

  const cardioPosition = raw.cardio_position || 'none';

  const mappedGroups = (raw.groups || []).map(g => ({
    name: g.name,
    exercises: (g.exercises || []).map(e => ({
      name: e.name,
      type: e.type || 'strength',
      weight: e.weight ?? null,
      reps: e.reps ?? null,
      sets: e.sets ?? null,
      duration: e.duration ?? null,
      bodyweight: e.bodyweight ?? null,
      guidance: e.guidance ?? null,
      note: e.note ?? null,
      status: 'pending',
    })),
  }));

  // Reorder groups based on cardio_position
  const cardioGroup = mappedGroups.find(g => g.name === 'Cardio');
  const warmupGroup = mappedGroups.find(g => g.name === 'Warm-up');
  const cooldownGroup = mappedGroups.find(g => g.name === 'Cool-down');
  const otherGroups = mappedGroups.filter(g =>
    g.name !== 'Cardio' && g.name !== 'Warm-up' && g.name !== 'Cool-down'
  );

  const ordered = [];
  if (warmupGroup) ordered.push(warmupGroup);
  if (cardioGroup && cardioPosition === 'first') ordered.push(cardioGroup);
  ordered.push(...otherGroups);
  if (cardioGroup && cardioPosition === 'last') ordered.push(cardioGroup);
  if (cooldownGroup) ordered.push(cooldownGroup);

  return {
    groups: ordered,
    coach: raw.coach || '',
    insights: raw.insights || '',
    substitutes: raw.substitutes || {},
    cardioPosition,
  };
}

// Format a session as compact single-line entry
function formatSessionCompact(session) {
  if (!session) return '';
  const groups = session.groups?.map(g => g.name).join('+') || '';
  const exercises = session.groups?.flatMap(g => g.exercises || [])
    .filter(e => e.status === 'done')
    .map(e => {
      const bestSet = e.sets?.reduce((best, s) => 
        (parseFloat(s.weight) > parseFloat(best?.weight || 0)) ? s : best, null);
      if (!bestSet) return e.name.split(' ')[0];
      return `${e.name.split(' ')[0]}:${bestSet.weight}×${bestSet.reps}`;
    })
    .slice(0, 5)
    .join(' ') || '';

  return `${formatDate(session.date)} | ${groups} | ${session.duration}min | ${exercises}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', 
      { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
