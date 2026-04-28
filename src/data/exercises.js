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
    { name: 'Arm Circles', equipment: 'bodyweight' },
    { name: 'Hip Swings', equipment: 'bodyweight' },
    { name: 'Leg Swings', equipment: 'bodyweight' },
    { name: 'Shoulder Rotations', equipment: 'bodyweight' },
    { name: 'Thoracic Rotations', equipment: 'bodyweight' },
    { name: 'Ankle Rolls', equipment: 'bodyweight' },
    { name: 'Dynamic Lunges', equipment: 'bodyweight' },
    { name: 'Jumping Jacks', equipment: 'bodyweight' },
  ],
  'Cardio': [
    { name: 'Treadmill', equipment: 'machine', type: 'duration' },
    { name: 'Stationary Bike', equipment: 'machine', type: 'duration' },
    { name: 'Elliptical', equipment: 'machine', type: 'duration' },
    { name: 'Stairmaster', equipment: 'machine', type: 'duration' },
    { name: 'Rowing Machine', equipment: 'machine', type: 'duration' },
    { name: 'Running', equipment: 'outdoor', type: 'duration' },
    { name: 'Running (outdoor)', equipment: 'outdoor', type: 'duration' },
    { name: 'Hiking', equipment: 'outdoor', type: 'duration' },
    { name: 'Walking', equipment: 'outdoor', type: 'duration' },
    { name: 'Stairs', equipment: 'outdoor', type: 'duration' },
    { name: 'Cycling (outdoor)', equipment: 'outdoor', type: 'duration' },
    { name: 'Swimming', equipment: 'outdoor', type: 'duration' },
    { name: 'Jump Rope', equipment: 'equipment', type: 'duration' },
  ],
  'Chest': [
    { name: 'Bench Press', equipment: 'barbell', alternatives: ['Dumbbell Press', 'Push-ups', 'Smith Machine Press'] },
    { name: 'Dumbbell Press', equipment: 'dumbbell', alternatives: ['Bench Press', 'Push-ups'] },
    { name: 'Incline Bench Press', equipment: 'barbell', alternatives: ['Incline Dumbbell Press', 'Push-ups'] },
    { name: 'Incline Dumbbell Press', equipment: 'dumbbell', alternatives: ['Incline Bench Press'] },
    { name: 'Decline Bench Press', equipment: 'barbell', alternatives: ['Dumbbell Press'] },
    { name: 'Pec Fly Machine', equipment: 'machine', alternatives: ['Dumbbell Fly', 'Cable Fly', 'Cable Crossover'] },
    { name: 'Dumbbell Fly', equipment: 'dumbbell', alternatives: ['Pec Fly Machine', 'Cable Fly'] },
    { name: 'Cable Fly', equipment: 'cable', alternatives: ['Pec Fly Machine', 'Dumbbell Fly'] },
    { name: 'Cable Crossover', equipment: 'cable', alternatives: ['Pec Fly Machine', 'Dumbbell Fly'] },
    { name: 'Push-ups', equipment: 'bodyweight', alternatives: ['Bench Press', 'Dumbbell Press'] },
    { name: 'Dips', equipment: 'bodyweight', alternatives: ['Push-ups', 'Bench Press'] },
    { name: 'Smith Machine Press', equipment: 'machine', alternatives: ['Bench Press', 'Dumbbell Press'] },
  ],
  'Back': [
    { name: 'Lat Pulldown', equipment: 'cable', alternatives: ['Pull-ups', 'Assisted Pull-ups'] },
    { name: 'Pull-ups', equipment: 'bodyweight', alternatives: ['Lat Pulldown', 'Assisted Pull-ups'] },
    { name: 'Assisted Pull-ups', equipment: 'machine', alternatives: ['Pull-ups', 'Lat Pulldown'] },
    { name: 'Cable Rows', equipment: 'cable', alternatives: ['Dumbbell Rows', 'Machine Rows', 'TRX Rows'] },
    { name: 'Seated Row Machine', equipment: 'machine', alternatives: ['Cable Rows', 'Dumbbell Rows'] },
    { name: 'Dumbbell Rows', equipment: 'dumbbell', alternatives: ['Cable Rows', 'Seated Row Machine'] },
    { name: 'Barbell Rows', equipment: 'barbell', alternatives: ['Dumbbell Rows', 'Cable Rows'] },
    { name: 'TRX Rows', equipment: 'trx', alternatives: ['Cable Rows', 'Dumbbell Rows'] },
    { name: 'Face Pulls', equipment: 'cable', alternatives: ['Rear Delt Fly', 'Band Pull-aparts'] },
    { name: 'Straight Arm Pulldown', equipment: 'cable', alternatives: ['Lat Pulldown'] },
    { name: 'Cable Pullover', equipment: 'cable', alternatives: ['Dumbbell Pullover'] },
    { name: 'Dumbbell Pullover', equipment: 'dumbbell', alternatives: ['Cable Pullover'] },
  ],
  'Shoulders': [
    { name: 'OHP Machine', equipment: 'machine', alternatives: ['Dumbbell Shoulder Press', 'Barbell OHP'] },
    { name: 'Dumbbell Shoulder Press', equipment: 'dumbbell', alternatives: ['OHP Machine', 'Barbell OHP'] },
    { name: 'Barbell OHP', equipment: 'barbell', alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'] },
    { name: 'Arnold Press', equipment: 'dumbbell', alternatives: ['Dumbbell Shoulder Press'] },
    { name: 'Smith Machine OHP', equipment: 'machine', alternatives: ['OHP Machine', 'Dumbbell Shoulder Press'] },
    { name: 'Lateral Raise', equipment: 'dumbbell', alternatives: ['Cable Lateral Raise'] },
    { name: 'Cable Lateral Raise', equipment: 'cable', alternatives: ['Lateral Raise'] },
    { name: 'Front Raise', equipment: 'dumbbell', alternatives: ['Cable Front Raise'] },
    { name: 'Rear Delt Fly', equipment: 'dumbbell', alternatives: ['Face Pulls', 'Reverse Pec Fly'] },
    { name: 'Reverse Pec Fly', equipment: 'machine', alternatives: ['Rear Delt Fly', 'Face Pulls'] },
  ],
  'Legs': [
    { name: 'Leg Press', equipment: 'machine', alternatives: ['Squats', 'Hack Squats', 'Goblet Squats'] },
    { name: 'Squats', equipment: 'barbell', alternatives: ['Leg Press', 'Hack Squats', 'Goblet Squats'] },
    { name: 'Hack Squats', equipment: 'machine', alternatives: ['Leg Press', 'Squats'] },
    { name: 'Goblet Squats', equipment: 'dumbbell', alternatives: ['Squats', 'Leg Press'] },
    { name: 'Bulgarian Split Squats', equipment: 'dumbbell', alternatives: ['Lunges', 'Step-ups'] },
    { name: 'Lunges', equipment: 'dumbbell', alternatives: ['Bulgarian Split Squats', 'Step-ups'] },
    { name: 'Step-ups', equipment: 'dumbbell', alternatives: ['Lunges', 'Bulgarian Split Squats'] },
    { name: 'Leg Extension', equipment: 'machine', alternatives: ['Squats'] },
    { name: 'Leg Curl', equipment: 'machine', alternatives: ['Romanian Deadlift'] },
    { name: 'Romanian Deadlift', equipment: 'barbell', alternatives: ['Leg Curl', 'Good Mornings'] },
    { name: 'Hip Thrust', equipment: 'barbell', alternatives: ['Glute Bridge'] },
    { name: 'Glute Bridge', equipment: 'bodyweight', alternatives: ['Hip Thrust'] },
    { name: 'Calf Raises', equipment: 'machine', alternatives: ['Standing Calf Raises'] },
    { name: 'Smith Machine Squats', equipment: 'machine', alternatives: ['Squats', 'Leg Press'] },
  ],
  'Arms': [
    { name: 'Barbell Curl', equipment: 'barbell', alternatives: ['Dumbbell Curl', 'Cable Curl'] },
    { name: 'Dumbbell Curl', equipment: 'dumbbell', alternatives: ['Barbell Curl', 'Cable Curl'] },
    { name: 'Cable Curl', equipment: 'cable', alternatives: ['Barbell Curl', 'Dumbbell Curl'] },
    { name: 'Hammer Curl', equipment: 'dumbbell', alternatives: ['Dumbbell Curl'] },
    { name: 'Preacher Curl', equipment: 'machine', alternatives: ['Barbell Curl', 'Dumbbell Curl'] },
    { name: 'Concentration Curl', equipment: 'dumbbell', alternatives: ['Dumbbell Curl'] },
    { name: 'Tricep Pushdown', equipment: 'cable', alternatives: ['Overhead Tricep Extension', 'Skull Crushers'] },
    { name: 'Skull Crushers', equipment: 'barbell', alternatives: ['Tricep Pushdown', 'Overhead Tricep Extension'] },
    { name: 'Overhead Tricep Extension', equipment: 'dumbbell', alternatives: ['Tricep Pushdown', 'Skull Crushers'] },
    { name: 'Close Grip Bench', equipment: 'barbell', alternatives: ['Tricep Pushdown', 'Dips'] },
    { name: 'Tricep Dips', equipment: 'bodyweight', alternatives: ['Tricep Pushdown'] },
  ],
  'Core': [
    { name: 'Weighted Sit-ups', equipment: 'weight', alternatives: ['Cable Crunch', 'Decline Sit-ups'] },
    { name: 'Cable Crunch', equipment: 'cable', alternatives: ['Weighted Sit-ups', 'Decline Sit-ups'] },
    { name: 'Decline Sit-ups', equipment: 'machine', alternatives: ['Weighted Sit-ups', 'Cable Crunch'] },
    { name: 'Hanging Knee Raise', equipment: 'bar', alternatives: ['Ab Wheel', 'Weighted Sit-ups'] },
    { name: 'Ab Wheel', equipment: 'equipment', alternatives: ['Hanging Knee Raise', 'Plank'] },
    { name: 'Plank', equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Side Plank'] },
    { name: 'Side Plank (Left)', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'] },
    { name: 'Side Plank (Right)', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Pallof Press'] },
    { name: 'Dead Bug', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Bird Dog'] },
    { name: 'Bird Dog', equipment: 'bodyweight', type: 'duration', alternatives: ['Dead Bug', 'Plank'] },
    { name: 'Dead Hang', equipment: 'bar', type: 'duration', alternatives: ['Plank'] },
    { name: 'L-Sit', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank'] },
    { name: 'Wall Sit', equipment: 'bodyweight', type: 'duration', alternatives: ['Plank', 'Leg Press'] },
    { name: 'Pallof Press', equipment: 'cable', alternatives: ['Side Plank'] },
    { name: 'Russian Twist', equipment: 'weight', alternatives: ['Cable Woodchop', 'Bicycle Crunch'] },
    { name: 'Cable Woodchop', equipment: 'cable', alternatives: ['Russian Twist'] },
    { name: 'Bicycle Crunch', equipment: 'bodyweight', alternatives: ['Russian Twist'] },
  ],
  'Cool-down': [
    { name: 'Chest Doorway Stretch', equipment: 'bodyweight' },
    { name: 'Cross-body Shoulder Stretch', equipment: 'bodyweight' },
    { name: 'Hip Flexor Stretch', equipment: 'bodyweight' },
    { name: 'Hamstring Stretch', equipment: 'bodyweight' },
    { name: 'Quad Stretch', equipment: 'bodyweight' },
    { name: 'Calf Stretch', equipment: 'bodyweight' },
    { name: 'Thoracic Rotation', equipment: 'bodyweight' },
    { name: 'Pigeon Pose', equipment: 'bodyweight' },
    { name: 'Child\'s Pose', equipment: 'bodyweight' },
    { name: 'Spinal Twist', equipment: 'bodyweight' },
    { name: 'Lat Stretch', equipment: 'bodyweight' },
    { name: 'Tricep Overhead Stretch', equipment: 'bodyweight' },
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
