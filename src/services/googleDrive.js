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
      if (exercise.status === 'done' && exercise.sets && !exercise.isCardioExercise) {
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
