import { useState } from 'react';
import { theme } from '../styles/theme';
import { buildDailyBriefing, buildFullHandoff, parseClaudeResponse } from '../services/promptBuilder';

const TIME_OPTIONS = [
  { label: '30',  value: 30  },
  { label: '60',  value: 60  },
  { label: '90',  value: 90  },
  { label: '120', value: 120 },
];

const LOCATION_OPTIONS = [
  { label: 'Full Gym',  value: 'Full Gym'  },
  { label: 'Hotel Gym', value: 'Hotel Gym' },
  { label: 'Outdoor',   value: 'Outdoor'   },
  { label: 'Home',      value: 'Home'      },
];

export default function HomeScreen({ data, driveLoading, driveConnected, onSessionStart, onOpenSettings }) {
  const [selectedTime, setSelectedTime]         = useState(60);
  const [selectedLocation, setSelectedLocation] = useState('Full Gym');
  const [isNewChat, setIsNewChat] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [parseError, setParseError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const buildPrompt = () => {
    const prompt = isNewChat
      ? buildFullHandoff(data, selectedTime, selectedLocation)
      : buildDailyBriefing(data, selectedTime, selectedLocation);
    console.log('Sessions loaded:', data?.sessions?.length);
    return prompt;
  };

  const handleCopy = async () => {
    const prompt = buildPrompt();

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLetsGo = () => {
    setParseError('');
    if (!pasteValue.trim()) {
      onSessionStart({
        parsed: null,
        timeAvailable: selectedTime,
        date: new Date().toISOString(),
      });
      return;
    }
    try {
      const parsed = parseClaudeResponse(pasteValue);
      if (!parsed.groups || parsed.groups.length === 0) {
        setParseError('Could not read AI response — make sure you copied the full response including the { brackets');
        return;
      }
      onSessionStart({
        parsed,
        timeAvailable: selectedTime,
        date: new Date().toISOString(),
      });
    } catch (err) {
      setParseError(err.message || 'Could not read AI response — make sure you copied the full response including the { brackets');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.egg}>🥚</span>
          <div>
            <div style={styles.appName}>EGG</div>
            <div style={styles.appSubtitle}>Everyday Gym Guru</div>
          </div>
        </div>
        <button style={styles.settingsBtn} onClick={onOpenSettings}>⚙️</button>
      </div>

      {/* History status line */}
      <div style={styles.historyStatus}>
        {driveLoading ? (
          'Loading your history…'
        ) : (() => {
          const sessions = data?.sessions;
          const count = sessions?.length ?? 0;
          const icon = driveConnected ? '☁' : '○';
          if (count === 0) return `${icon} No sessions yet — let's start!`;
          const last = sessions[0];
          const lastDate = last?.date
            ? new Date(last.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '';
          const groups = last?.groups
            ?.filter(g => g.name !== 'Warm-up' && g.name !== 'Cool-down')
            .map(g => g.name.replace(/\s*\(.*?\)/g, '').trim())
            .slice(0, 2).join(' + ') || '';
          return `${icon} ${count} sessions · Last: ${lastDate}${groups ? ` — ${groups}` : ''}`;
        })()}
      </div>

      {/* Time Selector */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>How long today?</div>
        <div style={styles.timeRow}>
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              style={{
                ...styles.timeBtn,
                ...(selectedTime === opt.value ? styles.timeBtnActive : {}),
              }}
              onClick={() => setSelectedTime(opt.value)}
            >
              <span style={styles.timeNum}>{opt.label}</span>
              <span style={styles.timeUnit}>MIN</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location Selector */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Where are you?</div>
        <div style={styles.locationRow}>
          {LOCATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              style={{
                ...styles.locationBtn,
                ...(selectedLocation === opt.value ? styles.locationBtnActive : {}),
              }}
              onClick={() => setSelectedLocation(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* New Chat Checkbox */}
      <div style={styles.checkRow}>
        <label style={styles.checkLabel}>
          <input
            type="checkbox"
            checked={isNewChat}
            onChange={e => setIsNewChat(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.checkText}>Starting a new AI chat today?</span>
        </label>
        <div style={styles.checkSubtext}>
          Check this when opening a fresh chat with Claude or any AI
        </div>
      </div>

      {/* Ask AI label */}
      <div style={styles.askAiRow}>
        <span style={styles.askAiLabel}>Ask AI for a workout?</span>
        <span style={styles.optionalBadge}>optional</span>
      </div>

      {/* Copy Button + Preview */}
      <div style={styles.copyRow}>
        <button style={styles.copyBtn} onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy prompt for AI'}
        </button>
        <button style={styles.previewBtn} onClick={() => setShowPreview(true)}>
          Preview
        </button>
      </div>

      {/* Paste Area */}
      <textarea
        style={styles.pasteArea}
        value={pasteValue}
        onChange={e => setPasteValue(e.target.value)}
        placeholder="paste AI response here…"
        rows={4}
      />

      {parseError && (
        <div style={styles.error}>{parseError}</div>
      )}

      {/* Let's Go Button */}
      <button
        style={styles.goBtn}
        onClick={handleLetsGo}
      >
        Let's go →
      </button>

      {/* Preview Modal */}
      {showPreview && (
        <div style={styles.previewOverlay} onClick={() => setShowPreview(false)}>
          <div style={styles.previewModal} onClick={e => e.stopPropagation()}>
            <div style={styles.previewHeader}>
              <span style={styles.previewTitle}>Prompt Preview</span>
              <button style={styles.previewClose} onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <pre style={styles.previewText}>{buildPrompt()}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 16px',
    minHeight: '100vh',
    background: theme.colors.bg,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyStatus: {
    fontSize: '12px',
    color: theme.colors.grey,
    fontWeight: '500',
    marginTop: '-8px',
    marginBottom: '-4px',
    letterSpacing: '0.1px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  egg: {
    fontSize: '28px',
  },
  appName: {
    fontSize: '22px',
    fontWeight: '800',
    color: theme.colors.charcoal,
    letterSpacing: '-0.5px',
    lineHeight: 1,
  },
  appSubtitle: {
    fontSize: '11px',
    color: theme.colors.grey,
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  settingsBtn: {
    fontSize: '20px',
    background: theme.colors.panel,
    border: 'none',
    borderRadius: theme.radius.full,
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.charcoal,
  },
  timeRow: {
    display: 'flex',
    gap: '8px',
  },
  timeBtn: {
    flex: 1,
    background: theme.colors.panel,
    border: `2px solid transparent`,
    borderRadius: theme.radius.md,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: theme.shadow.sm,
  },
  timeBtnActive: {
    background: theme.colors.yellow,
    border: `2px solid ${theme.colors.yellow}`,
  },
  timeNum: {
    fontSize: '20px',
    fontWeight: '800',
    color: theme.colors.charcoal,
    lineHeight: 1,
  },
  timeUnit: {
    fontSize: '9px',
    fontWeight: '600',
    color: theme.colors.grey,
    letterSpacing: '0.5px',
  },
  locationRow: {
    display: 'flex',
    gap: '6px',
  },
  locationBtn: {
    flex: 1,
    background: theme.colors.panel,
    border: '2px solid transparent',
    borderRadius: theme.radius.full,
    padding: '10px 4px',
    fontSize: '12.5px',
    fontWeight: '700',
    color: theme.colors.charcoal,
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: theme.shadow.sm,
    whiteSpace: 'nowrap',
  },
  locationBtnActive: {
    background: theme.colors.yellow,
    border: `2px solid ${theme.colors.yellow}`,
  },
  checkRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: theme.colors.yellow,
    cursor: 'pointer',
  },
  checkText: {
    fontSize: '15px',
    fontWeight: '500',
    color: theme.colors.charcoal,
  },
  checkSubtext: {
    fontSize: '12px',
    color: theme.colors.grey,
    paddingLeft: '28px',
    lineHeight: 1.4,
  },
  askAiRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  askAiLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.charcoal,
  },
  optionalBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: theme.colors.grey,
    background: theme.colors.panel,
    borderRadius: theme.radius.full,
    padding: '2px 8px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  copyRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'stretch',
  },
  copyBtn: {
    flex: 1,
    background: theme.colors.yellow,
    color: theme.colors.charcoal,
    border: 'none',
    borderRadius: theme.radius.lg,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: theme.shadow.sm,
    transition: 'all 0.15s ease',
  },
  previewBtn: {
    flexShrink: 0,
    background: theme.colors.panel,
    color: theme.colors.grey,
    border: `1.5px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '0 14px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  previewOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  previewModal: {
    width: '100%',
    maxHeight: '85vh',
    background: theme.colors.white,
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 18px 12px',
    borderBottom: `1px solid ${theme.colors.border}`,
    flexShrink: 0,
  },
  previewTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: theme.colors.charcoal,
  },
  previewClose: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: theme.colors.grey,
    cursor: 'pointer',
    padding: '4px',
  },
  previewText: {
    flex: 1,
    overflowY: 'auto',
    padding: '14px 18px 24px',
    fontSize: '12px',
    lineHeight: '1.6',
    color: theme.colors.charcoal,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
    fontFamily: 'monospace',
  },
  pasteArea: {
    width: '100%',
    background: theme.colors.white,
    border: `1.5px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '14px',
    fontSize: '15px',
    color: theme.colors.charcoal,
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  error: {
    fontSize: '13px',
    color: theme.colors.coral,
    textAlign: 'center',
    marginTop: '-8px',
  },
  goBtn: {
    width: '100%',
    background: theme.colors.charcoal,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.radius.lg,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: theme.shadow.sm,
    marginBottom: '20px',
  },
};
