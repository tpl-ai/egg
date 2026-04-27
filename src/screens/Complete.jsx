import { useState } from 'react';
import { theme } from '../styles/theme';
import { buildSessionSummary } from '../services/promptBuilder';

export default function CompleteScreen({ session, onDone }) {
  const [copied, setCopied] = useState(false);

  const totalExercises = session.groups.flatMap(g => g.exercises).length;
  const doneExercises = session.groups.flatMap(g => g.exercises)
    .filter(e => e.status === 'done').length;
  const skipped = session.groups.flatMap(g => g.exercises)
    .filter(e => e.status === 'unavailable' || e.status === 'skipped').length;

  const handleCopy = async () => {
    const summary = buildSessionSummary(session);
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const el = document.createElement('textarea');
      el.value = summary;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const groupNames = session.groups
    .filter(g => g.name !== 'Warm-up' && g.name !== 'Cool-down')
    .map(g => g.name)
    .join(' + ');

  const dateStr = new Date(session.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Egg emoji */}
        <div style={styles.emoji}>🥚</div>

        {/* Good work */}
        <div style={styles.title}>Good work.</div>

        {/* Session info */}
        <div style={styles.info}>
          {dateStr} — {groupNames} — {session.duration}min
        </div>

        {/* Quick stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{doneExercises}</span>
            <span style={styles.statLabel}>done</span>
          </div>
          {skipped > 0 && (
            <div style={styles.stat}>
              <span style={styles.statNum}>{skipped}</span>
              <span style={styles.statLabel}>skipped</span>
            </div>
          )}
          <div style={styles.stat}>
            <span style={styles.statNum}>{session.duration}</span>
            <span style={styles.statLabel}>min</span>
          </div>
        </div>

        {/* Copy button */}
        <button style={styles.copyBtn} onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy session for AI'}
        </button>

        {/* Done button */}
        <button style={styles.doneBtn} onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: theme.colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '320px',
  },
  emoji: {
    fontSize: '64px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: theme.colors.charcoal,
    letterSpacing: '-0.5px',
  },
  info: {
    fontSize: '15px',
    color: theme.colors.grey,
    textAlign: 'center',
  },
  statsRow: {
    display: 'flex',
    gap: '24px',
    margin: '8px 0',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '800',
    color: theme.colors.charcoal,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '11px',
    color: theme.colors.grey,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  copyBtn: {
    width: '100%',
    padding: '16px',
    background: theme.colors.yellow,
    border: 'none',
    borderRadius: theme.radius.lg,
    fontSize: '16px',
    fontWeight: '700',
    color: theme.colors.charcoal,
    cursor: 'pointer',
    marginTop: '8px',
  },
  doneBtn: {
    width: '100%',
    padding: '15px',
    background: theme.colors.charcoal,
    border: 'none',
    borderRadius: theme.radius.lg,
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.white,
    cursor: 'pointer',
  },
};
