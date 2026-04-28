import { useState, useEffect } from 'react';
import { EXERCISES } from '../data/exercises';

const C = {
  bg: '#FAF3E0',
  panel: '#F0E8D0',
  panelLight: '#FFFAEC',
  yolk: '#F5C518',
  yolkSoft: '#FBE69A',
  yolkDeep: '#B88A0E',
  ink: '#2C2416',
  ink2: '#4A3F2A',
  coral: '#E8856A',
  grey: '#8A8078',
  grey2: '#B8AFA3',
  line: '#DCD2BB',
};

const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

// ─── Smart abbreviation ───────────────────────────────────────────────────────
const GYM_SHORTHAND = {
  'Bodyweight Squats': 'Squats',   'Negative Pull-ups': 'Neg Pulls',
  'Negative Pullups': 'Neg Pulls', 'Dynamic Mobility': 'Dynamic',
  'Bench Press': 'Bench',          'Barbell Bench Press': 'Bench',
  'Incline Bench Press': 'Incl Bench', 'Decline Bench Press': 'Decl Bench',
  'Dumbbell Press': 'DB Press',    'Incline Dumbbell Press': 'Incl DB',
  'Overhead Press': 'OHP',         'Seated Overhead Press': 'Seated OHP',
  'Romanian Deadlift': 'RDL',      'Single-Leg RDL': 'SL RDL',
  'Bulgarian Split Squats': 'Bulgarian', 'Bulgarian Split Squat': 'Bulgarian',
  'Lat Pulldown': 'Lat Pull',      'Lat Pull-down': 'Lat Pull',
  'Leg Press': 'Leg Press',        'Leg Extension': 'Leg Ext',
  'Leg Curl': 'Leg Curl',          'Lying Leg Curl': 'Leg Curl',
  'Seated Leg Curl': 'Seated Curl','Calf Raises': 'Calves',
  'Standing Calf Raises': 'Calves','Seated Calf Raises': 'Calves',
  'Barbell Row': 'BB Row',         'Barbell Rows': 'BB Row',
  'Bent-Over Row': 'BB Row',       'Dumbbell Row': 'DB Row',
  'Dumbbell Rows': 'DB Row',       'Single-Arm Row': '1-Arm Row',
  'Seated Cable Row': 'Cable Row', 'Cable Row': 'Cable Row',
  'T-Bar Row': 'T-Bar',            'Dumbbell Curl': 'DB Curl',
  'Barbell Curl': 'BB Curl',       'Hammer Curl': 'Hammer',
  'Hammer Curls': 'Hammer',        'Preacher Curl': 'Preacher',
  'Cable Curl': 'Cable Curl',      'Tricep Pushdown': 'Tri Push',
  'Triceps Pushdown': 'Tri Push',  'Cable Pushdown': 'Cable Push',
  'Tricep Dips': 'Tri Dips',       'Skull Crushers': 'Skulls',
  'Overhead Tricep Extension': 'OH Tri',
  'Lateral Raises': 'Lat Raise',   'Lateral Raise': 'Lat Raise',
  'Front Raises': 'Front',         'Front Raise': 'Front',
  'Face Pulls': 'Face Pull',       'Arnold Press': 'Arnold',
  'Cable Fly': 'Cable Fly',        'Cable Crossover': 'Crossover',
  'Pec Fly': 'Pec Fly',            'Dumbbell Fly': 'DB Fly',
  'Chest Fly': 'Chest Fly',        'Hip Thrust': 'Hip Thrust',
  'Glute Bridge': 'Glute Bdg',     'Deadlift': 'Deadlift',
  'Sumo Deadlift': 'Sumo DL',      'Conventional Deadlift': 'Deadlift',
  'Pull-ups': 'Pull-ups',          'Pullups': 'Pull-ups',
  'Chin-ups': 'Chin-ups',          'Chinups': 'Chin-ups',
  'Push-ups': 'Push-ups',          'Pushups': 'Push-ups',
  'Dips': 'Dips',                  'Squats': 'Squats',
  'Back Squat': 'Squat',           'Front Squat': 'Front Sq',
  'Goblet Squat': 'Goblet Sq',     'Box Squat': 'Box Squat',
  'Hack Squat': 'Hack Sq',         'Lunges': 'Lunges',
  'Walking Lunges': 'Lunges',      'Reverse Lunges': 'Rev Lunge',
  'Step-ups': 'Step-ups',          'Box Jumps': 'Box Jump',
  'Burpees': 'Burpees',            'Mountain Climbers': 'Mtn Climb',
  'Jumping Jacks': 'Jmp Jacks',    'Jump Rope': 'Jump Rope',
  'Treadmill': 'Treadmill',        'Rowing Machine': 'Rowing',
  'Stationary Bike': 'Bike',       'Elliptical': 'Elliptical',
  'Sit-ups': 'Sit-ups',            'Situps': 'Sit-ups',
  'Crunches': 'Crunches',          'Reverse Crunches': 'Rev Crunch',
  'Plank': 'Plank',                'Side Plank': 'Side Plank',
  'Russian Twist': 'Russ Twist',   'Hanging Leg Raise': 'Leg Raise',
  'Leg Raises': 'Leg Raise',       'Ab Wheel': 'Ab Wheel',
  'Cable Crunch': 'Cable Crunch',  'Bicycle Crunch': 'Bicycle',
  'Foam Rolling': 'Foam Roll',     'Hip Flexor Stretch': 'Hip Flex',
  'Hamstring Stretch': 'Hamstring','Quad Stretch': 'Quad',
  'Chest Stretch': 'Chest',        'Shoulder Stretch': 'Shoulder',
  "Cat-Cow": 'Cat-Cow',            "Child's Pose": 'Child Pose',
  'Pigeon Pose': 'Pigeon',         'Downward Dog': 'Down Dog',
};

function abbreviate(name) {
  if (!name) return '';
  if (GYM_SHORTHAND[name]) return GYM_SHORTHAND[name];
  if (name.length <= 10) return name;
  const prefixes = ['Barbell ','Dumbbell ','Cable ','Machine ','Bodyweight ','Weighted ','Assisted ','Banded ','Seated ','Standing ','Lying ','Incline ','Decline ','Single-Arm ','Single-Leg ','One-Arm ','One-Leg '];
  for (const p of prefixes) {
    if (name.startsWith(p)) {
      const s = name.slice(p.length);
      if (GYM_SHORTHAND[s]) return GYM_SHORTHAND[s];
      if (s.length <= 10) return s;
    }
  }
  const words = name.split(' ');
  if (words.length >= 2 && words[0].length <= 10) return words[0];
  return words[0].slice(0, 10);
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────
const EggMark = ({ size = 22 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 28 34" style={{ display: 'block', flexShrink: 0 }}>
    <defs>
      <radialGradient id="eggShadeW" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#FFE89A" />
        <stop offset="55%" stopColor="#F5C518" />
        <stop offset="100%" stopColor="#D9A810" />
      </radialGradient>
    </defs>
    <path d="M14 1.5 C 5.5 1.5, 1.5 14, 1.5 22 C 1.5 29, 7 32.5, 14 32.5 C 21 32.5, 26.5 29, 26.5 22 C 26.5 14, 22.5 1.5, 14 1.5 Z"
      fill="url(#eggShadeW)" stroke="#2C2416" strokeOpacity="0.12" strokeWidth="0.6" />
    <ellipse cx="9.5" cy="10" rx="2.6" ry="3.6" fill="#FFFFFF" opacity="0.55" />
  </svg>
);

const CheckSVG = ({ size = 13, strokeWidth = 2.4, color = C.ink }) => (
  <svg width={size} height={size * 0.77} viewBox="0 0 13 10">
    <path d="M1.5 5 L4.5 8 L11.5 1.5" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseSVG = () => (
  <svg width="11" height="11" viewBox="0 0 11 11">
    <path d="M1 1 L 10 10 M 10 1 L 1 10" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ─── Number Pad ─────────────────────────────────────────────────────────────
// Renders as position:absolute inside the logging panel (position:fixed).
// Backdrop tap saves + closes. Done button saves + closes.
function NumberPad({ label, initial, onConfirm }) {
  // If initial is '0' or empty, start with blank display so user types fresh
  const [val, setVal] = useState(
    initial === 'BW' || initial === '0' || !initial ? '' : initial
  );
  const [pressedKey, setPressedKey] = useState(null);

  const press = (key) => {
    if (key === '⌫') {
      setVal(v => v.slice(0, -1));
    } else if (key === '.') {
      if (!val.includes('.')) setVal(v => v + '.');
    } else {
      setVal(v => {
        if (v === '0') return key;
        return v + key;
      });
    }
  };

  const KEYS = [
    ['7','8','9'],
    ['4','5','6'],
    ['1','2','3'],
    ['.','0','⌫'],
  ];

  const displayVal = val === '' ? '—' : val;
  // Save current val on confirm (backdrop tap or Done button)
  const confirm = (e) => { if (e) e.stopPropagation(); onConfirm(val || '0'); };

  return (
    // Overlay fills the logging panel; tapping backdrop saves + closes
    // onClick (not onPointerDown) so the React re-render from setNumPad(null)
    // doesn't cause ghost clicks on the logging panel beneath
    <div style={S.numPadOverlay} onClick={confirm}>
      <div style={S.numPadPanel} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
        <div style={S.numPadLabel}>{label}</div>
        <div style={S.numPadDisplay}>{displayVal}</div>

        <div style={S.numPadGrid}>
          {KEYS.map((row, r) =>
            row.map(key => (
              <button
                key={`${r}-${key}`}
                style={{
                  ...S.numPadKey,
                  ...(key === '⌫' ? S.numPadKeyBackspace : {}),
                  ...(pressedKey === key ? S.numPadKeyPressed : {}),
                }}
                onPointerDown={(e) => { e.preventDefault(); setPressedKey(key); press(key); }}
                onPointerUp={() => setPressedKey(null)}
                onPointerLeave={() => setPressedKey(null)}
              >
                {key === '⌫'
                  ? <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                      <path d="M8 1H20C21.1 1 22 1.9 22 3V13C22 14.1 21.1 15 20 15H8L1 8L8 1Z" stroke={C.ink} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
                      <path d="M14 5.5L10.5 9M10.5 5.5L14 9" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  : key
                }
              </button>
            ))
          )}
        </div>

        <div style={S.numPadActions}>
          <button style={S.numPadClear}
            onClick={(e) => { e.stopPropagation(); setVal(''); }}>Clear</button>
          <button style={S.numPadDone}
            onClick={(e) => { e.stopPropagation(); confirm(); }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Guidance Card ────────────────────────────────────────────────────────
function GuidanceCard({ exercise, data }) {
  const last = findExerciseHistory(exercise.name, data);
  const pr   = data?.prs?.[exercise.name];

  const isDuration = exercise.type === 'duration' || exercise.duration != null;
  const isBW = exercise.bodyweight === true;
  const hasGuidance = !!exercise.guidance;
  const hasHistory = last && (last.lastWeight != null || last.lastReps != null || last.lastDuration != null);

  return (
    <div style={S.guidanceCard}>
      {/* CASE C: AI guidance always shown if present */}
      {hasGuidance && (
        <div style={S.guidanceText}>{exercise.guidance}</div>
      )}

      <div style={S.guidanceRows}>
        {hasHistory ? (
          /* CASE A: show type-aware history */
          <>
            <div style={S.guidanceRow}>
              <span style={S.guidanceLabel}>Last</span>
              <span style={S.guidanceVal}>
                {isDuration
                  ? `${last.lastDuration ?? '—'}sec${last.lastSets ? ` × ${last.lastSets}` : ''}`
                  : isBW
                    ? `${last.lastReps ?? '—'} reps${last.lastSets ? ` × ${last.lastSets}` : ''}`
                    : `${last.lastWeight ?? '—'}kg × ${last.lastReps ?? '—'}${last.lastSets ? ` × ${last.lastSets}` : ''}`
                }
              </span>
            </div>
            {pr && (
              <div style={S.guidanceRow}>
                <span style={S.guidanceLabel}>PR</span>
                <span style={S.guidanceVal}>
                  {isDuration
                    ? `${pr.duration ?? pr.weight ?? '—'}sec${pr.date ? ` (${formatPRDate(pr.date)})` : ''}`
                    : isBW
                      ? `${pr.reps ?? '—'} reps${pr.date ? ` (${formatPRDate(pr.date)})` : ''}`
                      : `${pr.weight ?? '—'}kg × ${pr.reps ?? '—'}${pr.date ? ` (${formatPRDate(pr.date)})` : ''}`
                  }
                </span>
              </div>
            )}
          </>
        ) : (
          /* CASE B: no history */
          <div style={S.guidanceNew}>New exercise — start light, focus on form and range of motion</div>
        )}
      </div>
    </div>
  );
}

function formatPRDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch { return ''; }
}

// ─── Tappable value field ─────────────────────────────────────────────────────
function ValueField({ value, unit, onTap, muted }) {
  const isEmpty = !value || value === '';
  return (
    <button
      style={{
        ...S.valField,
        opacity: muted ? 0.45 : 1,
        cursor: muted ? 'default' : 'pointer',
      }}
      onClick={muted ? undefined : onTap}
    >
      <span style={S.valNum}>{isEmpty ? '—' : value}</span>
      <span style={S.valUnit}>{unit}</span>
    </button>
  );
}

// ─── Group category helpers (used in both WorkoutScreen and AddExercisePanel) ──
const STRETCH_GROUPS = new Set(['Warm-up', 'Cool-down', 'Stretching', 'Mobility', 'Flexibility']);
const CARDIO_GROUPS  = new Set(['Cardio', 'HIIT', 'Running', 'Conditioning', 'Cardio/Conditioning']);

function isDurationGroup(groupName) {
  return CARDIO_GROUPS.has(groupName) || STRETCH_GROUPS.has(groupName);
}

// Exercises that are always duration-type regardless of AI response or group
const DURATION_EXERCISES = new Set([
  'Plank', 'Side Plank', 'Side Plank (Left)', 'Side Plank (Right)',
  'Dead Bug', 'Bird Dog', 'Dead Hang', 'L-Sit', 'Wall Sit', 'Hollow Hold',
]);

// Resolve effective type: name-based override > AI type > group-based
function resolveType(exerciseName, groupName, aiType) {
  if (DURATION_EXERCISES.has(exerciseName)) return 'duration';
  if (isDurationGroup(groupName)) return 'duration';
  return aiType || 'strength';
}

// Case-insensitive + partial-match lookup in data.exercises (FIX 3)
function findExerciseHistory(name, data) {
  if (!data?.exercises) return null;
  if (data.exercises[name]) return data.exercises[name];
  const lower = name.toLowerCase();
  const exact = Object.keys(data.exercises).find(k => k.toLowerCase() === lower);
  if (exact) return data.exercises[exact];
  const partial = Object.keys(data.exercises).find(k =>
    k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())
  );
  if (partial) return data.exercises[partial];
  return null;
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function WorkoutScreen({ sessionConfig, data, onFinish, initialGroups, onExerciseDone }) {
  const [groups, setGroups] = useState(() => {
    // Use restored groups if provided (resuming an unfinished session)
    if (initialGroups) return initialGroups;
    // Filter out Cool-down group (FIX 7) and build initial state
    return sessionConfig.parsed.groups
      .filter(g => g.name !== 'Cool-down')
      .map(g => ({
        ...g,
        exercises: g.exercises.map((e, i) => {
          const type = resolveType(e.name, g.name, e.type);
          const isDur = type === 'duration';
          return {
            ...e,
            id: `${g.name}-${i}`,
            status: 'pending',
            type,
            sets: Array(e.sets || 3).fill(null).map(() =>
              isDur
                ? { duration: '0' }
                : { weight: (e.bodyweight === true || e.weight === 0) ? 'BW' : '0', reps: '0' }
            ),
          };
        }),
      }));
  });

  const [activeExercise, setActiveExercise] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved'
  // numPad: { setIndex, field, label, value } | null
  const [numPad, setNumPad] = useState(null);

  useEffect(() => {
    if (document.querySelector('link[data-nunito]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap';
    link.setAttribute('data-nunito', '1');
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (document.querySelector('style[data-egg-anim]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-egg-anim', '1');
    style.textContent = `
      @keyframes egg-pulse { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
      @keyframes slideUp { from { transform:translateY(60%); opacity:0; } to { transform:translateY(0); opacity:1; } }
      @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Prevent iOS pull-to-refresh / overscroll dismissing the panel
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.body.style.overflow;
    const prevOs = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = prev;
      document.body.style.overscrollBehavior = prevOs;
    };
  }, []);

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const saveToLocal = (updatedGroups) => {
    const sessionData = {
      date: sessionConfig.date,
      groups: updatedGroups,
      duration: Math.floor(elapsed / 60),
      savedAt: new Date().toISOString(),
      parsed: sessionConfig.parsed,
      timeAvailable: sessionConfig.timeAvailable,
    };
    localStorage.setItem('egg_current_session', JSON.stringify(sessionData));
  };

  const updateExercise = (groupName, exerciseId, updates) => {
    const newGroups = groups.map(g =>
      g.name === groupName
        ? { ...g, exercises: g.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e) }
        : g
    );
    setGroups(newGroups);
    saveToLocal(newGroups);
    if (activeExercise?.id === exerciseId)
      setActiveExercise(prev => ({ ...prev, ...updates }));
  };

  const updateSet = (groupName, exerciseId, setIndex, field, value) => {
    const newGroups = groups.map(g =>
      g.name === groupName ? {
        ...g,
        exercises: g.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          return { ...e, sets: e.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) };
        }),
      } : g
    );
    setGroups(newGroups);
    saveToLocal(newGroups);
  };

  const addSet = (groupName, exerciseId) => {
    const newGroups = groups.map(g =>
      g.name === groupName ? {
        ...g,
        exercises: g.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          const newSet = (e.type === 'duration' || e.duration != null)
            ? { duration: '0' }
            : { weight: e.bodyweight ? 'BW' : '0', reps: '0' };
          return { ...e, sets: [...e.sets, newSet] };
        }),
      } : g
    );
    setGroups(newGroups);
    saveToLocal(newGroups);
    if (activeExercise?.id === exerciseId) {
      setActiveExercise(prev => {
        const newSet = (prev.type === 'duration' || prev.duration != null)
          ? { duration: '0' }
          : { weight: prev.bodyweight ? 'BW' : '0', reps: '0' };
        return { ...prev, sets: [...prev.sets, newSet] };
      });
    }
  };

  const markDone = (groupName, exerciseId) => {
    const newGroups = groups.map(g =>
      g.name === groupName
        ? { ...g, exercises: g.exercises.map(e => e.id === exerciseId ? { ...e, status: 'done' } : e) }
        : g
    );
    setGroups(newGroups);
    saveToLocal(newGroups);
    setActiveExercise(null);
    // Optionally save to Drive (passed from App.jsx)
    if (onExerciseDone) {
      setSaveStatus('saving');
      Promise.resolve(onExerciseDone({ groups: newGroups, duration: Math.floor(elapsed / 60), date: sessionConfig.date }))
        .then(() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus(''), 2000); })
        .catch(() => setSaveStatus(''));
    }
  };

  const addExercise = (name, groupName) => {
    const lp = findExerciseHistory(name, data);
    const type = resolveType(name, groupName, null);
    const isDur = type === 'duration';
    const ex = {
      id: `${groupName}-${Date.now()}`,
      name, status: 'pending',
      type,
      weight: isDur ? null : (lp?.lastWeight?.toString() || ''),
      reps: isDur ? null : (lp?.lastReps?.toString() || ''),
      duration: isDur ? '' : null,
      bodyweight: null,
      sets: [isDur ? { duration: '0' } : { weight: '0', reps: '0' }],
    };
    const newGroups = groups.map(g =>
      g.name === groupName ? { ...g, exercises: [...g.exercises, ex] } : g
    );
    setGroups(newGroups);
    saveToLocal(newGroups);
    setShowAddExercise(false);
    setActiveExercise({ ...ex, groupName });
  };

  const handleFinish = () => finishSession();

  const finishSession = () => {
    localStorage.removeItem('egg_current_session');
    onFinish({ groups, duration: Math.floor(elapsed / 60), date: sessionConfig.date });
  };

  // Open number pad
  const openPad = (setIndex, field, label) => {
    if (!activeExercise) return;
    const currentVal = activeExercise.sets[setIndex]?.[field] || '';
    setNumPad({ setIndex, field, label, value: currentVal });
  };

  const confirmPad = (newVal) => {
    if (!numPad || !activeExercise) return;
    updateSet(activeExercise.groupName, activeExercise.id, numPad.setIndex, numPad.field, newVal);
    // Also update activeExercise so UI reflects it immediately
    setActiveExercise(prev => ({
      ...prev,
      sets: prev.sets.map((s, i) =>
        i === numPad.setIndex ? { ...s, [numPad.field]: newVal } : s
      ),
    }));
    setNumPad(null);
  };

  let globalIdx = 0;
  const squaresData = groups.flatMap(g =>
    g.exercises.map(e => ({ ...e, groupName: g.name, index: globalIdx++ }))
  );

  const workoutTitle = (() => {
    const main = groups
      .filter(g => g.name !== 'Warm-up' && g.name !== 'Cool-down' && g.name !== 'Cardio')
      .map(g => g.name.replace(/\s*\(.*?\)/g, '').trim());
    if (main.length <= 2) return main.join(' + ');
    return main.slice(0, 2).join(' + ') + ` +${main.length - 2}`;
  })();

  return (
    <div style={{ background: C.bg, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT, overflow: 'hidden', overscrollBehavior: 'none' }}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <EggMark size={22} />
          <span style={S.headerTitle}>{workoutTitle}</span>
        </div>
        <div style={S.headerRight}>
          {saveStatus && (
            <span style={{ fontSize: 11, fontWeight: 700, color: saveStatus === 'saved' ? C.yolkDeep : C.grey }}>
              {saveStatus === 'saving' ? 'Saving…' : 'Saved ✓'}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={S.timerDot} />
            <span style={S.timer}>{formatTime(elapsed)}</span>
          </div>
          <button style={S.finishBtn} onClick={handleFinish}>Finish</button>
        </div>
      </div>

      {/* ── Square grid ── */}
      <div style={S.slotsArea}>
        {groups.map(group => (
          <div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={S.groupCaps}>{group.name.replace(/\s*\(.*?\)/g, '').trim().toUpperCase()}</div>
            <div style={S.slotsGrid}>
              {group.exercises.map(exercise => {
                const sq = squaresData.find(s => s.id === exercise.id);
                const isActive = activeExercise?.id === exercise.id;
                const isDone = exercise.status === 'done';
                return (
                  <button
                    key={exercise.id}
                    style={{
                      ...S.slot,
                      background: isActive ? C.yolk : C.panel,
                      boxShadow: isActive
                        ? '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 18px -8px rgba(245,197,24,0.55), 0 1px 0 rgba(44,36,22,0.06)'
                        : '0 1px 0 rgba(255,255,255,0.6) inset, inset 0 0 0 1px rgba(44,36,22,0.05)',
                    }}
                    onClick={() => setActiveExercise({ ...exercise, groupName: group.name })}
                  >
                    {isDone && (
                      <div style={S.doneBadge}>
                        <CheckSVG size={8} strokeWidth={1.6} color={C.ink} />
                      </div>
                    )}
                    <span style={{
                      fontSize: 22, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                      color: isActive ? C.ink : isDone ? C.grey : C.ink,
                    }}>
                      {(sq?.index ?? 0) + 1}
                    </span>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, lineHeight: 1.15,
                      textAlign: 'center', letterSpacing: -0.05,
                      color: isActive ? C.ink2 : isDone ? C.grey : C.ink2,
                      maxWidth: '100%',
                    }}>
                      {abbreviate(exercise.name)}
                    </span>
                  </button>
                );
              })}
              <button style={S.addSlot} onClick={() => setShowAddExercise(group.name)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4 V 16 M 4 10 H 16" stroke={C.yolkDeep} strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Logging Panel — fixed sheet, 90vh, slides up from bottom ── */}
      {activeExercise && (
        <div style={S.loggingPanel}>
          {/* Drag handle — touch-action:none prevents pull-to-dismiss */}
          <div style={S.panelHandle} />

          {/* AI guidance card */}
          <GuidanceCard exercise={activeExercise} data={data} />

          {/* Exercise name */}
          <div style={S.exerciseName}>{activeExercise.name.toUpperCase()}</div>

          {/* Sets — scrollable if many sets */}
          <div style={S.setsScroll}>
            {activeExercise.sets?.map((set, i) => {
              const isDuration = activeExercise.type === 'duration' || activeExercise.duration != null;
              const isBW = activeExercise.bodyweight === true;
              return (
                <div key={i} style={S.setRow}>
                  <span style={S.setLabel}>SET {i + 1}</span>

                  {isDuration ? (
                    <ValueField
                      value={set.duration}
                      unit="sec"
                      onTap={() => openPad(i, 'duration', 'DURATION (sec)')}
                    />
                  ) : isBW ? (
                    <ValueField
                      value={set.reps}
                      unit="reps"
                      onTap={() => openPad(i, 'reps', 'REPS')}
                    />
                  ) : (
                    <>
                      <ValueField
                        value={set.weight}
                        unit="kg"
                        onTap={() => openPad(i, 'weight', 'WEIGHT (kg)')}
                      />
                      <span style={S.times}>×</span>
                      <ValueField
                        value={set.reps}
                        unit="reps"
                        onTap={() => openPad(i, 'reps', 'REPS')}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={S.panelActions}>
            <button style={S.addSetBtn} onClick={() => addSet(activeExercise.groupName, activeExercise.id)}>
              + set
            </button>
            <button style={S.doneBtn} onClick={() => markDone(activeExercise.groupName, activeExercise.id)}>
              <span>Done</span>
              <CheckSVG size={14} strokeWidth={2.6} color={C.ink} />
            </button>
          </div>

          {/* Number pad — absolute inside the logging panel, never covers squares */}
          {numPad && (
            <NumberPad
              label={numPad.label}
              initial={numPad.value}
              onConfirm={confirmPad}
            />
          )}
        </div>
      )}

      {/* ── Add Exercise Panel ── */}
      {showAddExercise && (
        <AddExercisePanel
          currentGroupName={showAddExercise}
          data={data}
          onAdd={addExercise}
          onClose={() => setShowAddExercise(false)}
        />
      )}

    </div>
  );
}

// ─── Add Exercise Panel ───────────────────────────────────────────────────────


function categorise(g) {
  if (CARDIO_GROUPS.has(g)) return 'Cardio';
  if (STRETCH_GROUPS.has(g)) return 'Stretch';
  return 'Weights';
}

function AddExercisePanel({ currentGroupName, data, onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(categorise(currentGroupName));

  const allGroups = Object.keys(EXERCISES);
  const tabGroups = allGroups.filter(g => categorise(g) === tab);
  const ordered = [
    ...tabGroups.filter(g => g === currentGroupName),
    ...tabGroups.filter(g => g !== currentGroupName),
  ];

  const filtered = g => {
    const list = EXERCISES[g] || [];
    if (!search) return list;
    return list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div style={S.addOverlay} onClick={onClose}>
      <div style={S.addPanel} onClick={e => e.stopPropagation()}>
        <div style={S.panelHandle} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: C.ink, letterSpacing: -0.4 }}>Add Exercise</span>
          <button style={S.closeCircleBtn} onClick={onClose}><CloseSVG /></button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['Weights', 'Cardio', 'Stretch'].map(t => (
            <button key={t} style={{ flex: 1, height: 32, borderRadius: 99, background: tab === t ? C.yolk : C.panel, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 800, color: tab === t ? C.ink : C.grey }} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <input
          style={S.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises…"
          autoFocus
        />
        <div style={S.addScroll}>
          {ordered.map(g => {
            const list = filtered(g);
            if (!list.length) return null;
            return (
              <div key={g}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: C.grey, padding: '10px 2px 6px' }}>
                  {g}{g === currentGroupName ? ' ★' : ''}
                </div>
                {list.map(ex => (
                  <button key={ex.name} style={S.addExRow} onClick={() => onAdd(ex.name, currentGroupName)}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{ex.name}</span>
                    {data?.exercises?.[ex.name]?.lastWeight && (
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.grey }}>last: {data.exercises[ex.name].lastWeight}kg</span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
          {ordered.every(g => filtered(g).length === 0) && (
            <div style={{ textAlign: 'center', color: C.grey, fontSize: 14, padding: '24px 0' }}>No exercises found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  // Header
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 18px 12px', borderBottom:`1px solid ${C.line}`, background:C.bg, zIndex:10, flexShrink:0 },
  headerLeft: { display:'flex', alignItems:'center', gap:9, minWidth:0, overflow:'hidden' },
  headerTitle: { fontSize:18, fontWeight:900, letterSpacing:-0.4, color:C.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  headerRight: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  timerDot: { display:'inline-block', width:7, height:7, borderRadius:99, background:C.yolk, boxShadow:'0 0 0 4px rgba(245,197,24,0.18)', animation:'egg-pulse 1.6s ease-in-out infinite' },
  timer: { fontSize:16, fontWeight:900, color:C.yolkDeep, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4 },
  finishBtn: { height:28, padding:'0 12px', borderRadius:99, background:'transparent', border:`1.5px solid ${C.coral}`, color:C.coral, fontFamily:FONT, fontSize:12, fontWeight:800, letterSpacing:0.2, cursor:'pointer', whiteSpace:'nowrap' },

  // Slots — scrollable, sits behind the logging panel when open
  slotsArea: { padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:12, flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', overscrollBehavior:'contain' },
  groupCaps: { fontSize:10.5, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', color:C.grey, paddingLeft:4 },
  slotsGrid: { display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8 },
  slot: { aspectRatio:'1/1', borderRadius:18, border:'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'6px 8px', gap:4, cursor:'pointer', boxSizing:'border-box', position:'relative', fontFamily:FONT },
  doneBadge: { position:'absolute', top:6, right:6, width:14, height:14, borderRadius:99, background:C.yolkSoft, display:'flex', alignItems:'center', justifyContent:'center' },
  addSlot: { aspectRatio:'1/1', borderRadius:18, border:`1.5px dashed ${C.yolk}`, background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxSizing:'border-box' },

  // Logging panel — fixed 90vh sheet slides up from bottom
  loggingPanel: {
    position:'fixed', bottom:0, left:0, right:0,
    height:'90vh',
    background:C.panelLight,
    borderTopLeftRadius:32, borderTopRightRadius:32,
    padding:'14px 18px 28px',
    boxShadow:'0 -10px 40px -10px rgba(44,36,22,0.28)',
    display:'flex', flexDirection:'column', gap:0,
    zIndex:50,
    overflow:'hidden',       // clips numPad slide within panel
    touchAction:'pan-y',     // allow internal scroll, not dismiss
    animation:'slideUp 260ms cubic-bezier(0.32,0.72,0,1)',
  },
  panelHandle: { width:38, height:4, borderRadius:99, background:C.line, margin:'0 auto 14px', flexShrink:0, touchAction:'none' },

  // AI guidance card
  guidanceCard: { background:C.yolkSoft, borderRadius:14, padding:'10px 14px', marginBottom:12, flexShrink:0 },
  guidanceText: { fontSize:12.5, fontWeight:700, color:C.ink2, lineHeight:1.4, marginBottom:6, fontStyle:'italic' },
  guidanceRows: { display:'flex', flexDirection:'column', gap:3 },
  guidanceRow: { display:'flex', gap:8, alignItems:'baseline' },
  guidanceLabel: { fontSize:10, fontWeight:800, letterSpacing:0.8, textTransform:'uppercase', color:C.yolkDeep, flexShrink:0, width:36 },
  guidanceVal: { fontSize:12.5, fontWeight:700, color:C.ink2 },
  guidanceNew: { fontSize:12, fontWeight:600, color:C.ink2, fontStyle:'italic', lineHeight:1.4 },

  // Exercise name
  exerciseName: { fontSize:26, fontWeight:900, color:C.ink, letterSpacing:-0.7, lineHeight:1, marginBottom:14, flexShrink:0 },

  // Sets list — scrollable if many sets
  setsScroll: { display:'flex', flexDirection:'column', gap:8, overflowY:'auto', flex:1, paddingBottom:4 },

  // Set row
  setRow: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  setLabel: { width:38, fontSize:10, fontWeight:800, color:C.grey, letterSpacing:1.1, textTransform:'uppercase', whiteSpace:'nowrap', flexShrink:0 },

  // Value field (tappable)
  valField: { flex:1, minWidth:0, height:54, borderRadius:14, background:C.bg, border:`1px solid ${C.line}`, boxShadow:'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(44,36,22,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, fontFamily:FONT },
  valNum: { fontSize:22, fontWeight:900, color:C.ink, letterSpacing:-0.5, lineHeight:1, fontVariantNumeric:'tabular-nums' },
  valUnit: { fontSize:10, fontWeight:700, color:C.grey },

  times: { fontSize:14, fontWeight:800, color:C.grey2, flexShrink:0 },

  // Panel actions
  panelActions: { display:'flex', gap:10, marginTop:12, flexShrink:0 },
  addSetBtn: { flexShrink:0, height:50, padding:'0 16px', borderRadius:16, cursor:'pointer', background:'transparent', color:C.ink, border:`1.5px solid ${C.ink}`, fontFamily:FONT, fontSize:14, fontWeight:800, letterSpacing:-0.1, whiteSpace:'nowrap' },
  doneBtn: { flex:1, height:50, borderRadius:16, border:'none', cursor:'pointer', background:C.yolk, color:C.ink, fontFamily:FONT, fontSize:16, fontWeight:900, letterSpacing:-0.2, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 22px -10px rgba(245,197,24,0.6), 0 2px 0 rgba(44,36,22,0.06)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, whiteSpace:'nowrap' },

  // Number pad — position:absolute inside the fixed logging panel
  numPadOverlay: { position:'absolute', inset:0, background:'rgba(255,250,236,0.55)', backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)', zIndex:10, display:'flex', alignItems:'flex-end', animation:'fadeIn 120ms ease' },
  numPadPanel: { width:'100%', background:C.panelLight, borderTopLeftRadius:24, borderTopRightRadius:24, padding:'16px 14px 20px', display:'flex', flexDirection:'column', gap:0, animation:'slideUp 220ms cubic-bezier(0.32,0.72,0,1)', fontFamily:FONT, boxShadow:'0 -4px 20px -8px rgba(44,36,22,0.2)' },
  numPadLabel: { fontSize:10.5, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase', color:C.grey, textAlign:'center', marginBottom:6 },
  numPadDisplay: { fontSize:48, fontWeight:900, color:C.ink, letterSpacing:-2, textAlign:'center', lineHeight:1, marginBottom:12, fontVariantNumeric:'tabular-nums', minHeight:54 },
  numPadGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6, marginBottom:8 },
  numPadKey: { height:64, borderRadius:14, background:C.panel, border:`1px solid ${C.line}`, fontSize:24, fontWeight:800, color:C.ink, cursor:'pointer', fontFamily:FONT, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 0 rgba(255,255,255,0.55) inset', userSelect:'none', WebkitUserSelect:'none' },
  numPadKeyBackspace: { background:C.bg, fontSize:16 },
  numPadKeyPressed: { background:C.line, boxShadow:'none' },
  numPadActions: { display:'flex', gap:8, marginTop:2 },
  numPadClear: { flex:1, height:50, borderRadius:14, background:C.panel, border:`1.5px solid ${C.line}`, fontSize:15, fontWeight:800, color:C.ink, cursor:'pointer', fontFamily:FONT },
  numPadDone: { flex:2, height:50, borderRadius:14, background:C.yolk, border:'none', fontSize:16, fontWeight:900, color:C.ink, cursor:'pointer', fontFamily:FONT, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px -8px rgba(245,197,24,0.6)' },

  // Overlays
  overlay: { position:'fixed', inset:0, background:'rgba(44,36,22,0.4)', zIndex:100, display:'flex', alignItems:'flex-end' },
  // Add exercise panel — sits ABOVE the logging panel (zIndex 200 vs 50)
  addOverlay: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(44,36,22,0.4)', zIndex:200, display:'flex', alignItems:'flex-end', animation:'fadeIn 200ms ease' },
  addPanel: { background:C.panelLight, borderTopLeftRadius:32, borderTopRightRadius:32, padding:'16px 18px 26px', width:'100%', maxHeight:'85vh', display:'flex', flexDirection:'column', gap:0, animation:'slideUp 280ms ease', fontFamily:FONT },
  closeCircleBtn: { width:30, height:30, borderRadius:99, padding:0, cursor:'pointer', background:'transparent', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  searchInput: { width:'100%', padding:'11px 14px', background:C.bg, border:`1px solid ${C.line}`, borderRadius:14, fontSize:15, fontWeight:600, color:C.ink, outline:'none', boxSizing:'border-box', fontFamily:FONT, boxShadow:'inset 0 1px 0 rgba(255,255,255,0.6)', marginBottom:4 },
  addScroll: { overflowY:'auto', flex:1 },
  addExRow: { width:'100%', textAlign:'left', background:C.bg, border:`1px solid ${C.line}`, borderRadius:14, padding:'10px 14px', marginBottom:6, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontFamily:FONT, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset' },

  // Confirm dialog
  confirmCard: { background:C.panelLight, borderTopLeftRadius:32, borderTopRightRadius:32, padding:'28px 20px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:16, fontFamily:FONT, animation:'slideUp 280ms ease' },
  confirmText: { fontSize:16, fontWeight:700, color:C.ink, textAlign:'center', lineHeight:1.5, maxWidth:280 },
  stretchBtn: { width:'100%', height:50, padding:0, background:C.yolk, border:'none', borderRadius:16, fontSize:16, fontWeight:900, color:C.ink, cursor:'pointer', fontFamily:FONT, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 22px -10px rgba(245,197,24,0.6)' },
  finishAnywayBtn: { width:'100%', height:48, padding:0, background:'transparent', border:`1.5px solid ${C.line}`, borderRadius:16, fontSize:15, fontWeight:700, color:C.grey, cursor:'pointer', fontFamily:FONT },
};
