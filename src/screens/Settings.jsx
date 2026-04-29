import { useState } from 'react';
import { theme } from '../styles/theme';

const T = theme.colors;
const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

export default function SettingsScreen({
  data, accessToken, onBack, onSave, onImportData, onDisconnect, onConnect,
}) {
  const profile = data?.profile || {};
  const [name, setName]                       = useState(profile.name || '');
  const [age, setAge]                         = useState(profile.age ? String(profile.age) : '');
  const [weight, setWeight]                   = useState(profile.weight ? String(profile.weight) : '');
  const [weightUnit, setWeightUnit]           = useState(profile.weightUnit || 'lbs');
  const [notes, setNotes]                     = useState(profile.notes || '');
  const [travelsRegularly, setTravelsRegularly] = useState(!!profile.travelsRegularly);
  const [primaryGoal, setPrimaryGoal]         = useState(profile.primaryGoal || '');
  const [saved, setSaved]                     = useState(false);

  const sessionCount = data?.sessions?.length ?? 0;
  const lastSync = data?.lastSync
    ? new Date(data.lastSync).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    : null;

  const handleSave = () => {
    onSave({
      ...profile,
      name: name.trim(),
      age: age ? parseInt(age) : '',
      weight: weight ? parseFloat(weight) : '',
      weightUnit,
      notes: notes.trim(),
      travelsRegularly,
      primaryGoal: primaryGoal.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!imported.sessions && !imported.profile) {
            alert('Invalid EGG data file.');
            return;
          }
          onImportData(imported);
          alert(`Imported! ${imported.sessions?.length ?? 0} sessions loaded.`);
        } catch {
          alert('Could not read file — make sure it is a valid egg_data.json.');
        }
      };
      reader.readAsText(file);
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 5 L7.5 10 L12.5 15" stroke={T.charcoal} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={S.headerTitle}>Settings</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={S.scroll}>
        {/* ── PROFILE ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>PROFILE</div>

          <div style={S.field}>
            <label style={S.label}>Name</label>
            <input
              style={S.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div style={S.fieldRow}>
            <div style={{ ...S.field, flex: 1 }}>
              <label style={S.label}>Age</label>
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
            <label style={S.label}>Limitations or notes for AI</label>
            <textarea
              style={S.textarea}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. left shoulder sensitivity, avoid hamstring curls"
              rows={3}
            />
          </div>

          <div style={S.field}>
            <div style={S.toggleRow}>
              <label style={S.label}>Travel regularly?</label>
              <button
                style={{ ...S.toggleBtn, ...(travelsRegularly ? S.toggleBtnOn : {}) }}
                onClick={() => setTravelsRegularly(t => !t)}
              >
                {travelsRegularly ? 'Yes' : 'No'}
              </button>
            </div>
            <div style={S.subtext}>If yes, AI will factor in hotel gym alternatives</div>
          </div>
        </div>

        {/* ── GOALS ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>GOALS</div>
          <div style={S.field}>
            <label style={S.label}>Primary goal</label>
            <textarea
              style={S.textarea}
              value={primaryGoal}
              onChange={e => setPrimaryGoal(e.target.value)}
              placeholder="e.g. 7 consecutive pull-ups, build muscle, lose weight"
              rows={2}
            />
          </div>
        </div>

        {/* ── GOOGLE DRIVE ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>GOOGLE DRIVE</div>
          {accessToken ? (
            <>
              <div style={S.driveRow}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>☁</span>
                <div>
                  <div style={S.driveConnectedText}>
                    Connected — {sessionCount} session{sessionCount !== 1 ? 's' : ''} synced
                  </div>
                  {lastSync && (
                    <div style={S.driveSubtext}>Last sync: {lastSync}</div>
                  )}
                </div>
              </div>
              <button style={S.dangerBtn} onClick={onDisconnect}>
                Disconnect Google Drive
              </button>
            </>
          ) : (
            <>
              <div style={S.driveRow}>
                <span style={{ fontSize: 18, color: T.grey, flexShrink: 0 }}>○</span>
                <div style={S.driveSubtext}>
                  Not connected — sessions saved locally only
                </div>
              </div>
              <button style={S.connectBtn} onClick={onConnect}>
                Connect Google Drive
              </button>
            </>
          )}
        </div>

        {/* ── DATA ── */}
        <div style={S.section}>
          <div style={S.sectionLabel}>DATA</div>
          <div style={S.dataRow}>
            <button style={S.dataBtn} onClick={handleExport}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Export data</span>
              <span style={S.dataBtnSub}>Downloads egg_data.json</span>
            </button>
            <button style={S.dataBtn} onClick={handleImport}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Import data</span>
              <span style={S.dataBtnSub}>Upload a JSON file</span>
            </button>
          </div>
        </div>

        {/* Save */}
        <button style={{ ...S.saveBtn, ...(saved ? S.saveBtnDone : {}) }} onClick={handleSave}>
          {saved ? 'Saved ✓' : 'Save Profile'}
        </button>

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
    fontSize: 18,
    fontWeight: 800,
    color: T.charcoal,
    letterSpacing: -0.4,
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
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleBtn: {
    padding: '6px 16px',
    borderRadius: theme.radius.full,
    border: `1.5px solid ${T.border}`,
    background: T.panel,
    fontSize: 13,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
  },
  toggleBtnOn: {
    background: T.yellow,
    border: `1.5px solid ${T.yellow}`,
    color: T.charcoal,
  },
  subtext: {
    fontSize: 12,
    color: T.grey,
    lineHeight: 1.4,
    marginTop: -4,
  },
  driveRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  driveConnectedText: {
    fontSize: 14,
    fontWeight: 700,
    color: T.charcoal,
    lineHeight: 1.3,
  },
  driveSubtext: {
    fontSize: 12,
    color: T.grey,
    marginTop: 2,
    lineHeight: 1.4,
  },
  connectBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: theme.radius.lg,
    border: 'none',
    background: T.yellow,
    fontSize: 15,
    fontWeight: 700,
    color: T.charcoal,
    cursor: 'pointer',
    fontFamily: FONT,
    boxShadow: theme.shadow.sm,
  },
  dangerBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: theme.radius.lg,
    border: `1.5px solid ${T.border}`,
    background: 'transparent',
    fontSize: 14,
    fontWeight: 700,
    color: T.grey,
    cursor: 'pointer',
    fontFamily: FONT,
  },
  dataRow: {
    display: 'flex',
    gap: 8,
  },
  dataBtn: {
    flex: 1,
    padding: '12px 10px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    color: T.charcoal,
    cursor: 'pointer',
    fontFamily: FONT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 3,
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  dataBtnSub: {
    fontSize: 11,
    fontWeight: 500,
    color: T.grey,
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
};
