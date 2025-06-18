

export enum ExercisePhaseType {
  PREPARE = 'PREPARE',
  WORK = 'WORK',
  REST = 'REST',
}

export enum WorkoutFormat {
  CLASSIC_ROUNDS = 'CLASSIC_ROUNDS', // Sequence of work/rest segments, repeated for rounds
  EMOM = 'EMOM',                   // Every Minute On the Minute: new work starts each minute
  AMRAP = 'AMRAP',                 // As Many Rounds As Possible: repeat a circuit for a total time
  TIME_CAP = 'TIME_CAP',           // For Time: complete a set amount of work within a max time
}

// Describes a single exercise, possibly with reps or specific instructions for that instance.
export interface ExerciseInWorkout {
  name: string;           // e.g., "Kettlebell Swings"
  reps?: string;           // e.g., "10 reps", "Max reps" (for AMRAP/EMOM parts)
  durationSeconds?: number;// e.g., for a plank hold within an EMOM minute
  instructions?: string;   // Specific cues for this exercise in this context
  coachTip?: string;       // New: Specific coaching tip for this exercise instance
  scalingOptions?: {      // New: Options to make the exercise easier or harder
    easier?: string;
    harder?: string;
  };
}

// TimedSegment is used for CLASSIC_ROUNDS, and for each "task" or "block" in TIME_CAP.
// For EMOM, each TimedSegment will represent ONE MINUTE.
// For AMRAP, one TimedSegment might describe the circuit, with Workout.totalEstimatedTimeMinutes driving the clock.
export interface TimedSegment {
  name: string;                 // Segment name: "Kettlebell Swings", "Rest", "Minute 1", "AMRAP Circuit"
  type: ExercisePhaseType;      // WORK, REST, PREPARE
  durationSeconds: number;      // Duration of this segment (for EMOM, this will be 60s; for AMRAP, total AMRAP time)
  instructions: string;         // General instructions for the segment.
  exercises?: ExerciseInWorkout[]; // For EMOM: list of exercises to do within this minute.
                                 // For TIME_CAP "WORK" segments: could list the exercises for that task.
                                 // For AMRAP: lists exercises in the circuit.
  currentRound?: number;         // For CLASSIC_ROUNDS, the current round number
  totalRounds?: number;          // For CLASSIC_ROUNDS, the total number of rounds
}

export interface Workout {
  id: string;
  title: string;                // Full title
  shortTitle: string;           // For buttons on home screen, e.g., "KB EMOM 10"
  type: 'kettlebell' | 'bodyweight'; // Equipment
  format: WorkoutFormat;
  // General description of the workout, its flow, and goal.
  detailedDescription: string;

  // List of primary exercises involved, with typical rep/duration info for summary display.
  exerciseSummaryList: Array<{ name: string; details: string }>; // e.g., details: "10 reps", "30s hold"

  totalEstimatedTimeMinutes: number; // Overall workout time.
                                     // For AMRAP, this is the AMRAP duration.
                                     // For EMOM, total EMOM time.
                                     // For TIME_CAP, this is the cap.
                                     // For CLASSIC_ROUNDS, it's the sum of segment durations * rounds.

  timedSegments: TimedSegment[]; // The sequence of operations.
                                 // PREPARE segment should still be first.
                                 // CLASSIC_ROUNDS: work, rest, work, rest...
                                 // EMOM: each segment is 1 minute (type: WORK, duration: 60). `exercises` property lists what to do.
                                 // AMRAP: typically one WORK segment. `durationSeconds` = total AMRAP time. `exercises` lists the circuit.
                                 // TIME_CAP: sequence of WORK tasks, possibly with REST segments. `totalEstimatedTimeMinutes` is the hard cap.

  roundsText?: string; // Only for CLASSIC_ROUNDS, e.g., "3 varv"

  // New fields from AI content
  difficultyLevel?: string;       // e.g., 'Nybörjare', 'Medel', 'Avancerad'
  coreIncluded?: boolean;         // True if core exercises are significantly part of the workout
  includesPartnerExercises?: boolean; // True if any exercise requires a partner
  tags?: string[];                // e.g., ['helkropp', 'flås', 'styrka', 'core']
  coachCues?: string[];           // General coaching cues for the entire workout
}

export interface Level {
  name: string;
  minWorkouts?: number; // Kept for workout levels
  minDays?: number; // Added for walking challenge levels
  description?: string; // Optional fuller description if needed
  icon?: string | React.FC<{ className?: string; solid?: boolean }>; // Optional icon representation for the level
}

export interface WorkoutLogEntry {
  dateCompleted: string; // YYYY-MM-DD (local date)
  workoutId: string;
  workoutTitle: string;
  comment: string;
  timeCompleted?: string; // HH:MM (local time of day of completion)
  completionTimestamp: number; // Precise timestamp (Date.now()) of completion for uniqueness
  levelNameAtCompletion: string;
  score?: string; // Added for AMRAP/Time Cap results
  durationMinutes?: number; // Added to store workout duration, especially for AI workouts
  workoutType?: 'kettlebell' | 'bodyweight'; // Added to specify workout type for achievements
}

export enum View {
  Home = 'HOME',
  WorkoutDetail = 'WORKOUT_DETAIL',
  PreWorkoutCountdown = 'PRE_WORKOUT_COUNTDOWN',
  ActiveWorkout = 'ACTIVE_WORKOUT',
  PostWorkout = 'POST_WORKOUT',
  // LevelSystem = 'LEVEL_SYSTEM', // Removed
  // WalkingLevelSystem = 'WALKING_LEVEL_SYSTEM', // Removed
  Profile = 'PROFILE',
  SpreadLove = 'SPREAD_LOVE',
  Diploma = 'DIPLOMA',
  PostWarmUpPrompt = 'POST_WARMUP_PROMPT',
  Tips = 'TIPS',
  LogWalk = 'LOG_WALK', 
  ActiveWalking = 'ACTIVE_WALKING', // Added ActiveWalking view
  PostWalking = 'POST_WALKING',
  WalkingChallengeDetail = 'WALKING_CHALLENGE_DETAIL', 
  WalkingDiploma = 'WALKING_DIPLOMA',
  GenerateWorkout = 'GENERATE_WORKOUT',
  Achievements = 'ACHIEVEMENTS', // This view will now also handle level displays
}

export interface DiplomaData {
  workoutTitle: string;
  userName: string | null;
  levelName: string;
  completionDateTime: Date;
  workoutDurationSeconds?: number;
  totalWorkoutsCompleted: number;
  comment?: string;
  didLevelUp?: boolean;
  score?: string;
  isNewRecord?: boolean;
  previousBestScore?: string;
}

export interface CurrentWorkoutCompletionData {
  dateTime: Date;
  streak: number;
  totalWorkouts: number;
  level: Level;
  didLevelUp: boolean;
  workoutId: string;
  abortedByUser?: boolean;
  completedTimeSeconds?: number;
}

export interface PostWarmUpPromptViewProps {
  workout: Workout;
  onNavigate: (view: View, data?: { startChallenge: 'KB' | 'BW' }) => void;
  availableKBChallengeWorkouts: Workout[];
  availableBWChallengeWorkouts: Workout[];
  isGeneralPrompt?: boolean;
}

// --- Walking Challenge Specific Types ---
export enum ChallengeType {
  WORKOUT = 'WORKOUT',
  WALKING = 'WALKING',
}

export interface WalkingLogEntry {
  dateCompleted: string; // YYYY-MM-DD (date the walk was for)
  challengeDay: number;  // Which day of the 30-day challenge was completed
  durationMinutes: number; // Logged duration
  levelNameAtCompletion: string;
  streakAtCompletion: number;
  distance?: string; // e.g., "3.5 km"
  steps?: string;    // e.g., "4500 steg"
  comment?: string;
  logTimestamp: number; // Date.now() when the log was saved
  actualStartTime?: string; // ISO string for the actual start time of the walk
}

export interface CurrentWalkingCompletionData {
  logTimestamp: Date; // Date object from logTimestamp (when the walk was logged)
  newChallengeDay: number; // The day number that was just completed (1-30)
  currentStreak: number; // Consecutive days of meeting 30 min walk
  level: Level; // Current walking level
  didLevelUp: boolean;
  abortedByUser: boolean; // True if duration < 30 min (effectively)
  completedDurationMinutes: number; // Actual duration of the walk in minutes
  distance?: string;
  steps?: string;
  comment?: string;
  actualStartTime?: Date; // Actual start time of the walk
}

export interface WalkingDiplomaData {
  userName: string | null;
  challengeDayCompleted: number;
  logTimestamp: number; // Timestamp (Date.now()) when the walk was logged
  walkingLevelNameAtCompletion: string;
  totalWalkingDaysAtThisPoint: number;
  walkingStreakAtThisPoint?: number;
  didLevelUp?: boolean;
  distance?: string;
  steps?: string;
  isNewDistanceRecord?: boolean;
  previousBestDistance?: string;
  isNewStepsRecord?: boolean;
  previousBestSteps?: string;
  durationMinutes: number; // Actual duration of the walk in minutes
  comment?: string;
  actualStartTimestamp?: number; // Timestamp of when the walk actually started
}

// --- Achievements ---
export enum AchievementCategory {
  TRAINING = "Träningsmilstolpar",
  WALKING = "Promenadmilstolpar",
  ENGAGEMENT = "Engagemang i Appen",
}

export interface AchievementCheckData {
  workoutLog: WorkoutLogEntry[];
  walkingLog: WalkingLogEntry[];
  favoriteWorkoutIds: string[];
  currentWorkoutLevel: Level;
  currentWalkingLevel: Level | null;
  totalWorkoutsCompleted: number;
  totalWalkingDaysCompleted: number;
  currentWorkoutStreak: number;
  currentWalkingStreak: number;
  appShareCount: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string; solid?: boolean }>;
  category: AchievementCategory;
  isAchieved: (data: AchievementCheckData) => boolean;
}

// --- Total Summer Status ---
export interface SummerStatusLevel {
  name: string;
  minScore: number;
  icon?: React.FC<{ className?: string; solid?: boolean }>;
}

// --- Workout Generation ---
export interface WorkoutGenerationParams {
  type: 'kettlebell' | 'bodyweight';
  duration: number;
  focus: 'helkropp' | 'överkopp' | 'underkropp' | 'core';
  difficulty: 'Nybörjare' | 'Medel' | 'Avancerad';
  format: WorkoutFormat;
}

// --- LogWalkView ---
export interface LogWalkFormData {
  durationMinutes: number;
  distance?: string;
  steps?: string;
  comment?: string;
}
