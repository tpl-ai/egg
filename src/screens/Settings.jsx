import { useState } from 'react';
import { theme } from '../styles/theme';

const T = theme.colors;
const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

const SEX_OPTIONS = ['Male', 'Female', 'Prefer not to say'];

export default function SettingsScreen({
  mode = 'edit', // 'setup' | 'edit'
  data,
  onBack,
  onSave,
}) {
  const profile = data?.profile || {};
  const [name, setName]               = useState(profile.name || '');
  const [age, setAge]                 = useState(profile.age ? String(profile.age) : '');
  const [biologicalSex, setBiologicalSex] = useState(profile.biologicalSex || '');
  const [weight, setWeight]           = useState(profile.weight ? String(profile.weight) : '');
  const [weightUnit, setWeightUnit]   = useState(profile.weightUnit || 'lbs');
  const [notes, setNotes]             = useState(profile.notes || '');
  const [disclaimerA, setDisclaimerA] = useState(false);
  const [disclaimerB, setDisclaimerB] = useState(false);
  const [saved, setSaved]             = useState(false);

  const isSetup = mode === 'setup';
  const canSave = isSetup ? (disclaimerA && disclaimerB && age.trim()) : true;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      ...profile,
      name: name.trim(),
      age: age ? parseInt(age) : '',
      biologicalSex,
      weight: weight ? parseFloat(weight) : '',
      weightUnit,
      notes: notes.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'egg_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        {!isSetup ? (
          <button style={S.backBtn} onClick={onBack} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 5 L7.5 10 L12.5 15" stroke={T.charcoal} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : <div style={{ width: 36 }} />}
        <span style={S.headerTitle}>{isSetup ? "Let's get you set up" : 'Settings'}</span>
        <div style={{ width: 36 }} />
      </div>

      {isSetup && (
        <div style={S.setupSubtitle}>Takes 2 minutes. You can update this anytime.</div>
      )}

      <div style={S.scroll}>

        {/* ── DISCLAIMER (setup only) ── */}
        {isSetup && (
          <div style={S.section}>
            <div style={S.sectionLabel}>BEFORE WE START</div>
            <div style={S.disclaimerBox}>
              <p style={S.disclaimerText}>
                This app provides general fitness guidance only. It is not a substitute for
                medical advice. Before starting any new exercise program, consult your doctor
                — especially if you have heart conditions, joint problems, or haven't exercised
                regularly in over a year. If you feel chest pain, dizziness, or severe
                discomfort during exercise, stop immediately.
              </p>
            </div>
            <label style={S.checkLabel}>
              <input
                type="checkbox"
                checked={disclaimerA}
                onChange={e => setDisclaimerA(e.target.checked)}
                style={S.checkbox}
              />
              <span style={S.checkText}>I understand and agree</span>
            </label>
            <label style={S.checkLabel}>
              <input
                type="checkbox"
                checked={disclaimerB}
                onChange={e => setDisclaimerB(e.target.checked)}
                style={S.checkbox}
              />
              <span style={S.checkText}>My data is stored on my Google Drive only</span>
            </label>
          </div>
        )}

        {/* ── ABOUT YOU ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>ABOUT YOU</div>

          <div style={S.field}>
            <label style={S.label}>Name (optional)</label>
            <input
              style={S.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div style={S.fieldRow}>
            <div style={{ ...S.field, flex: 1 }}>
              <label style={S.label}>{isSetup ? 'Age *' : 'Age'}</label>
              <input
                style={S.input}
                type="number"
                inputMode="numeric"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="—"
              />
            </div>
            <div style={{ ...S.field, flex: 2 }}>
              <label style={S.label}>Weight</label>
              <div style={S.weightRow}>
                <input
                  style={{ ...S.input, flex: 1 }}
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="—"
                />
                <div style={S.unitToggle}>
                  {['kg', 'lbs'].map(u => (
                    <button
                      key={u}
                      style={{ ...S.unitBtn, ...(weightUnit === u ? S.unitBtnActive : {}) }}
                      onClick={() => setWeightUnit(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Biological sex</label>
            <div style={S.sexRow}>
              {SEX_OPTIONS.map(opt => (
                <button
                  key={opt}
                  style={{ ...S.sexBtn, ...(biologicalSex === opt ? S.sexBtnActive : {}) }}
                  onClick={() => setBiologicalSex(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── HEALTH NOTES ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>HEALTH NOTES</div>
          <div style={S.field}>
            <label style={S.label}>Health notes & limitations</label>
            <textarea
              style={{ ...S.textarea, minHeight: '120px' }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={"e.g. left shoulder sensitivity,\navoid heavy hamstring curls,\nknee surgery 2023, takes magnesium"}
              rows={6}
            />
            <div style={S.fieldHint}>The AI reads this every session — be specific.</div>
          </div>
        </div>

        {/* Save */}
        <button
          style={{
            ...S.saveBtn,
            ...(saved ? S.saveBtnDone : {}),
            opacity: canSave ? 1 : 0.45,
          }}
          onClick={handleSave}
          disabled={!canSave}
        >
          {saved ? 'Saved ✓' : isSetup ? 'Get started →' : 'Save profile'}
        </button>

        {/* Export link (edit mode only) */}
        {!isSetup && (
          <button style={S.exportLink} onClick={handleExport}>
            Export data backup
          </button>
        )}

        <div style={{ height: 48 }} />
      </div>
    </div>
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
  setupSubtitle: {
    fontSize: 13,
    color: T.grey,
    textAlign: 'center',
    padding: '10px 16px 4px',
    fontWeight: 500,
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  section: {
    background: T.white,
    borderRadius: theme.radius.lg,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: theme.shadow.sm,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.grey,
  },
  disclaimerBox: {
    background: T.bg,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    maxHeight: '140px',
    overflowY: 'auto',
    border: `1.5px solid ${T.border}`,
  },
  disclaimerText: {
    fontSize: 13,
    color: T.grey,
    lineHeight: 1.6,
    fontWeight: 500,
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: T.yellow,
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkText: {
    fontSize: 14,
    fontWeight: 600,
    color: T.charcoal,
    lineHeight: 1.4,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  fieldRow: {
    display: 'flex',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: T.charcoal,
  },
  fieldHint: {
    fontSize: 12,
    color: T.grey,
    lineHeight: 1.4,
    marginTop: -2,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontSize: 15,
    fontWeight: 600,
    color: T.charcoal,
    outline: 'none',
    fontFamily: FONT,
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontSize: 14,
    fontWeight: 500,
    color: T.charcoal,
    outline: 'none',
    resize: 'none',
    fontFamily: FONT,
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  weightRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  unitToggle: {
    display: 'flex',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${T.border}`,
    overflow: 'hidden',
    flexShrink: 0,
  },
  unitBtn: {
    padding: '8px 10px',
    border: 'none',
    background: T.bg,
    fontSize: 13,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
  },
  unitBtnActive: {
    background: T.yellow,
    color: T.charcoal,
  },
  sexRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  sexBtn: {
    padding: '8px 14px',
    borderRadius: theme.radius.full,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontSize: 13,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
    whiteSpace: 'nowrap',
  },
  sexBtnActive: {
    background: T.yellow,
    border: `1.5px solid ${T.yellow}`,
    color: T.charcoal,
  },
  saveBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: theme.radius.lg,
    border: 'none',
    background: T.charcoal,
    fontSize: 16,
    fontWeight: 700,
    color: T.white,
    cursor: 'pointer',
    fontFamily: FONT,
    boxShadow: theme.shadow.sm,
    marginTop: 4,
    transition: 'background 0.2s',
  },
  saveBtnDone: {
    background: '#4A7C59',
  },
  exportLink: {
    background: 'none',
    border: 'none',
    color: T.grey,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    padding: '8px',
    fontFamily: FONT,
    textDecoration: 'underline',
    alignSelf: 'center',
  },
};
