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
    { name: 'Arm Circles',         equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Hip Swings',          equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Leg Swings',          equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Shoulder Rotations',  equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Thoracic Rotations',  equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Ankle Rolls',         equipment: 'bodyweight', pillars: ['Mobility'],                       movement: 'Stretch' },
    { name: 'Dynamic Lunges',      equipment: 'bodyweight', pillars: ['Mobility', 'Functional'],         movement: 'Stretch' },
    { name: 'Jumping Jacks',       equipment: 'bodyweight', pillars: ['Cardiovascular', 'Mobility'],     movement: 'Stretch' },
  ],
  'Cardio': [
    { name: 'Running',           equipment: 'outdoor',   type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Running (outdoor)', equipment: 'outdoor',   type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Treadmill',         equipment: 'machine',   type: 'duration', cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Walking',           equipment: 'outdoor',   type: 'duration', cardioType: 'walking',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Hiking',            equipment: 'outdoor',   type: 'duration', cardioType: 'hiking',     trackDistance: true,  distanceUnit: 'km', trackElevation: true, pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'Cycling (outdoor)', equipment: 'outdoor',   type: 'duration', cardioType: 'cycling',    trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Stationary Bike',   equipment: 'machine',   type: 'duration', cardioType: 'cycling',    pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Elliptical',        equipment: 'machine',   type: 'duration', cardioType: 'elliptical', trackDistance: true,  distanceUnit: 'km', pillars: ['Cardiovascular'], movement: 'Cardio' },
    { name: 'Stairmaster',       equipment: 'machine',   type: 'duration', cardioType: 'stairs',     trackFloors: true,    pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'Stairs',            equipment: 'outdoor',   type: 'duration', cardioType: 'stairs',     trackFloors: true,    pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'Rowing Machine',    equipment: 'machine',   type: 'duration', cardioType: 'rowing',     trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'SkiErg',            equipment: 'machine',   type: 'duration', cardioType: 'skiing',     trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'Swimming',          equipment: 'outdoor',   type: 'duration', cardioType: 'swimming',   trackDistance: true,  distanceUnit: 'm',  pillars: ['Cardiovascular', 'Functional'], movement: 'Cardio' },
    { name: 'Jump Rope',         equipment: 'equipment', type: 'duration', cardioType: 'jump_rope',  pillars: ['Cardiovascular', 'Balance'], movement: 'Cardio' },
  ],
  'Chest': [
    { name: 'Bench Press',            equipment: 'barbell',    alternatives: ['Dumbbell Press', 'Push-ups', 'Smith Machine Press'], pillars: ['Strength'], movement: 'Push' },
    { name: 'Dumbbell Press',         equipment: 'dumbbell',   alternatives: ['Bench Press', 'Push-ups'],                          pillars: ['Strength'], movement: 'Push' },
    { name: 'Incline Bench Press',    equipment: 'barbell',    alternatives: ['Incline Dumbbell Press', 'Push-ups'],               pillars: ['Strength'], movement: 'Push' },
    { name: 'Incline Dumbbell Press', equipment: 'dumbbell',   alternatives: ['Incline Bench Press'],                              pillars: ['Strength'], movement: 'Push' },
    { name: 'Decline Bench Press',    equipment: 'barbell',    alternatives: ['Dumbbell Press'],                                   pillars: ['Strength'], movement: 'Push' },
    { name: 'Pec Fly Machine',        equipment: 'machine',    alternatives: ['Dumbbell Fly', 'Cable Fly', 'Cable Crossover'],     pillars: ['Strength'], movement: 'Push' },
    { name: 'Dumbbell Fly',           equipment: 'dumbbell',   alternatives: ['Pec Fly Machine', 'Cable Fly'],                     pillars: ['Strength'], movement: 'Push' },
    { name: 'Cable Fly',              equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  pillars: ['Strength'], movement: 'Push' },
    { name: 'Cable Crossover',        equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  pillars: ['Strength'], movement: 'Push' },
    { name: 'Push-ups',               equipment: 'bodyweight', alternatives: ['Bench Press', 'Dumbbell Press'],                    pillars: ['Strength', 'Functional'], movement: 'Push' },
    { name: 'Dips',                   equipment: 'bodyweight', alternatives: ['Push-ups', 'Bench Press'],                          pillars: ['Strength', 'Functional'], movement: 'Push' },
    { name: 'Smith Machine Press',    equipment: 'machine',    alternatives: ['Bench Press', 'Dumbbell Press'],                    pillars: ['Strength'], movement: 'Push' },
  ],
  'Back': [
    { name: 'Lat Pulldown',          equipment: 'cable',      alternatives: ['Pull-ups', 'Assisted Pull-ups'],                    pillars: ['Strength'], movement: 'Pull' },
    { name: 'Pull-ups',              equipment: 'bodyweight', alternatives: ['Lat Pulldown', 'Assisted Pull-ups'],                 pillars: ['Strength', 'Functional'], movement: 'Pull' },
    { name: 'Assisted Pull-ups',     equipment: 'machine',    alternatives: ['Pull-ups', 'Lat Pulldown'],                         pillars: ['Strength'], movement: 'Pull' },
    { name: 'Cable Rows',            equipment: 'cable',      alternatives: ['Dumbbell Rows', 'Machine Rows', 'TRX Rows'],        pillars: ['Strength'], movement: 'Pull' },
    { name: 'Seated Row Machine',    equipment: 'machine',    alternatives: ['Cable Rows', 'Dumbbell Rows'],                      pillars: ['Strength'], movement: 'Pull' },
    { name: 'Dumbbell Rows',         equipment: 'dumbbell',   alternatives: ['Cable Rows', 'Seated Row Machine'],                 pillars: ['Strength'], movement: 'Pull' },
    { name: 'Barbell Rows',          equipment: 'barbell',    alternatives: ['Dumbbell Rows', 'Cable Rows'],                      pillars: ['Strength'], movement: 'Pull' },
    { name: 'TRX Rows',              equipment: 'trx',        alternatives: ['Cable Rows', 'Dumbbell Rows'],                      pillars: ['Strength', 'Functional'], movement: 'Pull' },
    { name: 'Face Pulls',            equipment: 'cable',      alternatives: ['Rear Delt Fly', 'Band Pull-aparts'],                pillars: ['Strength', 'Mobility'], movement: 'Pull' },
    { name: 'Straight Arm Pulldown', equipment: 'cable',      alternatives: ['Lat Pulldown'],                                     pillars: ['Strength'], movement: 'Pull' },
    { name: 'Cable Pullover',        equipment: 'cable',      alternatives: ['Dumbbell Pullover'],                                pillars: ['Strength'], movement: 'Pull' },
    { name: 'Dumbbell Pullover',     equipment: 'dumbbell',   alternatives: ['Cable Pullover'],                                   pillars: ['Strength'], movement: 'Pull' },
  ],
  'Shoulders': [
    { name: 'OHP Machine',             equipment: 'machine',  alternatives: ['Dumbbell Shoulder Press', 'Barbell OHP'], pillars: ['Strength'], movement: 'Push' },
    { name: 'Dumbbell Shoulder Press', equipment: 'dumbbell', alternatives: ['OHP Machine', 'Barbell OHP'],             pillars: ['Strength'], movement: 'Push' },
    { name: 'Barbell OHP',             equipment: 'barbell',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'], pillars: ['Strength'], movement: 'Push' },
    { name: 'Arnold Press',            equipment: 'dumbbell', alternatives: ['Dumbbell Shoulder Press'],                pillars: ['Strength'], movement: 'Push' },
    { name: 'Smith Machine OHP',       equipment: 'machine',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'], pillars: ['Strength'], movement: 'Push' },
    { name: 'Lateral Raise',           equipment: 'dumbbell', alternatives: ['Cable Lateral Raise'],                    pillars: ['Strength'], movement: 'Push' },
    { name: 'Cable Lateral Raise',     equipment: 'cable',    alternatives: ['Lateral Raise'],                          pillars: ['Strength'], movement: 'Push' },
    { name: 'Front Raise',             equipment: 'dumbbell', alternatives: ['Cable Front Raise'],                      pillars: ['Strength'], movement: 'Push' },
    { name: 'Rear Delt Fly',           equipment: 'dumbbell', alternatives: ['Face Pulls', 'Reverse Pec Fly'],          pillars: ['Strength', 'Mobility'], movement: 'Pull' },
    { name: 'Reverse Pec Fly',         equipment: 'machine',  alternatives: ['Rear Delt Fly', 'Face Pulls'],            pillars: ['Strength', 'Mobility'], movement: 'Pull' },
  ],
  'Legs': [
    { name: 'Leg Press',              equipment: 'machine',  alternatives: ['Squats', 'Hack Squats', 'Goblet Squats'],          pillars: ['Strength'], movement: 'Push' },
    { name: 'Squats',                 equipment: 'barbell',  alternatives: ['Leg Press', 'Hack Squats', 'Goblet Squats'],       pillars: ['Strength', 'Functional'], movement: 'Push' },
    { name: 'Hack Squats',            equipment: 'machine',  alternatives: ['Leg Press', 'Squats'],                             pillars: ['Strength'], movement: 'Push' },
    { name: 'Goblet Squats',          equipment: 'dumbbell', alternatives: ['Squats', 'Leg Press'],                             pillars: ['Strength', 'Functional'], movement: 'Push' },
    { name: 'Bulgarian Split Squats', equipment: 'dumbbell', alternatives: ['Lunges', 'Step-ups'],                              pillars: ['Strength', 'Balance'], movement: 'Balance' },
    { name: 'Lunges',                 equipment: 'dumbbell', alternatives: ['Bulgarian Split Squats', 'Step-ups'],              pillars: ['Strength', 'Balance'], movement: 'Push' },
    { name: 'Step-ups',               equipment: 'dumbbell', alternatives: ['Lunges', 'Bulgarian Split Squats'],               pillars: ['Strength', 'Balance'], movement: 'Balance' },
    { name: 'Leg Extension',          equipment: 'machine',  alternatives: ['Squats'],                                          pillars: ['Strength'], movement: 'Push' },
    { name: 'Leg Curl',               equipment: 'machine',  alternatives: ['Romanian Deadlift'],                               pillars: ['Strength'], movement: 'Pull' },
    { name: 'Romanian Deadlift',      equipment: 'barbell',  alternatives: ['Leg Curl', 'Good Mornings'],                       pillars: ['Strength', 'Functional'], movement: 'Pull' },
    { name: 'Hip Thrust',             equipment: 'barbell',  alternatives: ['Glute Bridge'],                                    pillars: ['Strength', 'Functional'], movement: 'Pull' },
    { name: 'Glute Bridge',           equipment: 'bodyweight', alternatives: ['Hip Thrust'],                                    pillars: ['Strength', 'Functional'], movement: 'Pull' },
    { name: 'Calf Raises',            equipment: 'machine',  alternatives: ['Standing Calf Raises'],                            pillars: ['Strength', 'Balance'], movement: 'Push' },
    { name: 'Smith Machine Squats',   equipment: 'machine',  alternatives: ['Squats', 'Leg Press'],                             pillars: ['Strength'], movement: 'Push' },
  ],
  'Arms': [
    { name: 'Barbell Curl',              equipment: 'barbell',    alternatives: ['Dumbbell Curl', 'Cable Curl'],                     pillars: ['Strength'], movement: 'Pull' },
    { name: 'Dumbbell Curl',             equipment: 'dumbbell',   alternatives: ['Barbell Curl', 'Cable Curl'],                      pillars: ['Strength'], movement: 'Pull' },
    { name: 'Cable Curl',                equipment: 'cable',      alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   pillars: ['Strength'], movement: 'Pull' },
    { name: 'Hammer Curl',               equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   pillars: ['Strength'], movement: 'Pull' },
    { name: 'Preacher Curl',             equipment: 'machine',    alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   pillars: ['Strength'], movement: 'Pull' },
    { name: 'Concentration Curl',        equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   pillars: ['Strength'], movement: 'Pull' },
    { name: 'Tricep Pushdown',           equipment: 'cable',      alternatives: ['Overhead Tricep Extension', 'Skull Crushers'],     pillars: ['Strength'], movement: 'Push' },
    { name: 'Skull Crushers',            equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Overhead Tricep Extension'],    pillars: ['Strength'], movement: 'Push' },
    { name: 'Overhead Tricep Extension', equipment: 'dumbbell',   alternatives: ['Tricep Pushdown', 'Skull Crushers'],               pillars: ['Strength'], movement: 'Push' },
    { name: 'Close Grip Bench',          equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Dips'],                         pillars: ['Strength'], movement: 'Push' },
    { name: 'Tricep Dips',               equipment: 'bodyweight', alternatives: ['Tricep Pushdown'],                                 pillars: ['Strength', 'Functional'], movement: 'Push' },
  ],
  'Core': [
    { name: 'Weighted Sit-ups',   equipment: 'weight',     alternatives: ['Cable Crunch', 'Decline Sit-ups'],              pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'Cable Crunch',       equipment: 'cable',      alternatives: ['Weighted Sit-ups', 'Decline Sit-ups'],          pillars: ['Strength'], movement: 'Core' },
    { name: 'Decline Sit-ups',    equipment: 'machine',    alternatives: ['Weighted Sit-ups', 'Cable Crunch'],             pillars: ['Strength'], movement: 'Core' },
    { name: 'Hanging Knee Raise', equipment: 'bar',        alternatives: ['Ab Wheel', 'Weighted Sit-ups'],                 pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'Ab Wheel',           equipment: 'equipment',  alternatives: ['Hanging Knee Raise', 'Plank'],                  pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'Plank',              equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Side Plank'],     pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'Side Plank (Left)',  equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'],      pillars: ['Strength', 'Balance'], movement: 'Core' },
    { name: 'Side Plank (Right)', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'],      pillars: ['Strength', 'Balance'], movement: 'Core' },
    { name: 'Dead Bug',           equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Bird Dog'],          pillars: ['Functional', 'Balance'], movement: 'Core' },
    { name: 'Bird Dog',           equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Plank'],          pillars: ['Functional', 'Balance'], movement: 'Core' },
    { name: 'Dead Hang',          equipment: 'bar',        type: 'duration', alternatives: ['Plank'],                      pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'L-Sit',              equipment: 'bodyweight', type: 'duration', alternatives: ['Plank'],                      pillars: ['Strength', 'Balance'], movement: 'Core' },
    { name: 'Wall Sit',           equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Leg Press'],         pillars: ['Strength'], movement: 'Core' },
    { name: 'Pallof Press',       equipment: 'cable',      alternatives: ['Side Plank'],                                   pillars: ['Strength', 'Functional'], movement: 'Core' },
    { name: 'Russian Twist',      equipment: 'weight',     alternatives: ['Cable Woodchop', 'Bicycle Crunch'],             pillars: ['Functional'], movement: 'Core' },
    { name: 'Cable Woodchop',     equipment: 'cable',      alternatives: ['Russian Twist'],                                pillars: ['Functional'], movement: 'Core' },
    { name: 'Bicycle Crunch',     equipment: 'bodyweight', alternatives: ['Russian Twist'],                                pillars: ['Strength', 'Functional'], movement: 'Core' },
  ],
  'Cool-down': [
    { name: 'Chest Doorway Stretch',       equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Cross-body Shoulder Stretch', equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Hip Flexor Stretch',          equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Hamstring Stretch',           equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Quad Stretch',                equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Calf Stretch',                equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Thoracic Rotation',           equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'], movement: 'Stretch' },
    { name: 'Pigeon Pose',                 equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'], movement: 'Stretch' },
    { name: "Child's Pose",                equipment: 'bodyweight', pillars: ['Flexibility', 'Recovery'], movement: 'Stretch' },
    { name: 'Spinal Twist',                equipment: 'bodyweight', pillars: ['Flexibility', 'Mobility'], movement: 'Stretch' },
    { name: 'Lat Stretch',                 equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
    { name: 'Tricep Overhead Stretch',     equipment: 'bodyweight', pillars: ['Flexibility'], movement: 'Stretch' },
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
