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

// Find egg_data.json in the folder
async function findDataFile(accessToken, folderId) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and '${folderId}' in parents and trashed=false`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data.files && data.files.length > 0 ? data.files[0].id : null;
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
    handoff: {
      lastFullHandoffDate: null,
      lastSessionCompact: null,
    },
  };
}

// Add a completed session to data
export function addSession(data, session) {
  const updated = { ...data };
  updated.sessions = [session, ...(data.sessions || [])];

  // Update exercise history and PRs
  session.groups.forEach(group => {
    group.exercises.forEach(exercise => {
      if (exercise.status === 'done' && exercise.sets) {
        const maxWeight = Math.max(...exercise.sets.map(s => 
          parseFloat(s.weight) || 0));
        const maxReps = Math.max(...exercise.sets.map(s => 
          parseInt(s.reps) || 0));

        // Update exercise frequency
        if (!updated.exercises[exercise.name]) {
          updated.exercises[exercise.name] = {
            group: group.name,
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

        // Update PRs
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
  });

  return updated;
}
