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

// Build the daily briefing prompt (delta - for ongoing chat, AI already has full context)
export function buildDailyBriefing(data, timeAvailable) {
  return `${timeAvailable} minutes today.
${JSON_FORMAT_INSTRUCTION}`;
}

// Build the full handoff prompt (for new chat)
export function buildFullHandoff(data, timeAvailable) {
  const profile = data.profile || {};
  const sessions = data.sessions || [];
  const prs = data.prs || {};
  const insights = data.insights || [];
  const exercises = data.exercises || {};

  const now = new Date();
  const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
  const thirtyDaysAgo   = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

  // Note header — FIX 4: confirm data is loaded
  const sessionCount = sessions.length;
  const noteHeader = sessionCount === 0 && Object.keys(prs).length === 0
    ? 'Note: No workout history yet. This is my first session.'
    : `Note: I have ${sessionCount} sessions of history loaded.`;

  // 1. PROFILE
  const profileLines = [
    `Name: ${profile.name || 'Not set'}`,
    `Age: ${profile.age || 'Not set'}`,
    `Weight: ${profile.weight ? `${profile.weight}lbs` : 'Not set'}`,
  ].join('\n');

  // 2. LIFETIME BESTS — top 10 most recent PRs
  const prList = Object.entries(prs)
    .sort((a, b) => new Date(b[1].date || 0) - new Date(a[1].date || 0))
    .slice(0, 10)
    .map(([name, pr]) => `${name}: ${pr.weight}kg × ${pr.reps} (${formatDate(pr.date)})`)
    .join('\n') || 'No PRs recorded yet.';

  // 3. CURRENT BASELINES — last logged weight/reps per exercise
  const baselineLines = Object.entries(exercises)
    .filter(([, ex]) => ex.lastWeight != null || ex.lastReps != null)
    .map(([name, ex]) => {
      const lastDate = ex.lastPerformed ? new Date(ex.lastPerformed) : null;
      const daysSince = lastDate ? Math.floor((now - lastDate) / 86400000) : null;
      const stale = daysSince !== null && daysSince > 30;
      const weight = ex.lastWeight != null ? `${ex.lastWeight}kg` : 'BW';
      const reps = ex.lastReps != null ? `${ex.lastReps} reps` : '—';
      const performed = ex.lastPerformed ? formatDate(ex.lastPerformed) : 'unknown';
      return `${name}: ${weight} × ${reps} (${performed})${stale ? ' ⚠ needs recalibration' : ''}`;
    })
    .join('\n') || 'No exercise history yet.';

  // 4. RECENT SESSIONS — last 14 calendar days (not just last 14 sessions)
  const recentSessions = sessions
    .filter(s => s.date && new Date(s.date) >= fourteenDaysAgo)
    .slice(0, 14)
    .map(formatSessionCompact)
    .join('\n') || 'No sessions in the last 14 days.';

  // 5. EXERCISE FREQUENCY — counted from sessions in last 30 days
  const recentCounts = {};
  sessions
    .filter(s => s.date && new Date(s.date) >= thirtyDaysAgo)
    .forEach(session => {
      session.groups?.forEach(g => {
        g.exercises?.forEach(e => {
          if (e.status === 'done') {
            recentCounts[e.name] = (recentCounts[e.name] || 0) + 1;
          }
        });
      });
    });
  const frequent = Object.entries(recentCounts)
    .filter(([, c]) => c >= 6).map(([n]) => n);
  const neglected = Object.keys(exercises)
    .filter(n => !recentCounts[n] || recentCounts[n] <= 1);

  // 6. INSIGHTS
  const insightList = insights
    .map(i => {
      const raw = typeof i === 'string' ? i : i.text || i.content || JSON.stringify(i);
      return `- ${raw
        .replace(/â€"/g, '—')
        .replace(/â€˜/g, '\u2018')
        .replace(/â€™/g, '\u2019')}`;
    })
    .join('\n') || '- None recorded yet.';

  return `${noteHeader}

I'm starting a new EGG session. Here's my complete fitness profile:

ATHLETE:
${profileLines}
${profile.notes ? `\nGOALS & NOTES:\n${profile.notes}` : ''}

LIFETIME BESTS (top 10 most recent PRs):
${prList}

CURRENT BASELINES (last logged per exercise):
${baselineLines}

PERSONAL INSIGHTS (learned over time):
${insightList}

RECENT SESSIONS (last 14 days):
${recentSessions}

EXERCISE FREQUENCY (last 30 days):
${frequent.length > 0 ? `Frequent (6+ times, may need variety): ${frequent.join(', ')}` : 'No exercises done 6+ times in last 30 days.'}
${neglected.length > 0 ? `Neglected (0-1 times, consider including): ${neglected.slice(0, 15).join(', ')}` : ''}

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
  console.log('Building summary for:', JSON.stringify(session, null, 2));

  if (!session?.groups?.length) {
    return 'No exercises logged — nothing to copy';
  }

  const dur = session.duration || session.totalDuration || session.time || '?';
  const lines = [];
  lines.push(`Session complete:`);
  lines.push(`${formatDate(session.date)} — ${session.groups.map(g => g.name).join(' + ')} — ${dur}min`);
  lines.push('');

  session.groups.forEach(group => {
    lines.push(`${group.name}:`);
    group.exercises.forEach(exercise => {
      if (exercise.status === 'done' && exercise.sets?.length) {
        // Include all sets that have non-zero values (no .completed filter — removed earlier)
        const validSets = exercise.sets.filter(s =>
          (s.duration && s.duration !== '0') ||
          (s.weight && s.weight !== '0' && s.weight !== 'BW') ||
          (s.reps && s.reps !== '0')
        );
        const setStrs = (validSets.length ? validSets : exercise.sets).map(s => {
          if (s.duration && s.duration !== '0') return `${s.duration}sec`;
          if (s.weight === 'BW') return `BW × ${s.reps}`;
          return `${s.weight}kg × ${s.reps}`;
        }).join(', ');
        lines.push(`✓ ${exercise.name}: ${setStrs}`);
      } else if (exercise.status === 'done') {
        lines.push(`✓ ${exercise.name}`);
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

  const dur = session.duration || session.totalDuration || session.time || '?';
  return `${formatDate(session.date)} | ${groups} | ${dur}min | ${exercises}`;
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
