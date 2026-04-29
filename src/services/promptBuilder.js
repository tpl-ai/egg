const JSON_FORMAT_INSTRUCTION = `
IMPORTANT: Respond ONLY in valid JSON format. No prose, no markdown, no explanation outside the JSON.
Use exactly this structure:
{
  "session_name": "2-4 word session name (e.g. 'Pull Strength + Balance')",
  "session_context": "1-2 sentences max explaining why this session today, referencing specific pillars and history",
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
  "coach": "2-3 sentence coaching note ending with what to prioritize next session",
  "insights": "one insight or null",
  "substitutes": {
    "Exercise Name": ["Alt 1", "Alt 2"]
  }
}`;

const EQUIPMENT_BY_LOCATION = {
  'Full Gym':   'All equipment available: barbells, dumbbells, machines, cables, cardio machines, pull-up bars.',
  'Hotel Gym':  'Limited: dumbbells (usually up to 30-40kg), basic machines, treadmill/bike. No barbell. No cable machine usually.',
  'Outdoor':    'Bodyweight only. Running, hiking, stairs available. No equipment unless user specifies.',
  'Home':       'Equipment as noted in profile/limitations. Default to bodyweight if nothing specified.',
};

// Seven Pillars status for prompt
function getPillarStatus(pillars) {
  const pillarNames = [
    'Strength', 'Cardiovascular', 'Mobility',
    'Flexibility', 'Balance', 'Functional', 'Recovery',
  ];
  return pillarNames.map(pillar => {
    const lastDate = pillars?.[pillar];
    if (!lastDate) return `${pillar}: never ⚠ CRITICAL`;
    const days = Math.floor((Date.now() - new Date(lastDate)) / 86400000);
    const when   = days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days}d ago`;
    const status = days <= 2 ? '✓' : days <= 5 ? '~' : days <= 7 ? '⚠ due soon' : '⚠ OVERDUE';
    return `${pillar}: ${when} ${status}`;
  }).join('\n');
}

// Build the daily briefing prompt (delta — for ongoing chat, AI already has full context)
export function buildDailyBriefing(data, timeAvailable, location = 'Full Gym') {
  const equip = EQUIPMENT_BY_LOCATION[location] || EQUIPMENT_BY_LOCATION['Full Gym'];
  return `${timeAvailable} minutes today. Location: ${location}. ${equip}
${JSON_FORMAT_INSTRUCTION}`;
}

// Build the full handoff prompt (for new chat)
export function buildFullHandoff(data, timeAvailable, location = 'Full Gym') {
  const profile  = data.profile  || {};
  const sessions = data.sessions  || [];
  const prs      = data.prs       || {};
  const insights = data.insights  || [];
  const exercises= data.exercises || {};
  const pillars  = data.pillars   || {};

  const now            = new Date();
  const fourteenDaysAgo= new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
  const thirtyDaysAgo  = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

  const sessionCount = sessions.length;
  const noteHeader   = sessionCount === 0 && Object.keys(prs).length === 0
    ? 'Note: No workout history yet. This is my first session.'
    : `Note: I have ${sessionCount} sessions of history loaded.`;

  // 1. PROFILE
  const profileLines = [
    `Name: ${profile.name || 'Not set'}`,
    `Age: ${profile.age || 'Not set'}`,
    `Weight: ${profile.weight ? `${profile.weight}${profile.weightUnit || 'lbs'}` : 'Not set'}`,
    profile.primaryGoal  ? `Primary goal: ${profile.primaryGoal}` : null,
    profile.travelsRegularly ? 'Travels regularly: yes (include hotel-friendly alternatives)' : null,
  ].filter(Boolean).join('\n');

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
      const lastDate  = ex.lastPerformed ? new Date(ex.lastPerformed) : null;
      const daysSince = lastDate ? Math.floor((now - lastDate) / 86400000) : null;
      const stale     = daysSince !== null && daysSince > 30;
      const weight    = ex.lastWeight != null ? `${ex.lastWeight}kg` : 'BW';
      const reps      = ex.lastReps   != null ? `${ex.lastReps} reps` : '—';
      const performed = ex.lastPerformed ? formatDate(ex.lastPerformed) : 'unknown';
      return `${name}: ${weight} × ${reps} (${performed})${stale ? ' ⚠ needs recalibration' : ''}`;
    })
    .join('\n') || 'No exercise history yet.';

  // 4. RECENT SESSIONS — last 14 calendar days
  const recentSessions = sessions
    .filter(s => s.date && new Date(s.date) >= fourteenDaysAgo)
    .slice(0, 14)
    .map(formatSessionCompact)
    .join('\n') || 'No sessions in the last 14 days.';

  // 5. EXERCISE FREQUENCY — last 30 days
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
  const frequent  = Object.entries(recentCounts).filter(([, c]) => c >= 6).map(([n]) => n);
  const neglected = Object.keys(exercises).filter(n => !recentCounts[n] || recentCounts[n] <= 1);

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

  // 7. LOCATION
  const equip = EQUIPMENT_BY_LOCATION[location] || EQUIPMENT_BY_LOCATION['Full Gym'];

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

SEVEN PILLARS — LAST WORKED:
${getPillarStatus(pillars)}

PILLAR INSTRUCTION:
Prioritize the most overdue pillars above. Never let any pillar exceed 7 days without at least a brief element.
- Strength + Cardiovascular: aim for 3-5x per week
- Mobility + Flexibility: minimum 2x per week
- Balance + Functional: minimum 2x per week
- Recovery: minimum 1x per week

EXERCISE FREQUENCY (last 30 days):
${frequent.length > 0 ? `Frequent (6+ times, may need variety): ${frequent.join(', ')}` : 'No exercises done 6+ times in last 30 days.'}
${neglected.length > 0 ? `Neglected (0-1 times, consider including): ${neglected.slice(0, 15).join(', ')}` : ''}

LOCATION: ${location}
EQUIPMENT: ${equip}

TIME: ${timeAvailable} minutes total.
Account for rest periods: 60-90 sec between strength sets, 30-45 sec for lighter work.
5 min warm-up + 5 min cool-down included in total.
Example: 60 min = ~35 min actual lifting time. Do not overschedule.

---

Please act as my personal trainer. Plan today's session using this 5-step approach:

Step 1 — Look back:
Review the last 7 days of sessions above. Note which muscle groups were worked, which pillars were hit or missed, last intensity level, any patterns or issues.

Step 2 — Identify priority:
What is most overdue from the seven pillars? What muscle groups are recovered and ready to train?

Step 3 — Match to reality:
Filter by available equipment (${location}) and time (${timeAvailable} min). Adjust intensity based on recency. If user travels regularly, always include bodyweight alternatives.

Step 4 — Generate session:
Build the plan with sets, reps, and weights drawn from history above. Include a brief coach note explaining why this session makes sense today.

Step 5 — Set up next time:
End your coach note with exactly one sentence about what to prioritize next session.

Rules to always follow:
- Match every exercise to available equipment at ${location}
- Introduce at least one neglected or new exercise per session
- Pull-up goal work always first when included
- Compound movements before isolation
- Never shoulders before chest on same day
- If under 30 min: max 4 exercises, no cardio unless specified
- Flag if rest day is needed based on recent pattern
- Warm-up and cool-down always included — tailor stretches to muscles worked
- Keep it fresh — vary exercises, don't default to same routine every time
- For bodyweight exercises: set bodyweight to true and weight to null
- For each exercise, include a "guidance" field: one short sentence (max 15 words) about target weight/reps based on history. Example: "Last session 68kg felt strong — aim for 70kg today."
- Time is real: account for rest periods, don't overschedule
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
      if (exercise.status !== 'done') return;

      if (exercise.isCardioExercise && exercise.sets?.length) {
        const log = exercise.sets[0];
        const parts = [];
        if (log.duration  && log.duration  !== '0') parts.push(`${log.duration}min`);
        if (exercise.cardioTrackDistance && log.distance && log.distance !== '0')
          parts.push(`${log.distance}${exercise.cardioDistanceUnit || ''}`);
        if (exercise.cardioTrackElevation && log.elevation && log.elevation !== '0')
          parts.push(`${log.elevation}m ↑`);
        if (exercise.cardioTrackFloors && log.floors && log.floors !== '0')
          parts.push(`${log.floors} floors`);
        lines.push(`✓ ${exercise.name}${parts.length ? ': ' + parts.join(', ') : ''}`);
        return;
      }

      if (exercise.sets?.length) {
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
      } else {
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
  const cardioGroup   = mappedGroups.find(g => g.name === 'Cardio');
  const warmupGroup   = mappedGroups.find(g => g.name === 'Warm-up');
  const cooldownGroup = mappedGroups.find(g => g.name === 'Cool-down');
  const otherGroups   = mappedGroups.filter(g =>
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
    sessionName: raw.session_name || '',
    sessionContext: raw.session_context || '',
  };
}

// Format a session as compact single-line entry
function formatSessionCompact(session) {
  if (!session) return '';
  const groups    = session.groups?.map(g => g.name).join('+') || '';
  const exercises = session.groups?.flatMap(g => g.exercises || [])
    .filter(e => e.status === 'done')
    .map(e => {
      if (e.isCardioExercise) {
        const log = e.sets?.[0];
        return log?.duration && log.duration !== '0'
          ? `${e.name.split(' ')[0]}:${log.duration}min`
          : e.name.split(' ')[0];
      }
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
