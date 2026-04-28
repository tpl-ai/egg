import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { globalStyles, theme } from './styles/theme';
import { loadData, saveData, getDefaultData, addSession } from './services/googleDrive';
import HomeScreen from './screens/Home';
import WorkoutScreen from './screens/Workout';
import CompleteScreen from './screens/Complete';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Validate a stored access token by calling Google's tokeninfo endpoint.
// Returns true if valid, false if expired or invalid.
async function validateToken(token) {
  try {
    const r = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    return r.ok;
  } catch {
    return false;
  }
}

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <style>{globalStyles}</style>
      <EggApp />
    </GoogleOAuthProvider>
  );
}

function EggApp() {
  const [screen, setScreen] = useState('home'); // home | workout | complete
  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(getDefaultData());
  const [loading, setLoading] = useState(true);
  const [driveLoading, setDriveLoading] = useState(false);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [authError, setAuthError] = useState('');

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.file',
    redirect_uri: window.location.origin,
    onSuccess: async (response) => {
      const token = response.access_token;
      localStorage.setItem('egg_access', token);
      setAccessToken(token);
      setAuthError('');
      setDriveLoading(true);
      try {
        const loaded = await loadData(token);
        setData(loaded);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
      setDriveLoading(false);
    },
    onError: (err) => {
      console.error('Login failed:', err);
      setAuthError('Google sign-in failed. Please try again.');
      setLoading(false);
    },
  });

  // On mount: restore localStorage data immediately, then validate token + fetch Drive
  useEffect(() => {
    const storedToken = localStorage.getItem('egg_access');
    const savedData = localStorage.getItem('egg_data');
    if (savedData) {
      try { setData(JSON.parse(savedData)); } catch {}
    }
    setLoading(false); // Show HomeScreen immediately with cached data
    if (storedToken) {
      setDriveLoading(true);
      validateToken(storedToken).then(valid => {
        if (!valid) {
          localStorage.removeItem('egg_access');
          setDriveLoading(false);
          return;
        }
        setAccessToken(storedToken);
        loadData(storedToken)
          .then(d => setData(d))
          .catch(() => {})
          .finally(() => setDriveLoading(false));
      });
    }
  }, []);

  // Save to localStorage as backup whenever data changes
  useEffect(() => {
    if (data && data.sessions?.length > 0) {
      localStorage.setItem('egg_data', JSON.stringify(data));
    }
  }, [data]);

  const handleSessionStart = (config) => {
    setSessionConfig(config);
    setScreen('workout');
  };

  const handleWorkoutFinish = async (session) => {
    const updated = addSession(data, session);
    setData(updated);
    setCompletedSession(session);
    setScreen('complete');

    // Save to Drive if connected
    if (accessToken) {
      try {
        await saveData(accessToken, updated);
      } catch (err) {
        console.error('Failed to save to Drive:', err);
      }
    }
    localStorage.setItem('egg_data', JSON.stringify(updated));
  };

  const handleDone = () => {
    setScreen('home');
    setSessionConfig(null);
    setCompletedSession(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingEmoji}>🥚</div>
        <div style={styles.loadingText}>Loading EGG…</div>
      </div>
    );
  }

  return (
    <div style={styles.appWrapper}>
      {/* Google Auth Banner - shown when not connected */}
      {!accessToken && screen === 'home' && (
        <div style={styles.authBanner}>
          <div style={styles.authText}>
            Connect Google Drive to sync across devices
          </div>
          <button style={styles.authBtn} onClick={() => login()}>
            Connect
          </button>
        </div>
      )}

      {authError && (
        <div style={styles.errorBanner}>{authError}</div>
      )}

      {screen === 'home' && (
        <HomeScreen
          data={data}
          driveLoading={driveLoading}
          onSessionStart={handleSessionStart}
        />
      )}

      {screen === 'workout' && sessionConfig && (
        <WorkoutScreen
          sessionConfig={sessionConfig}
          data={data}
          onFinish={handleWorkoutFinish}
        />
      )}

      {screen === 'complete' && completedSession && (
        <CompleteScreen
          session={completedSession}
          onDone={handleDone}
        />
      )}
    </div>
  );
}

const styles = {
  appWrapper: {
    maxWidth: '430px',
    margin: '0 auto',
    minHeight: '100vh',
    background: theme.colors.bg,
    position: 'relative',
  },
  loadingScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: theme.colors.bg,
  },
  loadingEmoji: {
    fontSize: '64px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: theme.colors.grey,
    fontWeight: '500',
  },
  authBanner: {
    background: theme.colors.panel,
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  authText: {
    fontSize: '13px',
    color: theme.colors.grey,
    flex: 1,
  },
  authBtn: {
    background: theme.colors.yellow,
    border: 'none',
    borderRadius: theme.radius.full,
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: theme.colors.charcoal,
    cursor: 'pointer',
    flexShrink: 0,
  },
  errorBanner: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '10px 16px',
    fontSize: '13px',
    textAlign: 'center',
  },
};

export default App;
