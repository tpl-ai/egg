import { useState } from 'react';
import { theme } from '../styles/theme';
import { saveData } from '../services/googleDrive';

const T = theme.colors;
const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

function getSessionExercises(session) {
  if (session.exercises) return session.exercises;
  return (session.groups ?? []).flatMap(g =>
    (g.exercises ?? []).map(e => ({ ...e, _legacyGroup: g.name }))
  );
}

function sessionToEditable(session) {
  const rawExercises = getSessionExercises(session);

  const exercises = rawExercises.map(ex => {
    const type = ex.isCardioExercise ? 'cardio'
               : ex.type === 'duration' ? 'duration'
               : 'strength';

    let bestSet = ex.sets?.[0] || {};
    if (type === 'strength' && ex.sets?.length > 1) {
      bestSet = ex.sets.reduce((b, s) =>
        parseFloat(s.weight) > parseFloat(b.weight || 0) ? s : b, ex.sets[0]);
    }

    return {
      name: ex.name || '',
      type,
      weight: bestSet.weight != null ? String(bestSet.weight) : '',
      reps: bestSet.reps != null ? String(bestSet.reps) : '',
      duration: bestSet.duration != null ? String(bestSet.duration) : '',
      legacyGroup: ex._legacyGroup || null,
      status: ex.status || 'done',
    };
  });

  return {
    date: session.date || '',
    duration: session.duration != null ? String(session.duration) : '',
    location: session.location || '',
    sessionName: session.sessionName || '',
    sessionContext: session.sessionContext || '',
    exercises,
  };
}

function editableToSession(editable, originalSession) {
  const exercises = editable.exercises.map(ex => {
    const sets = ex.type === 'strength'
      ? [{ weight: ex.weight || '0', reps: ex.reps || '0' }]
      : [{ duration: ex.duration || '0' }];
    return {
      name: ex.name,
      type: ex.type,
      isCardioExercise: ex.type === 'cardio',
      status: 'done',
      sets,
    };
  });

  const out = {
    ...originalSession,
    date: editable.date,
    exercises,
  };
  if (editable.duration) out.duration = parseFloat(editable.duration);
  if (editable.location) out.location = editable.location;
  if (editable.sessionName) out.sessionName = editable.sessionName;
  if (editable.sessionContext) out.sessionContext = editable.sessionContext;
  delete out.groups;
  return out;
}

export default function SessionHistoryScreen({ data, accessToken, onBack, onDataUpdate }) {
  const [sessions, setSessions] = useState(() => data?.sessions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editable, setEditable] = useState(() => {
    const s = (data?.sessions || [])[0];
    return s ? sessionToEditable(s) : null;
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const navigate = (dir) => {
    const next = currentIndex + dir;
    if (next < 0 || next >= sessions.length) return;
    setCurrentIndex(next);
    setEditable(sessionToEditable(sessions[next]));
    setIsDirty(false);
    setSaved(false);
    setSaveError('');
  };

  const updateSession = (field, value) => {
    setEditable(e => ({ ...e, [field]: value }));
    setIsDirty(true);
    setSaved(false);
  };

  const updateExercise = (idx, field, value) => {
    setEditable(e => ({
      ...e,
      exercises: e.exercises.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex),
    }));
    setIsDirty(true);
    setSaved(false);
  };

  const deleteExercise = (idx) => {
    setEditable(e => ({
      ...e,
      exercises: e.exercises.filter((_, i) => i !== idx),
    }));
    setIsDirty(true);
    setSaved(false);
  };

  const addExercise = () => {
    setEditable(e => ({
      ...e,
      exercises: [
        ...e.exercises,
        { name: '', type: 'strength', weight: '', reps: '', duration: '', legacyGroup: null, status: 'done' },
      ],
    }));
    setIsDirty(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError('');
    setSaving(true);
    const reconstructed = editableToSession(editable, sessions[currentIndex]);
    const updatedSessions = sessions.map((s, i) => i === currentIndex ? reconstructed : s);
    try {
      const updatedData = { ...data, sessions: updatedSessions };
      await saveData(accessToken, updatedData);
      setSessions(updatedSessions);
      if (onDataUpdate) onDataUpdate(updatedData);
      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError('Failed to save to Drive — check your connection');
    } finally {
      setSaving(false);
    }
  };

  if (sessions.length === 0) {
    return (
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.backBtn} onClick={onBack} aria-label="Back">
            <BackChevron />
          </button>
          <span style={S.headerTitle}>Session History</span>
          <div style={{ width: 36 }} />
        </div>
        <div style={S.empty}>No sessions saved yet.</div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack} aria-label="Back">
          <BackChevron />
        </button>
        <span style={S.headerTitle}>Session History</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={S.scroll}>
        {/* Session selector */}
        <div style={S.selectorRow}>
          <button
            style={{ ...S.navBtn, opacity: currentIndex === 0 ? 0.3 : 1 }}
            onClick={() => navigate(-1)}
            disabled={currentIndex === 0}
            aria-label="Newer session"
          >
            ←
          </button>
          <span style={S.selectorLabel}>
            Session {currentIndex + 1} of {sessions.length}
          </span>
          <button
            style={{ ...S.navBtn, opacity: currentIndex >= sessions.length - 1 ? 0.3 : 1 }}
            onClick={() => navigate(1)}
            disabled={currentIndex >= sessions.length - 1}
            aria-label="Older session"
          >
            →
          </button>
        </div>

        {/* Session-level fields */}
        <div style={S.section}>
          <div style={S.sectionLabel}>SESSION</div>

          <div style={S.fieldRow}>
            <div style={S.field}>
              <label style={S.label}>Date</label>
              <input
                style={S.input}
                value={editable.date}
                onChange={e => updateSession('date', e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div style={{ ...S.field, maxWidth: 80 }}>
              <label style={S.label}>Duration</label>
              <input
                style={S.input}
                type="number"
                inputMode="numeric"
                value={editable.duration}
                onChange={e => updateSession('duration', e.target.value)}
                placeholder="min"
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Location</label>
            <input
              style={S.input}
              value={editable.location}
              onChange={e => updateSession('location', e.target.value)}
              placeholder="e.g. Full Gym"
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Session name</label>
            <input
              style={S.input}
              value={editable.sessionName}
              onChange={e => updateSession('sessionName', e.target.value)}
              placeholder="e.g. Push + Core Power"
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Session context</label>
            <textarea
              style={{ ...S.input, minHeight: 52, resize: 'none', lineHeight: 1.45, fontFamily: FONT }}
              value={editable.sessionContext}
              onChange={e => updateSession('sessionContext', e.target.value)}
              rows={2}
              placeholder="AI coach note for this session"
            />
          </div>
        </div>

        {/* Exercise list */}
        <div style={S.section}>
          <div style={S.sectionLabel}>EXERCISES</div>

          {editable.exercises.length === 0 && (
            <div style={S.emptyExercises}>No exercises — add one below.</div>
          )}

          {editable.exercises.map((ex, idx) => (
            <ExerciseCard
              key={idx}
              exercise={ex}
              onChange={(field, value) => updateExercise(idx, field, value)}
              onDelete={() => deleteExercise(idx)}
            />
          ))}

          <button style={S.addExBtn} onClick={addExercise}>
            + Add exercise
          </button>
        </div>

        {saveError && <div style={S.error}>{saveError}</div>}

        <button
          style={{
            ...S.saveBtn,
            ...(saved ? S.saveBtnDone : {}),
            opacity: saving ? 0.6 : 1,
          }}
          onClick={handleSave}
          disabled={saving}
        >
          {isDirty && !saved && <span style={S.dirtyDot} />}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

const TYPE_OPTIONS = ['strength', 'duration', 'cardio'];

function ExerciseCard({ exercise, onChange, onDelete }) {
  return (
    <div style={S.exCard}>
      {/* Top row: name + trash */}
      <div style={S.exTopRow}>
        <input
          style={{ ...S.input, flex: 1, fontSize: 14 }}
          value={exercise.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Exercise name"
        />
        <button style={S.trashBtn} onClick={onDelete} aria-label="Delete exercise">
          <TrashIcon />
        </button>
      </div>

      {/* Legacy group badge */}
      {exercise.legacyGroup && (
        <div style={S.groupBadge}>{exercise.legacyGroup}</div>
      )}

      {/* Type selector */}
      <div style={S.typeRow}>
        {TYPE_OPTIONS.map(t => (
          <button
            key={t}
            style={{ ...S.typeBtn, ...(exercise.type === t ? S.typeBtnActive : {}) }}
            onClick={() => onChange('type', t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Value fields */}
      {exercise.type === 'strength' ? (
        <div style={S.fieldRow}>
          <div style={S.field}>
            <label style={S.label}>Weight (kg)</label>
            <input
              style={S.input}
              type="number"
              inputMode="decimal"
              value={exercise.weight}
              onChange={e => onChange('weight', e.target.value)}
              placeholder="0"
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Reps</label>
            <input
              style={S.input}
              type="number"
              inputMode="numeric"
              value={exercise.reps}
              onChange={e => onChange('reps', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      ) : (
        <div style={S.field}>
          <label style={S.label}>Duration (sec)</label>
          <input
            style={S.input}
            type="number"
            inputMode="numeric"
            value={exercise.duration}
            onChange={e => onChange('duration', e.target.value)}
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 5 L7.5 10 L12.5 15"
        stroke={T.charcoal}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"
        stroke={T.coral || '#E05252'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const S = {
  container: {
    background: T.bg,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: FONT,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: `1px solid ${T.border}`,
    background: T.bg,
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: T.charcoal,
    letterSpacing: -0.4,
    textAlign: 'center',
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    background: T.panel,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  selectorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    background: T.white,
    border: `1.5px solid ${T.border}`,
    fontSize: 18,
    fontWeight: 700,
    color: T.charcoal,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: FONT,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: T.charcoal,
    flex: 1,
    textAlign: 'center',
  },
  section: {
    background: T.white,
    borderRadius: theme.radius.lg,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: theme.shadow.sm,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.grey,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    flex: 1,
  },
  fieldRow: {
    display: 'flex',
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: T.charcoal,
  },
  input: {
    width: '100%',
    padding: '9px 11px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontSize: 14,
    fontWeight: 600,
    color: T.charcoal,
    outline: 'none',
    fontFamily: FONT,
    boxSizing: 'border-box',
  },
  exCard: {
    background: T.bg,
    borderRadius: theme.radius.md,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    border: `1.5px solid ${T.border}`,
  },
  exTopRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  groupBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: T.grey,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    background: T.panel,
    borderRadius: 99,
    padding: '2px 8px',
    alignSelf: 'flex-start',
  },
  typeRow: {
    display: 'flex',
    gap: 6,
  },
  typeBtn: {
    padding: '5px 10px',
    borderRadius: 99,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontSize: 11,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeBtnActive: {
    background: T.charcoal,
    border: `1.5px solid ${T.charcoal}`,
    color: T.white,
  },
  trashBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    background: 'transparent',
    border: `1.5px solid ${T.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  addExBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: theme.radius.md,
    border: `1.5px dashed ${T.border}`,
    background: 'transparent',
    fontSize: 13,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
    marginTop: 2,
  },
  emptyExercises: {
    fontSize: 13,
    color: T.grey,
    fontWeight: 500,
    textAlign: 'center',
    padding: '8px 0',
  },
  error: {
    fontSize: 13,
    fontWeight: 600,
    color: T.coral || '#E05252',
    marginTop: -4,
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: theme.radius.lg,
    border: 'none',
    background: T.charcoal,
    fontSize: 15,
    fontWeight: 700,
    color: T.white,
    cursor: 'pointer',
    fontFamily: FONT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background 0.2s, opacity 0.15s',
  },
  saveBtnDone: {
    background: '#4A7C59',
  },
  dirtyDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    background: '#F5A623',
    flexShrink: 0,
  },
  empty: {
    padding: '48px 16px',
    textAlign: 'center',
    fontSize: 15,
    color: T.grey,
    fontFamily: FONT,
  },
};
