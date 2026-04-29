import { useState, useEffect } from 'react';

const FONT = "'Nunito', system-ui, -apple-system, sans-serif";

const C = {
  bg: '#FAF3E0',
  charcoal: '#2C2416',
  grey: '#8A8078',
  yellow: '#F5C518',
  coral: '#E8856A',
};

export default function DriveConnectScreen({ onConnect, connectError }) {
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (connectError) setConnecting(false);
  }, [connectError]);

  const handleConnect = () => {
    setConnecting(true);
    onConnect();
  };

  return (
    <div style={S.container}>
      <div style={S.content}>
        <div style={S.egg}>🥚</div>
        <div style={S.appName}>EGG</div>
        <div style={S.subtitle}>Everyday Gym Guru</div>

        <div style={S.description}>
          Your workout data is stored securely on your own Google Drive.
          Connect once to get started.
        </div>

        <button style={S.connectBtn} onClick={handleConnect} disabled={connecting}>
          {connecting ? 'Connecting…' : 'Connect Google Drive'}
        </button>

        {connectError && (
          <div style={S.error}>{connectError}</div>
        )}

        <div style={S.privacy}>
          Your data stays on your Drive.{'\n'}We never store it on our servers.
        </div>
      </div>
    </div>
  );
}

const S = {
  container: {
    minHeight: '100vh',
    background: C.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT,
    padding: '40px 28px',
    boxSizing: 'border-box',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
  },
  egg: {
    fontSize: '64px',
    lineHeight: 1,
    marginBottom: '4px',
  },
  appName: {
    fontSize: '38px',
    fontWeight: '800',
    color: C.charcoal,
    letterSpacing: '-1.5px',
    lineHeight: 1,
  },
  subtitle: {
    fontSize: '12px',
    color: C.grey,
    fontWeight: '700',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    marginTop: '-6px',
    marginBottom: '20px',
  },
  description: {
    fontSize: '16px',
    color: C.charcoal,
    lineHeight: '1.6',
    fontWeight: '500',
    marginBottom: '8px',
  },
  connectBtn: {
    width: '100%',
    padding: '18px',
    background: C.yellow,
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '800',
    color: C.charcoal,
    cursor: 'pointer',
    fontFamily: FONT,
    boxShadow: '0 4px 14px rgba(245,197,24,0.4)',
    transition: 'opacity 0.15s',
    opacity: 1,
  },
  error: {
    fontSize: '13px',
    color: C.coral,
    textAlign: 'center',
    fontWeight: '600',
  },
  privacy: {
    fontSize: '12px',
    color: C.grey,
    lineHeight: '1.6',
    marginTop: '4px',
    whiteSpace: 'pre-line',
  },
};
