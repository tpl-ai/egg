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

// ─── Number Pad ───────────────────────────────────────────────────────────────
function NumberPad({ label, initial, onConfirm, onClose }) {
  const [val, setVal] = useState(initial === 'BW' ? '' : (initial || ''));

  const press = (key) => {
    if (key === '⌫') {
      setVal(v => v.slice(0, -1));
    } else if (key === '.') {
      if (!val.includes('.')) setVal(v => v + '.');
    } else {
      // Prevent leading zeros like "007"
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

  return (
    <div style={S.numPadOverlay} onClick={onClose}>
      <div style={S.numPadPanel} onClick={e => e.stopPropagation()}>
        {/* Display */}
        <div style={S.numPadLabel}>{label}</div>
        <div style={S.numPadDisplay}>{displayVal}</div>

        {/* Grid */}
        <div style={S.numPadGrid}>
          {KEYS.map((row, r) =>
            row.map(key => (
              <button
                key={key}
                style={{
                  ...S.numPadKey,
                  ...(key === '⌫' ? S.numPadKeyBackspace : {}),
                }}
                onClick={() => press(key)}
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

        {/* Actions */}
        <div style={S.numPadActions}>
          <button style={S.numPadClear} onClick={() => setVal('')}>Clear</button>
          <button style={S.numPadDone} onClick={() => onConfirm(val)}>Done</button>
        </div>
      </div>
    </div>
  );
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

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function WorkoutScreen({ sessionConfig, data, onFinish }) {
  const [groups, setGroups] = useState(() =>
    sessionConfig.parsed.groups.map(g => ({
      ...g,
      exercises: g.exercises.map((e, i) => ({
        ...e,
        id: `${g.name}-${i}`,
        status: 'pending',
        sets: Array(e.sets || 3).fill(null).map(() => ({
          weight: (e.bodyweight === true || e.weight === 0) ? 'BW' : (e.weight?.toString() || ''),
          reps: e.reps?.toString() || '',
          duration: e.duration?.toString() || '',
          completed: false,
        })),
      })),
    }))
  );

  const [activeExercise, setActiveExercise] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [elapsed, setElapsed] = useState(0);
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

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateExercise = (groupName, exerciseId, updates) => {
    setGroups(prev => prev.map(g =>
      g.name === groupName
        ? { ...g, exercises: g.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e) }
        : g
    ));
    if (activeExercise?.id === exerciseId)
      setActiveExercise(prev => ({ ...prev, ...updates }));
  };

  const updateSet = (groupName, exerciseId, setIndex, field, value) => {
    setGroups(prev => prev.map(g =>
      g.name === groupName ? {
        ...g,
        exercises: g.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          return { ...e, sets: e.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) };
        }),
      } : g
    ));
  };

  const markSetDone = (groupName, exerciseId, setIndex) => {
    setGroups(prev => prev.map(g =>
      g.name === groupName ? {
        ...g,
        exercises: g.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          return { ...e, sets: e.sets.map((s, i) => i === setIndex ? { ...s, completed: !s.completed } : s) };
        }),
      } : g
    ));
  };

  const addSet = (groupName, exerciseId) => {
    setGroups(prev => prev.map(g =>
      g.name === groupName ? {
        ...g,
        exercises: g.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          const last = e.sets[e.sets.length - 1] || { weight: '', reps: '', duration: '' };
          return { ...e, sets: [...e.sets, { ...last, completed: false }] };
        }),
      } : g
    ));
  };

  const markDone = (groupName, exerciseId) => {
    updateExercise(groupName, exerciseId, { status: 'done' });
    const flat = groups.flatMap(g => g.exercises.map(e => ({ ...e, groupName: g.name })));
    const idx = flat.findIndex(e => e.id === exerciseId);
    const next = flat.slice(idx + 1).find(e => e.status === 'pending');
    if (next) {
      const ng = groups.find(g => g.exercises.some(e => e.id === next.id));
      setActiveExercise({ ...next, groupName: ng.name });
    } else {
      setActiveExercise(null);
    }
  };

  const addExercise = (name, groupName) => {
    const lp = data?.exercises?.[name];
    const ex = {
      id: `${groupName}-${Date.now()}`,
      name, status: 'pending',
      weight: lp?.lastWeight?.toString() || '',
      reps: lp?.lastReps?.toString() || '',
      sets: [{ weight: lp?.lastWeight?.toString() || '', reps: '', completed: false }],
    };
    setGroups(prev => prev.map(g =>
      g.name === groupName ? { ...g, exercises: [...g.exercises, ex] } : g
    ));
    setShowAddExercise(false);
    setActiveExercise({ ...ex, groupName });
  };

  const handleFinish = () => {
    const hasCooldown = groups.some(g => g.name === 'Cool-down');
    const cooldownDone = groups.find(g => g.name === 'Cool-down')?.exercises.some(e => e.status === 'done');
    if (hasCooldown && !cooldownDone) setShowFinishConfirm(true);
    else finishSession();
  };

  const finishSession = () =>
    onFinish({ groups, duration: Math.floor(elapsed / 60), date: sessionConfig.date });

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

  const workoutTitle = groups
    .filter(g => g.name !== 'Warm-up' && g.name !== 'Cool-down' && g.name !== 'Cardio')
    .map(g => g.name).join(' + ');

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: FONT }}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <EggMark size={22} />
          <span style={S.headerTitle}>{workoutTitle}</span>
        </div>
        <div style={S.headerRight}>
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
            <div style={S.groupCaps}>{group.name.toUpperCase()}</div>
            <div style={S.slotsGrid}>
              {group.exercises.slice(0, 4).map(exercise => {
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

      {/* ── Logging Panel ── */}
      {activeExercise && (
        <div style={S.loggingPanel}>
          <div style={S.panelHandle} />

          {/* Exercise name + last performance */}
          <div style={{ marginBottom: 16 }}>
            <div style={S.exerciseName}>{activeExercise.name.toUpperCase()}</div>
            {data?.exercises?.[activeExercise.name]?.lastWeight && (
              <div style={S.lastTime}>
                <span style={{ color: C.grey, fontWeight: 700 }}>Last time:</span>
                {' '}
                <span>{data.exercises[activeExercise.name].lastWeight}kg × {data.exercises[activeExercise.name].lastReps}</span>
                <span> ↑</span>
              </div>
            )}
          </div>

          {/* Sets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 260 }}>
            {activeExercise.sets?.map((set, i) => {
              const isBW = set.weight === 'BW';
              return (
                <div key={i} style={S.setRow}>
                  <span style={S.setLabel}>SET {i + 1}</span>

                  {activeExercise.duration !== null ? (
                    /* Duration exercise */
                    <ValueField
                      value={set.duration}
                      unit="sec"
                      onTap={() => openPad(i, 'duration', 'DURATION (sec)')}
                    />
                  ) : (
                    <>
                      {/* Weight field */}
                      {isBW ? (
                        <div style={S.bwField}>
                          <span style={S.valNum}>BW</span>
                          <span style={S.valUnit}>kg</span>
                        </div>
                      ) : (
                        <ValueField
                          value={set.weight}
                          unit="kg"
                          onTap={() => openPad(i, 'weight', 'WEIGHT (kg)')}
                        />
                      )}

                      <span style={S.times}>×</span>

                      {/* Reps field */}
                      <ValueField
                        value={set.reps}
                        unit="reps"
                        onTap={() => openPad(i, 'reps', 'REPS')}
                      />
                    </>
                  )}

                  {/* Check button */}
                  <button
                    style={{
                      ...S.checkBtn,
                      ...(set.completed ? S.checkBtnDone : {}),
                    }}
                    onClick={() => markSetDone(activeExercise.groupName, activeExercise.id, i)}
                    aria-label={set.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {set.completed && <CheckSVG size={14} strokeWidth={2.4} color="#fff" />}
                  </button>
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
        </div>
      )}

      {/* ── Number Pad overlay ── */}
      {numPad && (
        <NumberPad
          label={numPad.label}
          initial={numPad.value}
          onConfirm={confirmPad}
          onClose={() => setNumPad(null)}
        />
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

      {/* ── Finish Confirm ── */}
      {showFinishConfirm && (
        <div style={S.overlay}>
          <div style={S.confirmCard}>
            <div style={{ fontSize: 40 }}>🥚</div>
            <div style={S.confirmText}>
              Almost done — stretches take 4 minutes and your body will thank you tomorrow.
            </div>
            <button style={S.stretchBtn} onClick={() => {
              setShowFinishConfirm(false);
              const cooldown = groups.find(g => g.name === 'Cool-down');
              if (cooldown?.exercises[0]) setActiveExercise({ ...cooldown.exercises[0], groupName: 'Cool-down' });
            }}>
              Let's stretch
            </button>
            <button style={S.finishAnywayBtn} onClick={finishSession}>Finish anyway</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Exercise Panel ───────────────────────────────────────────────────────
const STRETCH_GROUPS = new Set(['Warm-up', 'Cool-down', 'Stretching', 'Mobility', 'Flexibility']);
const CARDIO_GROUPS  = new Set(['Cardio', 'HIIT', 'Running', 'Conditioning', 'Cardio/Conditioning']);

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
    <div style={{ ...S.overlay, background: 'rgba(44,36,22,0.22)', animation: 'fadeIn 200ms ease' }} onClick={onClose}>
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
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 18px 12px', borderBottom:`1px solid ${C.line}`, position:'sticky', top:0, background:C.bg, zIndex:10 },
  headerLeft: { display:'flex', alignItems:'center', gap:9, minWidth:0 },
  headerTitle: { fontSize:18, fontWeight:900, letterSpacing:-0.4, color:C.ink, whiteSpace:'nowrap' },
  headerRight: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  timerDot: { display:'inline-block', width:7, height:7, borderRadius:99, background:C.yolk, boxShadow:'0 0 0 4px rgba(245,197,24,0.18)', animation:'egg-pulse 1.6s ease-in-out infinite' },
  timer: { fontSize:16, fontWeight:900, color:C.yolkDeep, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4 },
  finishBtn: { height:28, padding:'0 12px', borderRadius:99, background:'transparent', border:`1.5px solid ${C.coral}`, color:C.coral, fontFamily:FONT, fontSize:12, fontWeight:800, letterSpacing:0.2, cursor:'pointer', whiteSpace:'nowrap' },

  // Slots
  slotsArea: { padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:12 },
  groupCaps: { fontSize:10.5, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', color:C.grey, paddingLeft:4 },
  slotsGrid: { display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8 },
  slot: { aspectRatio:'1/1', borderRadius:18, border:'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'6px 8px', gap:4, cursor:'pointer', boxSizing:'border-box', position:'relative', fontFamily:FONT },
  doneBadge: { position:'absolute', top:6, right:6, width:14, height:14, borderRadius:99, background:C.yolkSoft, display:'flex', alignItems:'center', justifyContent:'center' },
  addSlot: { aspectRatio:'1/1', borderRadius:18, border:`1.5px dashed ${C.yolk}`, background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxSizing:'border-box' },

  // Logging panel
  loggingPanel: { background:C.panelLight, borderTopLeftRadius:32, borderTopRightRadius:32, padding:'14px 18px 24px', boxShadow:'0 -10px 28px -16px rgba(74,63,42,0.25), 0 -1px 0 rgba(44,36,22,0.06)', borderTop:'1px solid rgba(255,255,255,0.7)', display:'flex', flexDirection:'column', gap:0, marginTop:'auto', position:'sticky', bottom:0 },
  panelHandle: { width:38, height:4, borderRadius:99, background:C.line, margin:'-2px auto 14px' },
  exerciseName: { fontSize:24, fontWeight:900, color:C.ink, letterSpacing:-0.6, lineHeight:1 },
  lastTime: { fontSize:12.5, fontWeight:800, color:C.yolkDeep, marginTop:7, display:'flex', alignItems:'center', gap:5 },

  // Set row
  setRow: { display:'flex', alignItems:'center', gap:8 },
  setLabel: { width:38, fontSize:10, fontWeight:800, color:C.grey, letterSpacing:1.1, textTransform:'uppercase', whiteSpace:'nowrap', flexShrink:0 },

  // Value field (tappable)
  valField: { flex:1, minWidth:0, height:54, borderRadius:14, background:C.bg, border:`1px solid ${C.line}`, boxShadow:'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(44,36,22,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, fontFamily:FONT },
  valNum: { fontSize:22, fontWeight:900, color:C.ink, letterSpacing:-0.5, lineHeight:1, fontVariantNumeric:'tabular-nums' },
  valUnit: { fontSize:10, fontWeight:700, color:C.grey },

  // BW (non-editable weight)
  bwField: { flex:1, minWidth:0, height:54, borderRadius:14, background:C.panel, border:`1px solid ${C.line}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 },

  times: { fontSize:14, fontWeight:800, color:C.grey2, flexShrink:0 },

  // Check button — 44px tap target
  checkBtn: { width:44, height:44, borderRadius:99, border:`2px solid ${C.grey2}`, background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer', padding:0 },
  checkBtnDone: { background:C.yolk, border:`2px solid ${C.yolk}`, boxShadow:'0 4px 12px -4px rgba(245,197,24,0.55)' },

  // Panel actions
  panelActions: { display:'flex', gap:10, marginTop:14 },
  addSetBtn: { flexShrink:0, height:50, padding:'0 16px', borderRadius:16, cursor:'pointer', background:'transparent', color:C.ink, border:`1.5px solid ${C.ink}`, fontFamily:FONT, fontSize:14, fontWeight:800, letterSpacing:-0.1, whiteSpace:'nowrap' },
  doneBtn: { flex:1, height:50, borderRadius:16, border:'none', cursor:'pointer', background:C.yolk, color:C.ink, fontFamily:FONT, fontSize:16, fontWeight:900, letterSpacing:-0.2, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 22px -10px rgba(245,197,24,0.6), 0 2px 0 rgba(44,36,22,0.06)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, whiteSpace:'nowrap' },

  // Number pad
  numPadOverlay: { position:'fixed', inset:0, background:'rgba(44,36,22,0.45)', zIndex:200, display:'flex', alignItems:'flex-end', animation:'fadeIn 150ms ease' },
  numPadPanel: { width:'100%', background:C.panelLight, borderTopLeftRadius:28, borderTopRightRadius:28, padding:'20px 16px 32px', display:'flex', flexDirection:'column', gap:0, animation:'slideUp 250ms ease', fontFamily:FONT },
  numPadLabel: { fontSize:10.5, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase', color:C.grey, textAlign:'center', marginBottom:8 },
  numPadDisplay: { fontSize:48, fontWeight:900, color:C.ink, letterSpacing:-2, textAlign:'center', lineHeight:1, marginBottom:16, fontVariantNumeric:'tabular-nums', minHeight:58 },
  numPadGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:12 },
  numPadKey: { height:72, borderRadius:16, background:C.panel, border:`1px solid ${C.line}`, fontSize:26, fontWeight:800, color:C.ink, cursor:'pointer', fontFamily:FONT, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 0 rgba(255,255,255,0.55) inset' },
  numPadKeyBackspace: { background:C.bg, fontSize:16 },
  numPadActions: { display:'flex', gap:10, marginTop:4 },
  numPadClear: { flex:1, height:56, borderRadius:16, background:C.panel, border:`1.5px solid ${C.line}`, fontSize:16, fontWeight:800, color:C.ink, cursor:'pointer', fontFamily:FONT },
  numPadDone: { flex:2, height:56, borderRadius:16, background:C.yolk, border:'none', fontSize:17, fontWeight:900, color:C.ink, cursor:'pointer', fontFamily:FONT, boxShadow:'0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px -8px rgba(245,197,24,0.6)' },

  // Overlay + panels
  overlay: { position:'fixed', inset:0, background:'rgba(44,36,22,0.4)', zIndex:100, display:'flex', alignItems:'flex-end' },
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
