import { getAllExercises } from '../data/exercises';

const JSON_FORMAT_INSTRUCTION = `
IMPORTANT: Respond ONLY in valid JSON format. No prose, no markdown, no explanation outside the JSON.
Use exactly this structure:
{
  "session_name": "2-4 word session name (e.g. 'Pull + Core Power')",
  "session_context": "1-2 sentences max explaining why this session today, referencing movement history",
  "exercises": [
    {
      "name": "exercise name",
      "movement": "UB Push|UB Pull|LB Push|LB Pull|Core|Balance|Cardio|Stretch",
      "type": "strength|bodyweight|duration|cardio",
      "weight": number or null,
      "reps": number or null,
      "sets": number or null,
      "duration": seconds or null,
      "bodyweight": true or null,
      "guidance": "one sentence, max 15 words, e.g. 'Last session 68kg felt strong — try 72.5kg today.'",
      "note": "string or null"
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

// Get all exercises from a session — handles both flat (new) and groups (legacy) formats
function getSessionExercises(session) {
  if (session.exercises) return session.exercises;
  return session.groups?.flatMap(g => g.exercises ?? []) ?? [];
}

// Get movement categories worked in a session
function getSessionMovements(session, allExercises) {
  const movements = new Set();
  getSessionExercises(session).forEach(exercise => {
    if (exercise.status !== 'done') return;
    const match = allExercises.find(e =>
      e.name.toLowerCase() === exercise.name.toLowerCase()
    );
    if (match?.movement) movements.add(match.movement);
  });
  return [...movements];
}

// Return "Push (UB Push, LB Push, Core)" label for a session
function getSessionDayLabel(session, allExercises) {
  const movArr = getSessionMovements(session, allExercises);
  const hasPush = movArr.some(m => m === 'UB Push' || m === 'LB Push');
  const hasPull = movArr.some(m => m === 'UB Pull' || m === 'LB Pull');
  const dayType = hasPush && !hasPull ? 'Push'
                : hasPull && !hasPush ? 'Pull'
                : hasPush && hasPull  ? 'Push+Pull'
                : 'Other';
  const movStr = movArr.join(', ') || 'unknown';
  return `${dayType} (${movStr})`;
}

// Build the daily briefing prompt (delta — for ongoing chat, AI already has full context)
export function buildDailyBriefing(data, timeAvailable, location = 'Full Gym') {
  const equip = EQUIPMENT_BY_LOCATION[location] || EQUIPMENT_BY_LOCATION['Full Gym'];
  const sessions = data?.sessions || [];
  const allExercises = getAllExercises();

  const recentMovements = sessions.slice(0, 3).map(s =>
    `${formatDate(s.date)}: ${getSessionDayLabel(s, allExercises)}`
  ).join('\n') || 'No recent sessions.';

  return `${timeAvailable} minutes today. Location: ${location}. ${equip}

RECENT MOVEMENT HISTORY (Push/Pull day log):
${recentMovements}

${JSON_FORMAT_INSTRUCTION}`;
}

// Build the full handoff prompt (for new chat)
export function buildFullHandoff(data, timeAvailable, location = 'Full Gym') {
  const profile  = data.profile  || {};
  const sessions = data.sessions  || [];
  const prs      = data.prs       || {};
  const insights = data.insights  || [];
  const exercises= data.exercises || {};

  const now            = new Date();
  const fourteenDaysAgo= new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
  const thirtyDaysAgo  = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
  const allExercises   = getAllExercises();

  const sessionCount = sessions.length;
  const noteHeader   = sessionCount === 0 && Object.keys(prs).length === 0
    ? 'Note: No workout history yet. This is my first session.'
    : `Note: I have ${sessionCount} sessions of history loaded.`;

  // 1. PROFILE
  const profileLines = [
    `Name: ${profile.name || 'Not set'}`,
    `Age: ${profile.age || 'Not set'}`,
    profile.biologicalSex ? `Biological sex: ${profile.biologicalSex}` : null,
    `Weight: ${profile.weight ? `${profile.weight}${profile.weightUnit || 'lbs'}` : 'Not set'}`,
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

  // 5. MOVEMENT HISTORY — last 7 sessions (Push/Pull day log)
  const movementHistory = sessions.slice(0, 7).map(s =>
    `${formatDate(s.date)}: ${getSessionDayLabel(s, allExercises)}`
  ).join('\n') || 'No movement history yet.';

  // 6. EXERCISE FREQUENCY — last 30 days (handles both flat and legacy formats)
  const recentCounts = {};
  sessions
    .filter(s => s.date && new Date(s.date) >= thirtyDaysAgo)
    .forEach(session => {
      getSessionExercises(session).forEach(e => {
        if (e.status === 'done') {
          recentCounts[e.name] = (recentCounts[e.name] || 0) + 1;
        }
      });
    });
  const frequent  = Object.entries(recentCounts).filter(([, c]) => c >= 6).map(([n]) => n);
  const neglected = Object.keys(exercises).filter(n => !recentCounts[n] || recentCounts[n] <= 1);

  // 7. INSIGHTS
  const insightList = insights
    .map(i => {
      const raw = typeof i === 'string' ? i : i.text || i.content || JSON.stringify(i);
      return `- ${raw
        .replace(/â€"/g, '—')
        .replace(/â€˜/g, '‘')
        .replace(/â€™/g, '’')}`;
    })
    .join('\n') || '- None recorded yet.';

  // 8. LOCATION
  const equip = EQUIPMENT_BY_LOCATION[location] || EQUIPMENT_BY_LOCATION['Full Gym'];

  return `${noteHeader}

I'm starting a new EGG session. Here's my complete fitness profile:

ATHLETE:
${profileLines}
${profile.notes ? `\nHEALTH NOTES & LIMITATIONS:\n${profile.notes}` : ''}

LIFETIME BESTS (top 10 most recent PRs):
${prList}

CURRENT BASELINES (last logged per exercise):
${baselineLines}

PERSONAL INSIGHTS (learned over time):
${insightList}

RECENT SESSIONS (last 14 days):
${recentSessions}

MOVEMENT HISTORY (last 7 sessions):
${movementHistory}

MOVEMENT CATEGORY RULES:
- 8 movement types: UB Push, UB Pull, LB Push, LB Pull, Core, Balance, Cardio, Stretch
- Push day = UB Push + LB Push exercises. Pull day = UB Pull + LB Pull exercises.
- Alternate Push/Pull each session — never repeat the same day type two days in a row.
- Core and Balance alternate each session as the secondary focus.
- Cardio and Stretch included every session.
- Push day structure: Cardio (warm-up) → Stretch (mobility prep) → LB Push → UB Push → Core or Balance → Stretch (cool-down)
- Pull day structure: same pattern with LB Pull + UB Pull

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

Please act as my personal trainer and plan today's session:

1. Check MOVEMENT HISTORY — identify if yesterday was Push or Pull, apply rotation
2. Plan today as Push day or Pull day accordingly
3. Include at least one UB and one LB exercise for the primary day type
4. Determine secondary: Core or Balance (alternate from last session)
5. Filter by equipment and time available
6. Build session from user's history: use weights/reps from BASELINES, introduce at least one neglected exercise
7. End coach note with one sentence about what to prioritize next session

Rules to always follow:
- Plan a Push day or Pull day — never repeat same type two sessions in a row
- Include at least one UB and one LB exercise for the primary day type
- Start with Cardio (light warm-up cardio, 5-10 min) and Stretch (mobility prep)
- End with Stretch (cool-down tailored to muscles worked)
- Core or Balance as secondary — alternate based on last session
- Match every exercise to available equipment at ${location}
- Introduce at least one neglected or new exercise per session
- Pull-up goal work always first when included
- Compound movements before isolation
- If under 30 min: max 4 exercises, skip light cardio
- Flag if rest day is needed based on recent pattern
- Keep it fresh — vary exercises, don't default to same routine every time
- For bodyweight exercises (push-ups, pull-ups, dips, etc.): set type to "bodyweight" and weight to null
- For timed holds (plank, dead hang, wall sit): set type to "duration"
- For cardio exercises: set type to "cardio"
- For each exercise, include a "movement" field with the correct movement category
- For each exercise, include a "guidance" field: one short sentence (max 15 words) about target weight/reps based on history
- Time is real: account for rest periods, don't overschedule
${JSON_FORMAT_INSTRUCTION}`;
}

// Build session summary for end of workout
export function buildSessionSummary(session) {
  const exercises = getSessionExercises(session);
  const doneExercises = exercises.filter(e => e.status === 'done');

  if (!doneExercises.length) {
    return 'No exercises logged — nothing to copy';
  }

  const dur = session.duration || session.totalDuration || session.time || '?';
  const lines = [];
  lines.push(`Session complete:`);
  lines.push(`${formatDate(session.date)} — ${dur}min`);
  lines.push('');

  doneExercises.forEach(exercise => {
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
  if (session.notes) lines.push(`Notes: ${session.notes}`);
  lines.push(`How did I do? What should I focus on next session?`);

  return lines.join('\n');
}

// Parse Claude's JSON response into session config
export function parseClaudeResponse(text) {
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

  // Handle both new flat format (raw.exercises) and legacy groups format (raw.groups)
  let flatExercises;
  if (raw.exercises) {
    flatExercises = raw.exercises;
  } else if (raw.groups) {
    flatExercises = raw.groups.flatMap(g => g.exercises || []);
  } else {
    flatExercises = [];
  }

  const mapped = flatExercises.map(e => ({
    name: e.name,
    movement: e.movement ?? null,
    type: e.type || 'strength',
    weight: e.weight ?? null,
    reps: e.reps ?? null,
    sets: e.sets ?? null,
    duration: e.duration ?? null,
    bodyweight: e.bodyweight ?? null,
    guidance: e.guidance ?? null,
    note: e.note ?? null,
    status: 'pending',
  }));

  // Apply cardio ordering
  if (cardioPosition !== 'none') {
    const isCardio = e => e.type === 'cardio';
    const cardioExs = mapped.filter(isCardio);
    const otherExs  = mapped.filter(e => !isCardio(e));
    const ordered = cardioPosition === 'first'
      ? [...cardioExs, ...otherExs]
      : [...otherExs, ...cardioExs];

    return {
      exercises: ordered,
      coach: raw.coach || '',
      insights: raw.insights || '',
      substitutes: raw.substitutes || {},
      cardioPosition,
      sessionName: raw.session_name || '',
      sessionContext: raw.session_context || '',
    };
  }

  return {
    exercises: mapped,
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
  const exercises = getSessionExercises(session);

  const exStr = exercises
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
  return `${formatDate(session.date)} | ${dur}min | ${exStr}`;
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
