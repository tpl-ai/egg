import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { globalStyles, theme } from './styles/theme';
import { loadData, saveData, getDefaultData, addSession } from './services/googleDrive';
import DriveConnectScreen from './screens/DriveConnect';
import HomeScreen from './screens/Home';
import WorkoutScreen from './screens/Workout';
import CompleteScreen from './screens/Complete';
import SettingsScreen from './screens/Settings';
import SessionHistoryScreen from './screens/SessionHistory';

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
  // State machine: connecting | needs_drive | needs_setup | ready | workout | complete | settings | sessionHistory
  const [appState, setAppState] = useState('connecting');
  const [accessToken, setAccessToken] = useState(null);
  const [data, setData] = useState(getDefaultData());
  const [sessionConfig, setSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [pendingResume, setPendingResume] = useState(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    prompt: 'consent',
    onSuccess: async (response) => {
      const token = response.access_token;
      localStorage.setItem('egg_token', token);
      setAccessToken(token);
      setAuthError('');
      try {
        const loaded = await loadData(token);
        const cleaned = cleanExistingSessionData(loaded);
        setData(cleaned);
        localStorage.setItem('egg_data', JSON.stringify(cleaned));
        if (cleaned?.profile?.disclaimerAccepted) {
          setAppState('ready');
        } else {
          setAppState('needs_setup');
        }
      } catch {
        setAppState('needs_setup');
      }
    },
    onError: () => {
      setAuthError('Google sign-in failed. Please try again.');
    },
  });

  // On mount: validate saved token, load data, determine state
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('egg_token');

      const savedData = localStorage.getItem('egg_data');
      if (savedData) {
        try { setData(cleanExistingSessionData(JSON.parse(savedData))); } catch {}
      }

      const savedSession = localStorage.getItem('egg_current_session');
      if (savedSession) {
        try { setPendingResume(JSON.parse(savedSession)); } catch {}
      }

      if (!savedToken) {
        setAppState('needs_drive');
        return;
      }

      try {
        const test = await fetch(
          'https://www.googleapis.com/drive/v3/about?fields=user',
          { headers: { Authorization: `Bearer ${savedToken}` } }
        );
        if (!test.ok) {
          localStorage.removeItem('egg_token');
          setAppState('needs_drive');
          return;
        }
        setAccessToken(savedToken);
        const loaded = await loadData(savedToken);
        const cleaned = cleanExistingSessionData(loaded);
        setData(cleaned);
        if (cleaned !== loaded) {
          saveData(savedToken, cleaned).catch(() => {});
          localStorage.setItem('egg_data', JSON.stringify(cleaned));
        }
        if (cleaned?.profile?.disclaimerAccepted) {
          setAppState('ready');
        } else {
          setAppState('needs_setup');
        }
      } catch {
        localStorage.removeItem('egg_token');
        setAppState('needs_drive');
      }
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
    setPendingResume(null);
    setSessionConfig(config);
    setAppState('workout');
  };

  const handleResumeContinue = () => {
    const saved = pendingResume;
    setPendingResume(null);
    setSessionConfig({
      date: saved.date,
      timeAvailable: saved.timeAvailable,
      parsed: saved.parsed,
    });
    setAppState('workout');
  };

  const handleResumeDiscard = () => {
    localStorage.removeItem('egg_current_session');
    setPendingResume(null);
  };

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
    setAppState('complete');
    if (accessToken) {
      try {
        await saveData(accessToken, updated);
      } catch {}
    }
    localStorage.setItem('egg_data', JSON.stringify(updated));
  };

  const handleDone = () => {
    setAppState('ready');
    setSessionConfig(null);
    setCompletedSession(null);
  };

  // Setup mode: add disclaimerAccepted, then go to ready
  const handleSetupSave = (profile) => {
    const updated = { ...data, profile: { ...profile, disclaimerAccepted: true } };
    setData(updated);
    localStorage.setItem('egg_data', JSON.stringify(updated));
    if (accessToken) {
      saveData(accessToken, updated).catch(() => {});
    }
    setTimeout(() => setAppState('ready'), 800);
  };

  // Edit mode: save profile, return to ready
  const handleSaveProfile = (profile) => {
    const updated = { ...data, profile };
    setData(updated);
    localStorage.setItem('egg_data', JSON.stringify(updated));
    if (accessToken) {
      saveData(accessToken, updated).catch(() => {});
    }
    setTimeout(() => setAppState('ready'), 800);
  };

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (appState === 'connecting') {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingEmoji}>🥚</div>
        <div style={styles.loadingText}>Loading EGG…</div>
      </div>
    );
  }

  return (
    <div style={styles.appWrapper}>

      {appState === 'needs_drive' && (
        <DriveConnectScreen onConnect={login} connectError={authError} />
      )}

      {appState === 'needs_setup' && (
        <SettingsScreen
          mode="setup"
          data={data}
          onSave={handleSetupSave}
        />
      )}

      {appState === 'ready' && (
        <>
          {pendingResume && (
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
          <HomeScreen
            data={data}
            driveLoading={false}
            driveConnected={!!accessToken}
            onSessionStart={handleSessionStart}
            onOpenSettings={() => setAppState('settings')}
          />
        </>
      )}

      {appState === 'workout' && sessionConfig && (
        <WorkoutScreen
          sessionConfig={sessionConfig}
          data={data}
          onFinish={handleWorkoutFinish}
          initialGroups={pendingResume?.groups ?? null}
          onExerciseDone={handleExerciseDone}
          onOpenSettings={() => setAppState('settings')}
        />
      )}

      {appState === 'complete' && completedSession && (
        <CompleteScreen
          session={completedSession}
          onDone={handleDone}
        />
      )}

      {appState === 'settings' && (
        <SettingsScreen
          mode="edit"
          data={data}
          onBack={() => setAppState('ready')}
          onSave={handleSaveProfile}
          onNavigateToSessionHistory={() => setAppState('sessionHistory')}
        />
      )}

      {appState === 'sessionHistory' && (
        <SessionHistoryScreen
          data={data}
          accessToken={accessToken}
          onBack={() => setAppState('settings')}
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
