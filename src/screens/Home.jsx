import { useState } from 'react';
import { theme } from '../styles/theme';
import { buildDailyBriefing, buildFullHandoff, parseClaudeResponse } from '../services/promptBuilder';

const TIME_OPTIONS = [
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '45', value: 45 },
  { label: '60+', value: 60 },
];

export default function HomeScreen({ data, onSessionStart }) {
  const [selectedTime, setSelectedTime] = useState(45);
  const [isNewChat, setIsNewChat] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleCopy = async () => {
    const prompt = isNewChat
      ? buildFullHandoff(data, selectedTime)
      : buildDailyBriefing(data, selectedTime);

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
    if (!pasteValue.trim()) {
      setParseError('Please paste your AI response first.');
      return;
    }
    setParseError('');
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
        <button style={styles.settingsBtn} onClick={() => {}}>⚙️</button>
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

      {/* Copy Button */}
      <button style={styles.copyBtn} onClick={handleCopy}>
        {copied ? '✓ Copied!' : 'Copy prompt for AI'}
      </button>

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
        style={{
          ...styles.goBtn,
          opacity: pasteValue.trim() ? 1 : 0.5,
        }}
        onClick={handleLetsGo}
      >
        Let's go →
      </button>
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
  copyBtn: {
    width: '100%',
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
