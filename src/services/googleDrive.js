import { getAllExercises } from '../data/exercises';

const FOLDER_NAME = 'EGG Workouts';
const FILE_NAME = 'egg_data.json';

// Initialize Google Drive API
export async function initDrive(accessToken) {
  return { accessToken };
}

// Find or create EGG folder in Drive
async function getOrCreateFolder(accessToken) {
  // Search for existing folder
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folder = await createRes.json();
  return folder.id;
}

// Find egg_data.json anywhere in Drive (broad search to catch manually uploaded files)
async function findDataFile(accessToken, folderId) {
  // Search specifically for files, not folders, named egg_data.json
  const url = `https://www.googleapis.com/drive/v3/files?q=name%3D'egg_data.json'+and+mimeType!%3D'application%2Fvnd.google-apps.folder'+and+trashed%3Dfalse&fields=files(id%2Cname%2CmimeType%2Cparents)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  console.log('File search v2:', JSON.stringify(data));

  if (data.files && data.files.length > 0) {
    console.log('Found:', data.files[0].id);
    return data.files[0].id;
  }

  // Fallback: list all files in folder
  const url2 = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType!%3D'application%2Fvnd.google-apps.folder'+and+trashed%3Dfalse&fields=files(id%2Cname%2CmimeType)`;

  const res2 = await fetch(url2, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data2 = await res2.json();
  console.log('Folder contents:', JSON.stringify(data2));

  if (data2.files && data2.files.length > 0) {
    return data2.files[0].id;
  }

  return null;
}

// Load workout data from Drive
export async function loadData(accessToken) {
  try {
    const folderId = await getOrCreateFolder(accessToken);
    const fileId = await findDataFile(accessToken, folderId);

    if (!fileId) {
      // Return default empty data structure
      return getDefaultData();
    }

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return await res.json();
  } catch (err) {
    console.error('Error loading data:', err);
    return getDefaultData();
  }
}

// Save workout data to Drive
export async function saveData(accessToken, data) {
  try {
    const folderId = await getOrCreateFolder(accessToken);
    const fileId = await findDataFile(accessToken, folderId);
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });

    if (fileId) {
      // Update existing file
      await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: blob,
        }
      );
    } else {
      // Create new file
      const metadata = {
        name: FILE_NAME,
        parents: [folderId],
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], 
        { type: 'application/json' }));
      form.append('file', blob);

      await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        }
      );
    }
    return true;
  } catch (err) {
    console.error('Error saving data:', err);
    return false;
  }
}

// Default empty data structure
export function getDefaultData() {
  return {
    profile: {
      name: '',
      age: '',
      weight: '',
      notes: '',
    },
    sessions: [],
    exercises: {},
    prs: {},
    insights: [],
    pillars: {
      Strength:       null,
      Cardiovascular: null,
      Mobility:       null,
      Flexibility:    null,
      Balance:        null,
      Functional:     null,
      Recovery:       null,
    },
    handoff: {
      lastFullHandoffDate: null,
      lastSessionCompact: null,
    },
  };
}

function getSessionExercises(session) {
  return session.exercises
    ?? session.groups?.flatMap(g => g.exercises ?? [])
    ?? [];
}

// Get movement categories worked in the most recent session
export function getYesterdayMovements(data) {
  const sessions = data?.sessions;
  if (!sessions?.length) return [];
  const lastSession = sessions[0];
  const allExercises = getAllExercises();
  const movements = new Set();
  getSessionExercises(lastSession).forEach(exercise => {
    if (exercise.status !== 'done') return;
    const match = allExercises.find(e =>
      e.name.toLowerCase() === exercise.name.toLowerCase()
    );
    if (match?.movement) movements.add(match.movement);
  });
  return [...movements];
}

// Classify a session as Push/Pull and detect Core/Balance presence
function classifySession(session, allExercises) {
  const movements = new Set();
  getSessionExercises(session).forEach(ex => {
    if (ex.status !== 'done') return;
    const match = allExercises.find(e => e.name.toLowerCase() === ex.name.toLowerCase());
    if (match?.movement) movements.add(match.movement);
  });
  return {
    hasPush:    movements.has('UB Push') || movements.has('LB Push'),
    hasPull:    movements.has('UB Pull') || movements.has('LB Pull'),
    hasCore:    movements.has('Core'),
    hasBalance: movements.has('Balance'),
  };
}

// Suggest today's focus movements and top exercises per category
export function getSuggestedExercises(data) {
  const sessions     = data?.sessions || [];
  const allExercises = getAllExercises();
  const userExercises = data?.exercises || {};

  let todayType        = 'Push';
  let secondaryMovement = 'Core';

  if (sessions.length > 0) {
    const last = classifySession(sessions[0], allExercises);

    if (last.hasPush && !last.hasPull) {
      todayType = 'Pull';
    } else if (last.hasPull && !last.hasPush) {
      todayType = 'Push';
    }
    // Both or neither → keep default Push

    if (last.hasCore && !last.hasBalance) {
      secondaryMovement = 'Balance';
    } else if (last.hasBalance && !last.hasCore) {
      secondaryMovement = 'Core';
    }
  }

  const primaryMovements = todayType === 'Push'
    ? ['UB Push', 'LB Push']
    : ['UB Pull', 'LB Pull'];

  const categories = [...primaryMovements, secondaryMovement, 'Cardio', 'Stretch'];
  const exercisesByCategory = {};

  categories.forEach(category => {
    const catExs = allExercises.filter(e => e.movement === category);
    const ranked = catExs
      .map(e => ({ ...e, sessionCount: userExercises[e.name]?.sessions || 0 }))
      .sort((a, b) => b.sessionCount - a.sessionCount);
    exercisesByCategory[category] = ranked.slice(0, category === 'Cardio' ? 1 : 3);
  });

  return {
    todayType,
    primaryMovements,
    secondaryMovement,
    yesterdayMovements: getYesterdayMovements(data),
    exercisesByCategory,
  };
}

// Add a completed session to data
export function addSession(data, session) {
  const updated = { ...data };
  updated.sessions = [session, ...(data.sessions || [])];

  // Ensure pillars object exists
  if (!updated.pillars) {
    updated.pillars = {
      Strength: null, Cardiovascular: null, Mobility: null,
      Flexibility: null, Balance: null, Functional: null, Recovery: null,
    };
  }

  const allExerciseData = getAllExercises();
  const pillarsWorked   = new Set();

  // Handle both flat (new) and groups (legacy) session formats
  const sessionExercises = session.exercises
    ?? session.groups?.flatMap(g => g.exercises ?? [])
    ?? [];

  // Update exercise history, PRs, and track pillars
  sessionExercises.forEach(exercise => {
    if (exercise.status !== 'done') return;

    // Track pillars for this exercise
    const match = allExerciseData.find(e =>
      e.name.toLowerCase() === exercise.name.toLowerCase()
    );
    if (match?.pillars) {
      match.pillars.forEach(p => pillarsWorked.add(p));
    }

    // Update weight/rep history and PRs for non-cardio exercises
    if (exercise.sets && !exercise.isCardioExercise) {
      const maxWeight = Math.max(...exercise.sets.map(s =>
        parseFloat(s.weight) || 0));
      const maxReps = Math.max(...exercise.sets.map(s =>
        parseInt(s.reps) || 0));

      if (!updated.exercises[exercise.name]) {
        updated.exercises[exercise.name] = {
          sessions: 0,
          lastPerformed: null,
          lastWeight: null,
          lastReps: null,
        };
      }
      updated.exercises[exercise.name].sessions += 1;
      updated.exercises[exercise.name].lastPerformed = session.date;
      updated.exercises[exercise.name].lastWeight = maxWeight;
      updated.exercises[exercise.name].lastReps = maxReps;

      if (!updated.prs[exercise.name] ||
          maxWeight > (updated.prs[exercise.name].weight || 0)) {
        updated.prs[exercise.name] = {
          weight: maxWeight,
          reps: maxReps,
          date: session.date,
        };
      }
    }
  });

  // Update pillar last-worked dates
  pillarsWorked.forEach(pillar => {
    if (Object.prototype.hasOwnProperty.call(updated.pillars, pillar)) {
      updated.pillars[pillar] = session.date;
    }
  });

  return updated;
}
