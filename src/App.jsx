import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { globalStyles, theme } from './styles/theme';
import { loadData, saveData, getDefaultData, addSession } from './services/googleDrive';
import HomeScreen from './screens/Home';
import WorkoutScreen from './screens/Workout';
import CompleteScreen from './screens/Complete';
import SettingsScreen from './screens/Settings';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Remove exercises with no real logged data; remove empty groups
function cleanSession(session) {
  return {
    ...session,
    groups: (session.groups || [])
      .map(group => ({
        ...group,
        exercises: (group.exercises || []).filter(exercise => {
          if (!exercise.sets || exercise.sets.length === 0) return false;
          return exercise.sets.some(set =>
            (parseFloat(set.weight) > 0) ||
            (parseInt(set.reps) > 0) ||
            (parseInt(set.duration) > 0)
          );
        }),
      }))
      .filter(group => group.exercises.length > 0),
  };
}

// One-time migration: clean all existing sessions in loaded data
function cleanExistingSessionData(data) {
  if (!data?.sessions) return data;
  const cleaned = data.sessions
    .map(s => cleanSession(s))
    .filter(s => s.groups && s.groups.length > 0 && s.groups.some(g => g.exercises?.length > 0));
  if (cleaned.length === data.sessions.length &&
      cleaned.every((s, i) => s.groups.length === data.sessions[i].groups.length)) return data;
  return { ...data, sessions: cleaned };
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
  const [screen, setScreen] = useState('home'); // home | workout | complete | settings
  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(getDefaultData());
  const [loading, setLoading] = useState(true);
  const [driveLoading, setDriveLoading] = useState(false);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [pendingResume, setPendingResume] = useState(null); // unfinished session

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    prompt: 'consent',
    redirect_uri: window.location.origin,
    onSuccess: async (response) => {
      console.log('OAuth success:', response);
      console.log('Token:', response.access_token);

      const token = response.access_token;

      // Save token to localStorage
      localStorage.setItem('egg_token', token);
      console.log('Token saved:', localStorage.getItem('egg_token') ? 'YES' : 'NO');

      setAccessToken(token);
      setAuthError('');
      setLoading(true);

      try {
        const loaded = await loadData(token);
        const cleaned = cleanExistingSessionData(loaded);
        console.log('Sessions loaded:', cleaned?.sessions?.length);
        setData(cleaned);
      } catch (err) {
        console.error('Load error:', err);
      }
      setLoading(false);
    },
    onError: (err) => {
      console.error('Login failed:', err);
      setAuthError('Google sign-in failed. Please try again.');
    },
  });

  // On mount: show HomeScreen immediately, then validate token + fetch Drive in background
  useEffect(() => {
    const init = async () => {
      console.log('App init');
      const savedToken = localStorage.getItem('egg_token');
      console.log('Saved token:', savedToken ? 'found' : 'not found');

      const savedData = localStorage.getItem('egg_data');
      if (savedData) {
        try { setData(cleanExistingSessionData(JSON.parse(savedData))); } catch {}
      }

      // Check for unfinished workout session
      const savedSession = localStorage.getItem('egg_current_session');
      if (savedSession) {
        try { setPendingResume(JSON.parse(savedSession)); } catch {}
      }

      if (savedToken) {
        try {
          const test = await fetch(
            'https://www.googleapis.com/drive/v3/about?fields=user',
            { headers: { Authorization: `Bearer ${savedToken}` } }
          );
          console.log('Token test:', test.status);

          if (!test.ok) {
            console.log('Token expired');
            localStorage.removeItem('egg_token');
            setLoading(false);
            return;
          }

          setAccessToken(savedToken);
          const loaded = await loadData(savedToken);
          const cleaned = cleanExistingSessionData(loaded);
          console.log('Sessions from saved token:', cleaned?.sessions?.length);
          setData(cleaned);
          if (cleaned !== loaded) {
            saveData(savedToken, cleaned).catch(() => {});
            localStorage.setItem('egg_data', JSON.stringify(cleaned));
          }
        } catch (err) {
          console.error('Init error:', err);
          localStorage.removeItem('egg_token');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // Save to localStorage as backup whenever data changes
  useEffect(() => {
    if (data && data.sessions?.length > 0) {
      localStorage.setItem('egg_data', JSON.stringify(data));
    }
  }, [data]);

  const handleSessionStart = (config) => {
    setPendingResume(null); // clear any pending resume when starting fresh
    setSessionConfig(config);
    setScreen('workout');
  };

  const handleResumeContinue = () => {
    // Restore workout from saved session
    const saved = pendingResume;
    setPendingResume(null);
    setSessionConfig({
      date: saved.date,
      timeAvailable: saved.timeAvailable,
      parsed: saved.parsed,
    });
    setScreen('workout');
  };

  const handleResumeDiscard = () => {
    localStorage.removeItem('egg_current_session');
    setPendingResume(null);
  };

  // Save partial session to Drive after each exercise Done
  const handleExerciseDone = async (partialSession) => {
    if (!accessToken) return;
    try {
      await saveData(accessToken, { ...data, _partialSession: partialSession });
    } catch {}
  };

  const handleWorkoutFinish = async (session) => {
    const clean = cleanSession(session);
    const updated = addSession(data, clean);
    setData(updated);
    setCompletedSession(clean);
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

  const handleSaveProfile = (profile) => {
    const updated = { ...data, profile };
    setData(updated);
    localStorage.setItem('egg_data', JSON.stringify(updated));
    if (accessToken) {
      saveData(accessToken, updated).catch(() => {});
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('egg_token');
    setAccessToken(null);
  };

  const handleImportData = (importedData) => {
    const cleaned = cleanExistingSessionData(importedData);
    setData(cleaned);
    localStorage.setItem('egg_data', JSON.stringify(cleaned));
    if (accessToken) {
      saveData(accessToken, cleaned).catch(() => {});
    }
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
      {authError && (
        <div style={styles.errorBanner}>{authError}</div>
      )}

      {/* Unfinished session banner */}
      {pendingResume && screen === 'home' && (
        <div style={styles.resumeBanner}>
          <div style={styles.resumeText}>
            Unfinished session from {new Date(pendingResume.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Continue?
          </div>
          <div style={styles.resumeBtns}>
            <button style={styles.resumeBtn} onClick={handleResumeContinue}>Continue</button>
            <button style={styles.discardBtn} onClick={handleResumeDiscard}>Discard</button>
          </div>
        </div>
      )}

      {screen === 'home' && (
        <HomeScreen
          data={data}
          driveLoading={driveLoading}
          driveConnected={!!accessToken}
          onSessionStart={handleSessionStart}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'workout' && sessionConfig && (
        <WorkoutScreen
          sessionConfig={sessionConfig}
          data={data}
          onFinish={handleWorkoutFinish}
          initialGroups={pendingResume?.groups ?? null}
          onExerciseDone={handleExerciseDone}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'complete' && completedSession && (
        <CompleteScreen
          session={completedSession}
          onDone={handleDone}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          data={data}
          accessToken={accessToken}
          onBack={() => setScreen('home')}
          onSave={handleSaveProfile}
          onImportData={handleImportData}
          onDisconnect={handleDisconnect}
          onConnect={login}
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
  resumeBanner: {
    background: theme.colors.panel,
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  resumeText: {
    fontSize: '13px',
    color: theme.colors.charcoal,
    fontWeight: '600',
    marginBottom: '8px',
  },
  resumeBtns: {
    display: 'flex',
    gap: '8px',
  },
  resumeBtn: {
    flex: 1,
    padding: '8px',
    background: theme.colors.yellow,
    border: 'none',
    borderRadius: theme.radius.md,
    fontSize: '13px',
    fontWeight: '700',
    color: theme.colors.charcoal,
    cursor: 'pointer',
  },
  discardBtn: {
    flex: 1,
    padding: '8px',
    background: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.grey,
    cursor: 'pointer',
  },
};

export default App;
