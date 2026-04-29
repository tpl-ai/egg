export const MUSCLE_GROUPS = [
  'Warm-up',
  'Cardio',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Arms',
  'Core',
  'Cool-down',
];

export const EXERCISES = {
  'Warm-up': [
    { name: 'Arm Circles',         equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Hip Swings',          equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Leg Swings',          equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Shoulder Rotations',  equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Thoracic Rotations',  equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Ankle Rolls',         equipment: 'bodyweight', pillars: ['Mobility'] },
    { name: 'Dynamic Lunges',      equipment: 'bodyweight', pillars: ['Mobility', 'Functional'] },
    { name: 'Jumping Jacks',       equipment: 'bodyweight', pillars: ['Cardiovascular', 'Mobility'] },
  ],
  'Cardio': [
    { name: 'Running',           equipment: 'outdoor',    type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Running (outdoor)', equipment: 'outdoor',    type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Treadmill',         equipment: 'machine',    type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Walking',           equipment: 'outdoor',    type: 'duration', cardioType: 'walking',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Hiking',            equipment: 'outdoor',    type: 'duration', cardioType: 'hiking',     trackDistance: true,  distanceUnit: 'km', trackElevation: true, pillars: ['Cardiovascular', 'Functional'] },
    { name: 'Cycling (outdoor)', equipment: 'outdoor',    type: 'duration', cardioType: 'cycling',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Stationary Bike',   equipment: 'machine',    type: 'duration', cardioType: 'cycling',    pillars: ['Cardiovascular'] },
    { name: 'Elliptical',        equipment: 'machine',    type: 'duration', cardioType: 'elliptical', trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'] },
    { name: 'Stairmaster',       equipment: 'machine',    type: 'duration', cardioType: 'stairs',     trackFloors: true,    pillars: ['Cardiovascular', 'Functional'] },
    { name: 'Stairs',            equipment: 'outdoor',    type: 'duration', cardioType: 'stairs',     trackFloors: true,    pillars: ['Cardiovascular', 'Functional'] },
    { name: 'Rowing Machine',    equipment: 'machine',    type: 'duration', cardioType: 'rowing',     trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'] },
    { name: 'SkiErg',            equipment: 'machine',    type: 'duration', cardioType: 'skiing',     trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'] },
    { name: 'Swimming',          equipment: 'outdoor',    type: 'duration', cardioType: 'swimming',   trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'] },
    { name: 'Jump Rope',         equipment: 'equipment',  type: 'duration', cardioType: 'jump_rope',  pillars: ['Cardiovascular', 'Balance'] },
  ],
  'Chest': [
    { name: 'Bench Press',           equipment: 'barbell',    alternatives: ['Dumbbell Press', 'Push-ups', 'Smith Machine Press'], pillars: ['Strength'] },
    { name: 'Dumbbell Press',        equipment: 'dumbbell',   alternatives: ['Bench Press', 'Push-ups'],                          pillars: ['Strength'] },
    { name: 'Incline Bench Press',   equipment: 'barbell',    alternatives: ['Incline Dumbbell Press', 'Push-ups'],               pillars: ['Strength'] },
    { name: 'Incline Dumbbell Press',equipment: 'dumbbell',   alternatives: ['Incline Bench Press'],                              pillars: ['Strength'] },
    { name: 'Decline Bench Press',   equipment: 'barbell',    alternatives: ['Dumbbell Press'],                                   pillars: ['Strength'] },
    { name: 'Pec Fly Machine',       equipment: 'machine',    alternatives: ['Dumbbell Fly', 'Cable Fly', 'Cable Crossover'],     pillars: ['Strength'] },
    { name: 'Dumbbell Fly',          equipment: 'dumbbell',   alternatives: ['Pec Fly Machine', 'Cable Fly'],                     pillars: ['Strength'] },
    { name: 'Cable Fly',             equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  pillars: ['Strength'] },
    { name: 'Cable Crossover',       equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  pillars: ['Strength'] },
    { name: 'Push-ups',              equipment: 'bodyweight', alternatives: ['Bench Press', 'Dumbbell Press'],                    pillars: ['Strength', 'Functional'] },
    { name: 'Dips',                  equipment: 'bodyweight', alternatives: ['Push-ups', 'Bench Press'],                          pillars: ['Strength', 'Functional'] },
    { name: 'Smith Machine Press',   equipment: 'machine',    alternatives: ['Bench Press', 'Dumbbell Press'],                    pillars: ['Strength'] },
  ],
  'Back': [
    { name: 'Lat Pulldown',          equipment: 'cable',      alternatives: ['Pull-ups', 'Assisted Pull-ups'],                    pillars: ['Strength'] },
    { name: 'Pull-ups',              equipment: 'bodyweight', alternatives: ['Lat Pulldown', 'Assisted Pull-ups'],                 pillars: ['Strength', 'Functional'] },
    { name: 'Assisted Pull-ups',     equipment: 'machine',    alternatives: ['Pull-ups', 'Lat Pulldown'],                         pillars: ['Strength'] },
    { name: 'Cable Rows',            equipment: 'cable',      alternatives: ['Dumbbell Rows', 'Machine Rows', 'TRX Rows'],        pillars: ['Strength'] },
    { name: 'Seated Row Machine',    equipment: 'machine',    alternatives: ['Cable Rows', 'Dumbbell Rows'],                      pillars: ['Strength'] },
    { name: 'Dumbbell Rows',         equipment: 'dumbbell',   alternatives: ['Cable Rows', 'Seated Row Machine'],                 pillars: ['Strength'] },
    { name: 'Barbell Rows',          equipment: 'barbell',    alternatives: ['Dumbbell Rows', 'Cable Rows'],                      pillars: ['Strength'] },
    { name: 'TRX Rows',              equipment: 'trx',        alternatives: ['Cable Rows', 'Dumbbell Rows'],                      pillars: ['Strength', 'Functional'] },
    { name: 'Face Pulls',            equipment: 'cable',      alternatives: ['Rear Delt Fly', 'Band Pull-aparts'],                pillars: ['Strength', 'Mobility'] },
    { name: 'Straight Arm Pulldown', equipment: 'cable',      alternatives: ['Lat Pulldown'],                                     pillars: ['Strength'] },
    { name: 'Cable Pullover',        equipment: 'cable',      alternatives: ['Dumbbell Pullover'],                                pillars: ['Strength'] },
    { name: 'Dumbbell Pullover',     equipment: 'dumbbell',   alternatives: ['Cable Pullover'],                                   pillars: ['Strength'] },
  ],
  'Shoulders': [
    { name: 'OHP Machine',              equipment: 'machine',  alternatives: ['Dumbbell Shoulder Press', 'Barbell OHP'],          pillars: ['Strength'] },
    { name: 'Dumbbell Shoulder Press',  equipment: 'dumbbell', alternatives: ['OHP Machine', 'Barbell OHP'],                      pillars: ['Strength'] },
    { name: 'Barbell OHP',              equipment: 'barbell',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'],          pillars: ['Strength'] },
    { name: 'Arnold Press',             equipment: 'dumbbell', alternatives: ['Dumbbell Shoulder Press'],                         pillars: ['Strength'] },
    { name: 'Smith Machine OHP',        equipment: 'machine',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'],          pillars: ['Strength'] },
    { name: 'Lateral Raise',            equipment: 'dumbbell', alternatives: ['Cable Lateral Raise'],                             pillars: ['Strength'] },
    { name: 'Cable Lateral Raise',      equipment: 'cable',    alternatives: ['Lateral Raise'],                                   pillars: ['Strength'] },
    { name: 'Front Raise',              equipment: 'dumbbell', alternatives: ['Cable Front Raise'],                               pillars: ['Strength'] },
    { name: 'Rear Delt Fly',            equipment: 'dumbbell', alternatives: ['Face Pulls', 'Reverse Pec Fly'],                   pillars: ['Strength', 'Mobility'] },
    { name: 'Reverse Pec Fly',          equipment: 'machine',  alternatives: ['Rear Delt Fly', 'Face Pulls'],                     pillars: ['Strength', 'Mobility'] },
  ],
  'Legs': [
    { name: 'Leg Press',              equipment: 'machine',    alternatives: ['Squats', 'Hack Squats', 'Goblet Squats'],          pillars: ['Strength'] },
    { name: 'Squats',                 equipment: 'barbell',    alternatives: ['Leg Press', 'Hack Squats', 'Goblet Squats'],       pillars: ['Strength', 'Functional'] },
    { name: 'Hack Squats',            equipment: 'machine',    alternatives: ['Leg Press', 'Squats'],                             pillars: ['Strength'] },
    { name: 'Goblet Squats',          equipment: 'dumbbell',   alternatives: ['Squats', 'Leg Press'],                             pillars: ['Strength', 'Functional'] },
    { name: 'Bulgarian Split Squats', equipment: 'dumbbell',   alternatives: ['Lunges', 'Step-ups'],                              pillars: ['Strength', 'Balance'] },
    { name: 'Lunges',                 equipment: 'dumbbell',   alternatives: ['Bulgarian Split Squats', 'Step-ups'],              pillars: ['Strength', 'Balance'] },
    { name: 'Step-ups',               equipment: 'dumbbell',   alternatives: ['Lunges', 'Bulgarian Split Squats'],               pillars: ['Strength', 'Balance'] },
    { name: 'Leg Extension',          equipment: 'machine',    alternatives: ['Squats'],                                          pillars: ['Strength'] },
    { name: 'Leg Curl',               equipment: 'machine',    alternatives: ['Romanian Deadlift'],                               pillars: ['Strength'] },
    { name: 'Romanian Deadlift',      equipment: 'barbell',    alternatives: ['Leg Curl', 'Good Mornings'],                       pillars: ['Strength', 'Functional'] },
    { name: 'Hip Thrust',             equipment: 'barbell',    alternatives: ['Glute Bridge'],                                    pillars: ['Strength', 'Functional'] },
    { name: 'Glute Bridge',           equipment: 'bodyweight', alternatives: ['Hip Thrust'],                                      pillars: ['Strength', 'Functional'] },
    { name: 'Calf Raises',            equipment: 'machine',    alternatives: ['Standing Calf Raises'],                            pillars: ['Strength', 'Balance'] },
    { name: 'Smith Machine Squats',   equipment: 'machine',    alternatives: ['Squats', 'Leg Press'],                             pillars: ['Strength'] },
  ],
  'Arms': [
    { name: 'Barbell Curl',               equipment: 'barbell',    alternatives: ['Dumbbell Curl', 'Cable Curl'],                     pillars: ['Strength'] },
    { name: 'Dumbbell Curl',              equipment: 'dumbbell',   alternatives: ['Barbell Curl', 'Cable Curl'],                      pillars: ['Strength'] },
    { name: 'Cable Curl',                 equipment: 'cable',      alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   pillars: ['Strength'] },
    { name: 'Hammer Curl',                equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   pillars: ['Strength'] },
    { name: 'Preacher Curl',              equipment: 'machine',    alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   pillars: ['Strength'] },
    { name: 'Concentration Curl',         equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   pillars: ['Strength'] },
    { name: 'Tricep Pushdown',            equipment: 'cable',      alternatives: ['Overhead Tricep Extension', 'Skull Crushers'],     pillars: ['Strength'] },
    { name: 'Skull Crushers',             equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Overhead Tricep Extension'],    pillars: ['Strength'] },
    { name: 'Overhead Tricep Extension',  equipment: 'dumbbell',   alternatives: ['Tricep Pushdown', 'Skull Crushers'],               pillars: ['Strength'] },
    { name: 'Close Grip Bench',           equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Dips'],                         pillars: ['Strength'] },
    { name: 'Tricep Dips',                equipment: 'bodyweight', alternatives: ['Tricep Pushdown'],                                 pillars: ['Strength', 'Functional'] },
  ],
  'Core': [
    { name: 'Weighted Sit-ups',    equipment: 'weight',     alternatives: ['Cable Crunch', 'Decline Sit-ups'],              pillars: ['Strength', 'Functional'] },
    { name: 'Cable Crunch',        equipment: 'cable',      alternatives: ['Weighted Sit-ups', 'Decline Sit-ups'],          pillars: ['Strength'] },
    { name: 'Decline Sit-ups',     equipment: 'machine',    alternatives: ['Weighted Sit-ups', 'Cable Crunch'],             pillars: ['Strength'] },
    { name: 'Hanging Knee Raise',  equipment: 'bar',        alternatives: ['Ab Wheel', 'Weighted Sit-ups'],                 pillars: ['Strength', 'Functional'] },
    { name: 'Ab Wheel',            equipment: 'equipment',  alternatives: ['Hanging Knee Raise', 'Plank'],                  pillars: ['Strength', 'Functional'] },
    { name: 'Plank',               equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Side Plank'],     pillars: ['Strength', 'Functional'] },
    { name: 'Side Plank (Left)',   equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'],      pillars: ['Strength', 'Balance'] },
    { name: 'Side Plank (Right)',  equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'],      pillars: ['Strength', 'Balance'] },
    { name: 'Dead Bug',            equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Bird Dog'],          pillars: ['Functional', 'Balance'] },
    { name: 'Bird Dog',            equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Plank'],          pillars: ['Functional', 'Balance'] },
    { name: 'Dead Hang',           equipment: 'bar',        type: 'duration', alternatives: ['Plank'],                      pillars: ['Strength', 'Functional'] },
    { name: 'L-Sit',               equipment: 'bodyweight', type: 'duration', alternatives: ['Plank'],                      pillars: ['Strength', 'Balance'] },
    { name: 'Wall Sit',            equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Leg Press'],         pillars: ['Strength'] },
    { name: 'Pallof Press',        equipment: 'cable',      alternatives: ['Side Plank'],                                   pillars: ['Strength', 'Functional'] },
    { name: 'Russian Twist',       equipment: 'weight',     alternatives: ['Cable Woodchop', 'Bicycle Crunch'],             pillars: ['Functional'] },
    { name: 'Cable Woodchop',      equipment: 'cable',      alternatives: ['Russian Twist'],                                pillars: ['Functional'] },
    { name: 'Bicycle Crunch',      equipment: 'bodyweight', alternatives: ['Russian Twist'],                                pillars: ['Strength', 'Functional'] },
  ],
  'Cool-down': [
    { name: 'Chest Doorway Stretch',      equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Cross-body Shoulder Stretch',equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Hip Flexor Stretch',         equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Hamstring Stretch',          equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Quad Stretch',               equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Calf Stretch',               equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Thoracic Rotation',          equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'] },
    { name: 'Pigeon Pose',                equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'] },
    { name: "Child's Pose",               equipment: 'bodyweight', pillars: ['Flexibility', 'Recovery'] },
    { name: 'Spinal Twist',               equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'] },
    { name: 'Lat Stretch',                equipment: 'bodyweight', pillars: ['Flexibility'] },
    { name: 'Tricep Overhead Stretch',    equipment: 'bodyweight', pillars: ['Flexibility'] },
  ],
};

// Get alternatives for an exercise
export function getAlternatives(exerciseName) {
  for (const group of Object.values(EXERCISES)) {
    const exercise = group.find(e => e.name === exerciseName);
    if (exercise && exercise.alternatives) {
      return exercise.alternatives;
    }
  }
  return [];
}

// Get muscle group for an exercise
export function getMuscleGroup(exerciseName) {
  for (const [group, exercises] of Object.entries(EXERCISES)) {
    if (exercises.find(e => e.name === exerciseName)) {
      return group;
    }
  }
  return 'Other';
}

// Get all exercises as flat array
export function getAllExercises() {
  return Object.entries(EXERCISES).flatMap(([group, exercises]) =>
    exercises.map(e => ({ ...e, group }))
  );
}
