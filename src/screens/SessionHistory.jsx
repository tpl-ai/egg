import { useState } from 'react';
import { theme } from '../styles/theme';
import { saveData } from '../services/googleDrive';

const T = theme.colors;
const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

export default function SessionHistoryScreen({ data, accessToken, onBack }) {
  const [sessions, setSessions] = useState(() => data?.sessions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textValue, setTextValue] = useState(() => {
    const s = (data?.sessions || [])[0];
    return s ? JSON.stringify(s, null, 2) : '';
  });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentSession = sessions[currentIndex];
  const hasChanges = textValue !== JSON.stringify(currentSession, null, 2);

  const handleNavigate = (dir) => {
    const next = currentIndex + dir;
    if (next < 0 || next >= sessions.length) return;
    setCurrentIndex(next);
    setTextValue(JSON.stringify(sessions[next], null, 2));
    setSaveError('');
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError('');
    let parsed;
    try {
      parsed = JSON.parse(textValue);
    } catch {
      setSaveError('Invalid JSON — check for missing commas or brackets');
      return;
    }
    setSaving(true);
    const normalized = JSON.stringify(parsed, null, 2);
    const updated = sessions.map((s, i) => (i === currentIndex ? parsed : s));
    try {
      await saveData(accessToken, { ...data, sessions: updated });
      setSessions(updated);
      setTextValue(normalized);
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

  const dateStr = currentSession?.date
    ? new Date(currentSession.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—';
  const dur = currentSession?.duration ?? '?';

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack} aria-label="Back">
          <BackChevron />
        </button>
        <span style={S.headerTitle}>Session History</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={S.scroll}>
        {/* Context bar */}
        <div style={S.contextBar}>
          Session {currentIndex + 1} of {sessions.length} · {dateStr} · {dur}min
        </div>

        {/* Nav row */}
        <div style={S.navRow}>
          <button
            style={{ ...S.navBtn, opacity: currentIndex === 0 ? 0.3 : 1 }}
            onClick={() => handleNavigate(-1)}
            disabled={currentIndex === 0}
            aria-label="Newer session"
          >
            ←
          </button>
          <span style={S.navHint}>
            {currentIndex === 0
              ? 'Newest'
              : currentIndex === sessions.length - 1
              ? 'Oldest'
              : ''}
          </span>
          <button
            style={{ ...S.navBtn, opacity: currentIndex >= sessions.length - 1 ? 0.3 : 1 }}
            onClick={() => handleNavigate(1)}
            disabled={currentIndex >= sessions.length - 1}
            aria-label="Older session"
          >
            →
          </button>
        </div>

        {/* JSON editor */}
        <textarea
          style={S.textarea}
          value={textValue}
          onChange={e => {
            setTextValue(e.target.value);
            setSaveError('');
            setSaved(false);
          }}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />

        {saveError && <div style={S.error}>{saveError}</div>}

        {/* Save button */}
        <button
          style={{
            ...S.saveBtn,
            ...(saved ? S.saveBtnDone : {}),
            opacity: saving ? 0.6 : 1,
          }}
          onClick={handleSave}
          disabled={saving}
        >
          {hasChanges && !saved && <span style={S.dirtyDot} />}
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>

        <div style={{ height: 40 }} />
      </div>
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
  contextBar: {
    fontSize: 12,
    fontWeight: 600,
    color: T.grey,
    background: T.panel,
    borderRadius: theme.radius.md,
    padding: '8px 12px',
    letterSpacing: 0.1,
  },
  navRow: {
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
    transition: 'opacity 0.15s',
  },
  navHint: {
    fontSize: 12,
    fontWeight: 600,
    color: T.grey,
    flex: 1,
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    minHeight: '420px',
    background: T.white,
    border: `1.5px solid ${T.border}`,
    borderRadius: theme.radius.md,
    padding: '12px',
    fontSize: 12,
    fontFamily: 'ui-monospace, "SF Mono", "Menlo", monospace',
    color: T.charcoal,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.55,
    boxSizing: 'border-box',
  },
  error: {
    fontSize: 13,
    fontWeight: 600,
    color: T.coral,
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
