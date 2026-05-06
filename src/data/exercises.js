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
    { name: 'Arm Circles',        type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Hip Swings',         type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Leg Swings',         type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Shoulder Rotations', type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Thoracic Rotations', type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Ankle Rolls',        type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Dynamic Lunges',     type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Jumping Jacks',      type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
  ],
  'Cardio': [
    { name: 'Running',           type: 'cardio', equipment: 'outdoor',   cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Running (outdoor)', type: 'cardio', equipment: 'outdoor',   cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Treadmill',         type: 'cardio', equipment: 'machine',   cardioType: 'running',    trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Walking',           type: 'cardio', equipment: 'outdoor',   cardioType: 'walking',    trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Hiking',            type: 'cardio', equipment: 'outdoor',   cardioType: 'hiking',     trackDistance: true,  distanceUnit: 'km', trackElevation: true, movement: 'Cardio' },
    { name: 'Cycling (outdoor)', type: 'cardio', equipment: 'outdoor',   cardioType: 'cycling',    trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Stationary Bike',   type: 'cardio', equipment: 'machine',   cardioType: 'cycling',    movement: 'Cardio' },
    { name: 'Elliptical',        type: 'cardio', equipment: 'machine',   cardioType: 'elliptical', trackDistance: true,  distanceUnit: 'km', movement: 'Cardio' },
    { name: 'Stairmaster',       type: 'cardio', equipment: 'machine',   cardioType: 'stairs',     trackFloors: true,    movement: 'Cardio' },
    { name: 'Stairs',            type: 'cardio', equipment: 'outdoor',   cardioType: 'stairs',     trackFloors: true,    movement: 'Cardio' },
    { name: 'Rowing Machine',    type: 'cardio', equipment: 'machine',   cardioType: 'rowing',     trackDistance: true,  distanceUnit: 'm',  movement: 'Cardio' },
    { name: 'SkiErg',            type: 'cardio', equipment: 'machine',   cardioType: 'skiing',     trackDistance: true,  distanceUnit: 'm',  movement: 'Cardio' },
    { name: 'Swimming',          type: 'cardio', equipment: 'outdoor',   cardioType: 'swimming',   trackDistance: true,  distanceUnit: 'm',  movement: 'Cardio' },
    { name: 'Jump Rope',         type: 'cardio', equipment: 'equipment', cardioType: 'jump_rope',  movement: 'Cardio' },
  ],
  'Chest': [
    { name: 'Bench Press',            type: 'strength',   equipment: 'barbell',    alternatives: ['Dumbbell Press', 'Push-ups', 'Smith Machine Press'], movement: 'UB Push' },
    { name: 'Dumbbell Press',         type: 'strength',   equipment: 'dumbbell',   alternatives: ['Bench Press', 'Push-ups'],                          movement: 'UB Push' },
    { name: 'Incline Bench Press',    type: 'strength',   equipment: 'barbell',    alternatives: ['Incline Dumbbell Press', 'Push-ups'],               movement: 'UB Push' },
    { name: 'Incline Dumbbell Press', type: 'strength',   equipment: 'dumbbell',   alternatives: ['Incline Bench Press'],                              movement: 'UB Push' },
    { name: 'Decline Bench Press',    type: 'strength',   equipment: 'barbell',    alternatives: ['Dumbbell Press'],                                   movement: 'UB Push' },
    { name: 'Pec Fly Machine',        type: 'strength',   equipment: 'machine',    alternatives: ['Dumbbell Fly', 'Cable Fly', 'Cable Crossover'],     movement: 'UB Push' },
    { name: 'Dumbbell Fly',           type: 'strength',   equipment: 'dumbbell',   alternatives: ['Pec Fly Machine', 'Cable Fly'],                     movement: 'UB Push' },
    { name: 'Cable Fly',              type: 'strength',   equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  movement: 'UB Push' },
    { name: 'Cable Crossover',        type: 'strength',   equipment: 'cable',      alternatives: ['Pec Fly Machine', 'Dumbbell Fly'],                  movement: 'UB Push' },
    { name: 'Push-ups',               type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Bench Press', 'Dumbbell Press'],                    movement: 'UB Push' },
    { name: 'Dips',                   type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Push-ups', 'Bench Press'],                          movement: 'UB Push' },
    { name: 'Smith Machine Press',    type: 'strength',   equipment: 'machine',    alternatives: ['Bench Press', 'Dumbbell Press'],                    movement: 'UB Push' },
  ],
  'Back': [
    { name: 'Lat Pulldown',          type: 'strength',   equipment: 'cable',      alternatives: ['Pull-ups', 'Assisted Pull-ups'],                    movement: 'UB Pull' },
    { name: 'Pull-ups',              type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Lat Pulldown', 'Assisted Pull-ups'],                 movement: 'UB Pull' },
    { name: 'Assisted Pull-ups',     type: 'strength',   equipment: 'machine',    alternatives: ['Pull-ups', 'Lat Pulldown'],                         movement: 'UB Pull' },
    { name: 'Cable Rows',            type: 'strength',   equipment: 'cable',      alternatives: ['Dumbbell Rows', 'Machine Rows', 'TRX Rows'],        movement: 'UB Pull' },
    { name: 'Seated Row Machine',    type: 'strength',   equipment: 'machine',    alternatives: ['Cable Rows', 'Dumbbell Rows'],                      movement: 'UB Pull' },
    { name: 'Dumbbell Rows',         type: 'strength',   equipment: 'dumbbell',   alternatives: ['Cable Rows', 'Seated Row Machine'],                 movement: 'UB Pull' },
    { name: 'Barbell Rows',          type: 'strength',   equipment: 'barbell',    alternatives: ['Dumbbell Rows', 'Cable Rows'],                      movement: 'UB Pull' },
    { name: 'TRX Rows',              type: 'bodyweight', equipment: 'trx',        alternatives: ['Cable Rows', 'Dumbbell Rows'],                      movement: 'UB Pull' },
    { name: 'Face Pulls',            type: 'strength',   equipment: 'cable',      alternatives: ['Rear Delt Fly', 'Band Pull-aparts'],                movement: 'UB Pull' },
    { name: 'Straight Arm Pulldown', type: 'strength',   equipment: 'cable',      alternatives: ['Lat Pulldown'],                                     movement: 'UB Pull' },
    { name: 'Cable Pullover',        type: 'strength',   equipment: 'cable',      alternatives: ['Dumbbell Pullover'],                                movement: 'UB Pull' },
    { name: 'Dumbbell Pullover',     type: 'strength',   equipment: 'dumbbell',   alternatives: ['Cable Pullover'],                                   movement: 'UB Pull' },
  ],
  'Shoulders': [
    { name: 'OHP Machine',             type: 'strength', equipment: 'machine',  alternatives: ['Dumbbell Shoulder Press', 'Barbell OHP'], movement: 'UB Push' },
    { name: 'Dumbbell Shoulder Press', type: 'strength', equipment: 'dumbbell', alternatives: ['OHP Machine', 'Barbell OHP'],             movement: 'UB Push' },
    { name: 'Barbell OHP',             type: 'strength', equipment: 'barbell',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'], movement: 'UB Push' },
    { name: 'Arnold Press',            type: 'strength', equipment: 'dumbbell', alternatives: ['Dumbbell Shoulder Press'],                movement: 'UB Push' },
    { name: 'Smith Machine OHP',       type: 'strength', equipment: 'machine',  alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'], movement: 'UB Push' },
    { name: 'Lateral Raise',           type: 'strength', equipment: 'dumbbell', alternatives: ['Cable Lateral Raise'],                    movement: 'UB Push' },
    { name: 'Cable Lateral Raise',     type: 'strength', equipment: 'cable',    alternatives: ['Lateral Raise'],                          movement: 'UB Push' },
    { name: 'Front Raise',             type: 'strength', equipment: 'dumbbell', alternatives: ['Cable Front Raise'],                      movement: 'UB Push' },
    { name: 'Rear Delt Fly',           type: 'strength', equipment: 'dumbbell', alternatives: ['Face Pulls', 'Reverse Pec Fly'],          movement: 'UB Pull' },
    { name: 'Reverse Pec Fly',         type: 'strength', equipment: 'machine',  alternatives: ['Rear Delt Fly', 'Face Pulls'],            movement: 'UB Pull' },
  ],
  'Legs': [
    { name: 'Leg Press',              type: 'strength',   equipment: 'machine',    alternatives: ['Squats', 'Hack Squats', 'Goblet Squats'],          movement: 'LB Push' },
    { name: 'Squats',                 type: 'strength',   equipment: 'barbell',    alternatives: ['Leg Press', 'Hack Squats', 'Goblet Squats'],       movement: 'LB Push' },
    { name: 'Hack Squats',            type: 'strength',   equipment: 'machine',    alternatives: ['Leg Press', 'Squats'],                             movement: 'LB Push' },
    { name: 'Goblet Squats',          type: 'strength',   equipment: 'dumbbell',   alternatives: ['Squats', 'Leg Press'],                             movement: 'LB Push' },
    { name: 'Bulgarian Split Squats', type: 'strength',   equipment: 'dumbbell',   alternatives: ['Lunges', 'Step-ups'],                              movement: 'Balance' },
    { name: 'Lunges',                 type: 'strength',   equipment: 'dumbbell',   alternatives: ['Bulgarian Split Squats', 'Step-ups'],              movement: 'LB Push' },
    { name: 'Step-ups',               type: 'strength',   equipment: 'dumbbell',   alternatives: ['Lunges', 'Bulgarian Split Squats'],                movement: 'Balance' },
    { name: 'Leg Extension',          type: 'strength',   equipment: 'machine',    alternatives: ['Squats'],                                          movement: 'LB Push' },
    { name: 'Leg Curl',               type: 'strength',   equipment: 'machine',    alternatives: ['Romanian Deadlift'],                               movement: 'LB Pull' },
    { name: 'Romanian Deadlift',      type: 'strength',   equipment: 'barbell',    alternatives: ['Leg Curl', 'Good Mornings'],                       movement: 'LB Pull' },
    { name: 'Hip Thrust',             type: 'strength',   equipment: 'barbell',    alternatives: ['Glute Bridge'],                                    movement: 'LB Pull' },
    { name: 'Glute Bridge',           type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Hip Thrust'],                                      movement: 'LB Pull' },
    { name: 'Calf Raises',            type: 'strength',   equipment: 'machine',    alternatives: ['Standing Calf Raises'],                            movement: 'LB Push' },
    { name: 'Smith Machine Squats',   type: 'strength',   equipment: 'machine',    alternatives: ['Squats', 'Leg Press'],                             movement: 'LB Push' },
  ],
  'Arms': [
    { name: 'Barbell Curl',              type: 'strength',   equipment: 'barbell',    alternatives: ['Dumbbell Curl', 'Cable Curl'],                     movement: 'UB Pull' },
    { name: 'Dumbbell Curl',             type: 'strength',   equipment: 'dumbbell',   alternatives: ['Barbell Curl', 'Cable Curl'],                      movement: 'UB Pull' },
    { name: 'Cable Curl',                type: 'strength',   equipment: 'cable',      alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   movement: 'UB Pull' },
    { name: 'Hammer Curl',               type: 'strength',   equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   movement: 'UB Pull' },
    { name: 'Preacher Curl',             type: 'strength',   equipment: 'machine',    alternatives: ['Barbell Curl', 'Dumbbell Curl'],                   movement: 'UB Pull' },
    { name: 'Concentration Curl',        type: 'strength',   equipment: 'dumbbell',   alternatives: ['Dumbbell Curl'],                                   movement: 'UB Pull' },
    { name: 'Tricep Pushdown',           type: 'strength',   equipment: 'cable',      alternatives: ['Overhead Tricep Extension', 'Skull Crushers'],     movement: 'UB Push' },
    { name: 'Skull Crushers',            type: 'strength',   equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Overhead Tricep Extension'],    movement: 'UB Push' },
    { name: 'Overhead Tricep Extension', type: 'strength',   equipment: 'dumbbell',   alternatives: ['Tricep Pushdown', 'Skull Crushers'],               movement: 'UB Push' },
    { name: 'Close Grip Bench',          type: 'strength',   equipment: 'barbell',    alternatives: ['Tricep Pushdown', 'Dips'],                         movement: 'UB Push' },
    { name: 'Tricep Dips',               type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Tricep Pushdown'],                                 movement: 'UB Push' },
  ],
  'Core': [
    { name: 'Weighted Sit-ups',   type: 'strength',   equipment: 'weight',     alternatives: ['Cable Crunch', 'Decline Sit-ups'],              movement: 'Core' },
    { name: 'Cable Crunch',       type: 'strength',   equipment: 'cable',      alternatives: ['Weighted Sit-ups', 'Decline Sit-ups'],          movement: 'Core' },
    { name: 'Decline Sit-ups',    type: 'strength',   equipment: 'machine',    alternatives: ['Weighted Sit-ups', 'Cable Crunch'],             movement: 'Core' },
    { name: 'Hanging Knee Raise', type: 'bodyweight', equipment: 'bar',        alternatives: ['Ab Wheel', 'Weighted Sit-ups'],                 movement: 'Core' },
    { name: 'Ab Wheel',           type: 'bodyweight', equipment: 'equipment',  alternatives: ['Hanging Knee Raise', 'Plank'],                  movement: 'Core' },
    { name: 'Plank',              type: 'duration',   equipment: 'bodyweight', alternatives: ['Dead Bug', 'Side Plank'],                       movement: 'Core' },
    { name: 'Side Plank (Left)',  type: 'duration',   equipment: 'bodyweight', alternatives: ['Plank', 'Pallof Press'],                        movement: 'Core' },
    { name: 'Side Plank (Right)', type: 'duration',   equipment: 'bodyweight', alternatives: ['Plank', 'Pallof Press'],                        movement: 'Core' },
    { name: 'Dead Bug',           type: 'duration',   equipment: 'bodyweight', alternatives: ['Plank', 'Bird Dog'],                           movement: 'Core' },
    { name: 'Bird Dog',           type: 'duration',   equipment: 'bodyweight', alternatives: ['Dead Bug', 'Plank'],                           movement: 'Core' },
    { name: 'Dead Hang',          type: 'duration',   equipment: 'bar',        alternatives: ['Plank'],                                       movement: 'UB Pull' },
    { name: 'L-Sit',              type: 'duration',   equipment: 'bodyweight', alternatives: ['Plank'],                                       movement: 'Core' },
    { name: 'Wall Sit',           type: 'duration',   equipment: 'bodyweight', alternatives: ['Plank', 'Leg Press'],                          movement: 'LB Push' },
    { name: 'Pallof Press',       type: 'strength',   equipment: 'cable',      alternatives: ['Side Plank'],                                  movement: 'Core' },
    { name: 'Russian Twist',      type: 'strength',   equipment: 'weight',     alternatives: ['Cable Woodchop', 'Bicycle Crunch'],            movement: 'Core' },
    { name: 'Cable Woodchop',     type: 'strength',   equipment: 'cable',      alternatives: ['Russian Twist'],                               movement: 'Core' },
    { name: 'Bicycle Crunch',     type: 'bodyweight', equipment: 'bodyweight', alternatives: ['Russian Twist'],                               movement: 'Core' },
  ],
  'Cool-down': [
    { name: 'Chest Doorway Stretch',       type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Cross-body Shoulder Stretch', type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Hip Flexor Stretch',          type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Hamstring Stretch',           type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Quad Stretch',                type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Calf Stretch',                type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Thoracic Rotation',           type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Pigeon Pose',                 type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: "Child's Pose",                type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Spinal Twist',                type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Lat Stretch',                 type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
    { name: 'Tricep Overhead Stretch',     type: 'duration', equipment: 'bodyweight', movement: 'Stretch' },
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
