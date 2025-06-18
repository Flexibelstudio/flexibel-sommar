
import { Workout, ExercisePhaseType, TimedSegment, WorkoutFormat, ExerciseInWorkout, Level, AchievementDefinition, AchievementCategory, AchievementCheckData, SummerStatusLevel } from './types';
import { StarIcon, TrophyIcon, CheckCircleIcon, FireIcon, FootstepsIcon, AcademicCapIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, KettlebellIcon, StickFigureIcon, BicepIcon, HighFiveIcon, FistBumpIcon, ShareIcon, SunIcon, LightbulbIcon, BookOpenIcon, InstagramIcon, FacebookIcon, WaveIcon, DrinkIcon, InformationCircleIcon, EditIcon, ShuffleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon, CertificateIcon, SparklesIcon, PlusCircleIcon } from './components/Icons';
import * as localStorageService from '../services/localStorageService'; 

export const PREPARE_SEGMENT: TimedSegment = {
  name: "Gör dig redo!",
  type: ExercisePhaseType.PREPARE,
  durationSeconds: 5,
  instructions: "Passet startar snart..."
};

export const BREATHING_CUE_REST = ""; 

// --- KETTLEBELL EXERCISES (uppdaterad lista) ---
export const KB_EXERCISES_LIST: { name: string; defaultDetail: string; instructionCue: string }[] = [
  {
    name: 'Kettlebell Swings', 
    defaultDetail: '15-20 reps',
    instructionCue: 'Explosiv höftrörelse, håll ryggen rak. Svinga till bröst/ögonhöjd.'
  },
  {
    name: 'Goblet Squats',
    defaultDetail: '12-15 reps',
    instructionCue: 'Håll KB mot bröstet, gå djupt, knän utåt.'
  },
  {
    name: 'Kettlebell Rows', 
    defaultDetail: '10-12 reps/sida',
    instructionCue: 'Stöd ena handen, dra KB mot höften, rak rygg.'
  },
  {
    name: 'Kettlebell Twists', 
    defaultDetail: '20-30 sek or 10-15 reps/sida',
    instructionCue: 'Håll KB mot bröstet eller vid sidan. Luta dig bakåt lätt, rotera överkroppen kontrollerat från sida till sida. Blicken kan följa med.'
  },
  {
    name: 'Kettlebell Halos',
    defaultDetail: '3-5 varv/riktning',
    instructionCue: 'Cirkla KB runt huvudet, nära kroppen, håll bålen stabil.'
  },
  {
    name: 'Single Arm KB Deadlifts',
    defaultDetail: '10-12 reps/sida',
    instructionCue: 'Enarmsmarklyft – håll KB nära benet, rak rygg.'
  },
  {
    name: 'Kettlebell Cleans', 
    defaultDetail: '6-8 reps/sida',
    instructionCue: 'Svinga klotet mellan benen, håll överarmen mot kroppen, låt armbågen leda rörelsen. Klotet ska landa mjukt i rackposition.'
  },
  {
    name: 'Kettlebell Push Press', 
    defaultDetail: '8-10 reps/sida',
    instructionCue: 'Använd benen, pressa vikten över huvudet.'
  },
  {
    name: 'Alternating KB Lunges',
    defaultDetail: '10-12 reps/sida',
    instructionCue: 'Håll KB i rackposition eller i hängande arm. Ta ett steg framåt, sänk bakre knät mot golvet. Tryck ifrån med främre foten för att återgå. Byt ben.'
  },
  {
    name: 'Kettlebell Figure Eights',
    defaultDetail: '8-10 reps/riktning',
    instructionCue: 'Stå med bred fotställning. För KB i en åtta runt och mellan benen. Håll ryggen rak och blicken framåt.'
  },
  {
    name: 'Kettlebell Windmills',
    defaultDetail: '5-8 reps/sida',
    instructionCue: 'Håll KB över huvudet. Fötterna pekar snett åt sidan. Skjut höften åt ena hållet och fäll överkroppen rakt åt sidan, ned mot foten. Blicken mot KB.'
  },
  {
    name: 'Kettlebell Snatches',
    defaultDetail: '5-8 reps/sida',
    instructionCue: 'En explosiv rörelse där KB svingas från mellan benen till en position rakt över huvudet med utsträckt arm. Kontrollerad nedtagning.'
  },
  {
    name: 'Kettlebell Turkish Get-ups (TGU)',
    defaultDetail: '3-5 reps/sida',
    instructionCue: 'En komplex helkroppsövning. Från liggande på rygg med KB i rak arm, till stående och tillbaka. Fokus på kontroll och stabilitet.'
  },
  {
    name: 'Kettlebell Overhead Swings',
    defaultDetail: '10-15 reps',
    instructionCue: 'Liknar vanlig sving men KB svingas hela vägen upp över huvudet. Kräver god rörlighet och kontroll. Håll bålen spänd.'
  },
  {
    name: 'Kettlebell Farmer\'s Walk',
    defaultDetail: '20-30 meter',
    instructionCue: 'Håll en eller två tunga kettlebells vid sidorna. Gå med stolt hållning, korta snabba steg. Spänn bålen.'
  },
  {
    name: 'Kettlebell Goblet Carry',
    defaultDetail: '20-30 meter',
    instructionCue: 'Håll en kettlebell mot bröstet (goblet-fattning). Gå med stolt hållning. Spänn bålen.'
  },
  {
    name: 'Kettlebell Thrusters',
    defaultDetail: '8-12 reps',
    instructionCue: 'Kombination av en frontböj (med KB i rackposition) och en push press. Explosiv rörelse från botten av böjen till att pressa KB över huvudet.'
  },
   {
    name: 'Kettlebell Around The Worlds',
    defaultDetail: '5-8 varv/riktning',
    instructionCue: 'Stå upprätt, håll KB med båda händerna. För KB i en cirkel runt kroppen, byt hand framför och bakom. Håll bålen stabil och höfterna stilla.'
  },
  {
    name: 'Kettlebell Single Leg Deadlift (SLDL)',
    defaultDetail: '8-10 reps/sida',
    instructionCue: 'Stå på ett ben, håll KB i motsatt hand (eller samma hand för mer balansutmaning). Fäll fram från höften med rak rygg, låt det fria benet sträcka ut bakåt. Återgå kontrollerat.'
  },
  {
    name: 'Kettlebell Floor Press',
    defaultDetail: '10-12 reps/sida eller båda',
    instructionCue: 'Ligg på rygg med böjda knän. Håll en eller två KBs vid bröstet, armbågarna nära kroppen. Pressa KBs rakt upp tills armarna är utsträckta. Sänk kontrollerat.'
  }
];

// --- BODYWEIGHT EXERCISES (utökad lista) ---
export const BW_EXERCISES_LIST: { name: string; defaultDetail: string; instructionCue: string }[] = [
  {
    name: 'Höga Knän',
    defaultDetail: '30-45 sek',
    instructionCue: 'Spring på stället, dra upp knäna högt mot bröstet. Håll tempot uppe.'
  },
  {
    name: 'Burpees',
    defaultDetail: '8-12 reps',
    instructionCue: 'Från stående, ned i armhävningsposition, hoppa fram med fötterna, och avsluta med ett upphopp. Kan skalas genom att kliva istället för att hoppa.'
  },
  {
    name: 'Armhävningar',
    defaultDetail: 'Max reps eller 10-15 reps',
    instructionCue: 'Händerna axelbrett, sänk kroppen kontrollerat tills bröstet nästan nuddar golvet. Pressa upp. Håll kroppen rak. Kan göras på knä.'
  },
  {
    name: 'Knäböj (Air Squats)',
    defaultDetail: '15-20 reps',
    instructionCue: 'Axelbrett mellan fötterna, gå ned så djupt som möjligt med stolt bröst och rak rygg. Knäna ska följa tårnas riktning.'
  },
  {
    name: 'Utfallssteg (Lunges)',
    defaultDetail: '10-12 reps/ben',
    instructionCue: 'Ta ett stort kliv framåt, sänk kroppen tills båda knäna är i 90 graders vinkel. Tryck ifrån med främre foten för att återgå. Byt ben.'
  },
  {
    name: 'Plankan (Plank)',
    defaultDetail: '30-60 sek',
    instructionCue: 'Stå på armbågarna och tårna. Håll kroppen spikrak från huvud till häl. Spänn magen och rumpan. Undvik att svanka eller puta med rumpan.'
  },
  {
    name: 'Situps',
    defaultDetail: '15-20 reps',
    instructionCue: 'Ligg på rygg med böjda knän. Lyft överkroppen mot knäna. Sänk kontrollerat tillbaka. Försök att inte dra med nacken.'
  },
  {
    name: 'Mountain Climbers',
    defaultDetail: '30-45 sek',
    instructionCue: 'Stå i armhävningsposition. Dra växelvis in knäna mot bröstet i ett snabbt tempo, som att du klättrar.'
  },
  {
    name: 'Jumping Jacks (Sprattelgubbe)',
    defaultDetail: '30-45 sek',
    instructionCue: 'Hoppa ut med benen samtidigt som du för armarna över huvudet. Hoppa tillbaka till startposition. Håll ett jämnt tempo.'
  },
  {
    name: 'Rygglyft (Superman)',
    defaultDetail: '15-20 reps',
    instructionCue: 'Ligg på mage med armarna sträckta framåt. Lyft armar, bröst och ben från golvet samtidigt. Håll blicken nedåt. Sänk kontrollerat.'
  },
  {
    name: 'Bear Crawls',
    defaultDetail: '10-15 meter eller 30 sek',
    instructionCue: 'Stå på alla fyra med knäna lyfta från golvet, precis under höften. Rör dig framåt genom att flytta motsatt hand och fot samtidigt. Håll ryggen rak och höften låg.'
  },
  {
    name: 'Pistol Squats (Enbensknäböj)',
    defaultDetail: '3-5 reps/ben (om möjligt)',
    instructionCue: 'Stå på ett ben, sträck det andra benet rakt fram. Sänk dig ned i en djup knäböj på ståbenet. Kan modifieras genom att hålla i något för balans eller göra till en box/stol.'
  },
  {
    name: 'Broad Jumps (Längdhopp)',
    defaultDetail: '5-8 reps',
    instructionCue: 'Stå med fötterna axelbrett. Böj i knän och höft, svinga armarna bakåt och hoppa sedan så långt framåt som möjligt. Landa mjukt.'
  },
  {
    name: 'Tuck Jumps (Upphopp med knädrag)',
    defaultDetail: '10-15 reps',
    instructionCue: 'Hoppa rakt upp och dra samtidigt knäna så högt upp mot bröstet som möjligt. Landa mjukt och kontrollerat.'
  },
  {
    name: 'Glute Bridges (Höftlyft)',
    defaultDetail: '15-20 reps',
    instructionCue: 'Ligg på rygg med böjda knän och fötterna höftbrett isär. Pressa upp höften mot taket genom att spänna rumpan. Sänk kontrollerat.'
  },
  {
    name: 'Inchworms',
    defaultDetail: '5-8 reps',
    instructionCue: 'Börja stående. Fäll framåt och sätt händerna i golvet. Gå ut med händerna till en plankposition. Gå sedan tillbaka med händerna mot fötterna och res dig upp.'
  },
  {
    name: 'Side Planks (Sidoplanka)',
    defaultDetail: '20-30 sek/sida',
    instructionCue: 'Ligg på sidan, stöd på armbågen (under axeln) och fotens utsida. Lyft höften så kroppen bildar en rak linje. Håll. Byt sida.'
  },
  {
    name: 'Triceps Dips (mot bänk/stol)',
    defaultDetail: '10-15 reps',
    instructionCue: 'Sitt på kanten av en bänk/stol med händerna bredvid höften. Flytta fram rumpan från bänken. Sänk kroppen genom att böja armbågarna, pressa sedan upp. Håll armbågarna nära kroppen.'
  },
  {
    name: 'Calf Raises (Tåhävningar)',
    defaultDetail: '20-25 reps',
    instructionCue: 'Stå med fötterna höftbrett. Pressa upp på tårna så högt som möjligt. Sänk långsamt ned. Kan göras på ett eller två ben.'
  },
  {
    name: 'Core Twists (Bålvridningar)',
    defaultDetail: '15-20 reps/sida or 30-45 sek',
    instructionCue: 'Sitt på golvet, lätt bakåtlutad med spänd mage, fötterna kan vara i luften eller i golvet. Rotera överkroppen från sida till sida. Kan göras med vikt för ökad intensitet.'
  }
];

// --- LEVEL DEFINITIONS (Moved before ACHIEVEMENT_DEFINITIONS if it depends on it) ---
export const LEVEL_DEFINITIONS: Level[] = [
  { name: 'Nybörjar-Flex', minWorkouts: 0, description: 'Precis börjat din resa mot en starkare sommar!', icon: StarIcon }, // Changed icon to component
  { name: 'Sommar-Spurtare', minWorkouts: 5, description: 'Du är på gång och känner energin flöda!', icon: SparklesIcon },
  { name: 'Flex-Fantomen', minWorkouts: 10, description: 'Regelbunden träning börjar bli en vana. Grymt!', icon: FireIcon },
  { name: 'Kettlebell-Krigare', minWorkouts: 15, description: 'Du bemästrar vikterna och utmaningarna!', icon: KettlebellIcon },
  { name: 'Uthållighets-Undret', minWorkouts: 20, description: 'Din kondition och styrka når nya höjder!', icon: BicepIcon },
  { name: 'SommarChallenge-Champion', minWorkouts: 25, description: 'Du har visat otrolig dedikation. En sann champion!', icon: TrophyIcon },
  { name: 'Flexibel Elit', minWorkouts: 30, description: 'Toppnivå! Du är en inspiration för andra.', icon: AcademicCapIcon },
  { name: 'Legendarisk Lejon', minWorkouts: 40, description: 'Din uthållighet och styrka är legendarisk!', icon: HighFiveIcon },
  { name: 'Sommarutmaningens Mästare', minWorkouts: 50, description: 'Du har erövrat sommarutmaningen! Otroligt!', icon: FistBumpIcon },
];

// --- WALKING CHALLENGE CONSTANTS (Moved Up) ---
export const WALKING_CHALLENGE_TOTAL_DAYS = 30;
export const WALKING_CHALLENGE_DAILY_MINUTES = 30;

// --- ACHIEVEMENT DEFINITIONS ---
// Total 13 Achievements after removal
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Training Milestones (Now 3 Achievements)
  {
    id: 'train_first_workout',
    name: 'Första Svettdroppen',
    description: 'Slutför 1 träningspass i Sommarutmaningen. Vilken start!',
    icon: KettlebellIcon,
    category: AchievementCategory.TRAINING,
    isAchieved: (data) => data.totalWorkoutsCompleted >= 1,
  },
  {
    id: 'train_both_kb_and_bw',
    name: 'Variations-Virtuosen',
    description: 'Slutför minst 1 Kettlebell-pass OCH minst 1 Kroppsviktspass. Bra variation!',
    icon: ShuffleIcon,
    category: AchievementCategory.TRAINING,
    isAchieved: (data) => {
        const hasKB = data.workoutLog.some(log => log.workoutType === 'kettlebell' || WORKOUTS.find(w => w.id === log.workoutId)?.type === 'kettlebell');
        const hasBW = data.workoutLog.some(log => log.workoutType === 'bodyweight' || WORKOUTS.find(w => w.id === log.workoutId)?.type === 'bodyweight');
        return hasKB && hasBW;
    }
  },
  {
    id: 'train_streak_7_days',
    name: 'Vecko-Vinnaren',
    description: 'Uppnå en träningsstreak på 7 dagar i rad. Du är ostoppbar!',
    icon: FireIcon,
    category: AchievementCategory.TRAINING,
    isAchieved: (data) => data.currentWorkoutStreak >= 7,
  },

  // Walking Milestones (Now 4 Achievements)
  {
    id: 'walk_first_day',
    name: 'Första Steget Taget',
    description: `Logga din första promenad (1 dag) i Promenadutmaning!`,
    icon: FootstepsIcon,
    category: AchievementCategory.WALKING,
    isAchieved: (data) => data.totalWalkingDaysCompleted >= 1,
  },
  {
    id: 'walk_10_days',
    name: 'Gång-Glädje x10',
    description: `Logga 10 promenaddagar i Promenadutmaning. Fantastiskt för både kropp och knopp!`,
    icon: FootstepsIcon,
    category: AchievementCategory.WALKING,
    isAchieved: (data) => data.totalWalkingDaysCompleted >= 10,
  },
  {
    id: 'walk_streak_10_days',
    name: 'Stabila Steg',
    description: 'Uppnå en promenadstreak på 10 dagar i rad. Dina fötter bär dig framåt med kraft!',
    icon: FireIcon,
    category: AchievementCategory.WALKING,
    isAchieved: (data) => data.currentWalkingStreak >= 10,
  },
  {
    id: 'walk_challenge_completed',
    name: 'Promenad-Mästare Utmaning',
    description: `Slutför hela Promenadutmaning (logga ${WALKING_CHALLENGE_TOTAL_DAYS} promenaddagar). Otroligt bra jobbat!`,
    icon: TrophyIcon,
    category: AchievementCategory.WALKING,
    isAchieved: (data) => data.totalWalkingDaysCompleted >= WALKING_CHALLENGE_TOTAL_DAYS,
  },
  
  // Engagement Milestones (6 Achievements - unchanged)
  {
    id: 'engage_favorite_workout',
    name: 'Favorit-Finneren',
    description: 'Markera minst 1 träningspass som favorit. Bra att veta vad du gillar!',
    icon: StarIcon,
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.favoriteWorkoutIds.length >= 1,
  },
  {
    id: 'engage_used_bartender', // Changed ID from engage_used_ai_bartender
    name: 'Cocktail-Kännare',
    description: "Använd 'Flexibel Bartender' för att generera minst 1 träningspass. Skål för kreativiteten!", // Removed AI
    icon: DrinkIcon,
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.workoutLog.some(log => log.workoutId.startsWith('generated-')),
  },
  {
    id: 'engage_sharer_1',
    name: 'Dela-Entusiasten',
    description: 'Dela appen 1 gång. Tack för att du sprider ordet!',
    icon: ShareIcon,
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.appShareCount >= 1,
  },
  {
    id: 'engage_sharer_2_ambassador',
    name: 'Spridnings-Ambassadören',
    description: 'Dela appen 2 gånger. Du är en sann ambassadör för träningsglädje!',
    icon: ShareIcon,
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.appShareCount >= 2,
  },
  {
    id: 'engage_sharer_3_community',
    name: 'Community-Mästaren',
    description: 'Dela appen 3 gånger. Du bygger community och peppar andra. Starkt!',
    icon: ShareIcon,
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.appShareCount >= 3,
  },
  {
    id: 'engage_sharer_4_superstar',
    name: 'Flexibel Super-Stjärna',
    description: 'Dela appen 4 gånger. Du är en Super-Stjärna! En hemlig belöning väntar...',
    icon: StarIcon, 
    category: AchievementCategory.ENGAGEMENT,
    isAchieved: (data) => data.appShareCount >= 4,
  },
];


export const WORKOUTS: Workout[] = [
  // --- KETTLEBELL WORKOUTS ---
  {
    id: 'kb-emom-10',
    title: 'Kettlebell EMOM Express (10 min)',
    shortTitle: 'KB EMOM 10',
    type: 'kettlebell',
    format: WorkoutFormat.EMOM,
    detailedDescription: 'En snabb och effektiv EMOM (Every Minute On the Minute) med kettlebell. Perfekt när tiden är knapp men du vill få till ett bra pass!',
    exerciseSummaryList: [
      { name: 'Kettlebell Swings', details: '15 reps (udda min)' },
      { name: 'Goblet Squats', details: '10 reps (jämna min)' },
    ],
    totalEstimatedTimeMinutes: 10,
    timedSegments: Array(10).fill(null).map((_, i) => ({
      name: `Minut ${i + 1}: ${ (i + 1) % 2 !== 0 ? 'Kettlebell Swings' : 'Goblet Squats'}`,
      type: ExercisePhaseType.WORK,
      durationSeconds: 60,
      instructions: `Utför ${(i + 1) % 2 !== 0 ? '15 Kettlebell Swings' : '10 Goblet Squats'}. Vila resten av minuten.`,
      exercises: [( (i + 1) % 2 !== 0 ? 
        { name: 'Kettlebell Swings', reps: '15 reps', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Kettlebell Swings')?.instructionCue } :
        { name: 'Goblet Squats', reps: '10 reps', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Goblet Squats')?.instructionCue }
      )],
      currentRound: i + 1,
      totalRounds: 10,
    })),
    difficultyLevel: 'Medel',
    tags: ['helkropp', 'emom', 'snabbpass', 'styrka'],
  },
  {
    id: 'kb-classic-12',
    title: 'Klassisk Kettlebell Cirkel (12 min)',
    shortTitle: 'KB Cirkel 12',
    type: 'kettlebell',
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: 'En klassisk cirkelträning med kettlebell där du varvar styrkeövningar med korta vilopauser. Fokus på helkroppsstyrka och uthållighet.',
    exerciseSummaryList: [
      { name: 'Kettlebell Rows', details: '10 reps/sida' },
      { name: 'Kettlebell Halos', details: '4 varv/riktning' },
      { name: 'Alternating KB Lunges', details: '8 reps/sida' },
    ],
    totalEstimatedTimeMinutes: 12,
    timedSegments: (() => {
      const segments: TimedSegment[] = [];
      const exercises: ExerciseInWorkout[] = [
        { name: 'Kettlebell Rows', reps: '10 reps/sida', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Kettlebell Rows')?.instructionCue },
        { name: 'Kettlebell Halos', reps: '4 varv/riktning', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Kettlebell Halos')?.instructionCue },
        { name: 'Alternating KB Lunges', reps: '8 reps/sida', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Alternating KB Lunges')?.instructionCue },
      ];
      const rounds = 3;
      for (let r = 0; r < rounds; r++) {
        exercises.forEach(ex => {
          segments.push({
            name: ex.name,
            type: ExercisePhaseType.WORK,
            durationSeconds: 45, // Tid för övningen
            instructions: `Utför ${ex.name} (${ex.reps}). Runda ${r + 1} av ${rounds}.`,
            exercises: [ex],
            currentRound: r + 1,
            totalRounds: rounds,
          });
          if (ex.name !== exercises[exercises.length -1].name) { // Lägg till vila utom efter sista övningen i varvet
             segments.push({
                name: "Sippaus",
                type: ExercisePhaseType.REST,
                durationSeconds: 15,
                instructions: BREATHING_CUE_REST + " Kort vila.",
             });
          }
        });
        if (r < rounds - 1) { // Längre vila mellan varven, utom efter sista varvet
             segments.push({
                name: "Varvsvila",
                type: ExercisePhaseType.REST,
                durationSeconds: 30,
                instructions: BREATHING_CUE_REST + " Längre vila inför nästa varv.",
             });
        }
      }
      return segments;
    })(),
    roundsText: '3 varv',
    difficultyLevel: 'Medel',
    tags: ['helkropp', 'cirkelträning', 'styrka', 'uthållighet'],
  },
  {
    id: 'kb-amrap-15',
    title: 'Kettlebell AMRAP Styrka (15 min)',
    shortTitle: 'KB AMRAP 15',
    type: 'kettlebell',
    format: WorkoutFormat.AMRAP,
    detailedDescription: 'Så många varv som möjligt (AMRAP) på 15 minuter. En riktig utmaning för både styrka och pannben! Kom ihåg att logga ditt resultat (antal varv + reps).',
    exerciseSummaryList: [
      { name: 'Kettlebell Cleans', details: '6 reps/sida' },
      { name: 'Kettlebell Push Press', details: '8 reps/sida' },
      { name: 'Goblet Squats', details: '12 reps' },
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [{
      name: 'AMRAP Cirkel',
      type: ExercisePhaseType.WORK,
      durationSeconds: 15 * 60,
      instructions: `Så många varv och reps som möjligt (AMRAP) av följande på 15 minuter:`,
      exercises: [
        { name: 'Kettlebell Cleans', reps: '6 reps/sida', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Kettlebell Cleans')?.instructionCue },
        { name: 'Kettlebell Push Press', reps: '8 reps/sida', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Kettlebell Push Press')?.instructionCue },
        { name: 'Goblet Squats', reps: '12 reps', instructions: KB_EXERCISES_LIST.find(ex => ex.name === 'Goblet Squats')?.instructionCue },
      ],
    }],
    difficultyLevel: 'Avancerad',
    tags: ['helkropp', 'amrap', 'högintensiv', 'styrka', 'utmaning'],
  },

  // --- BODYWEIGHT WORKOUTS ---
  {
    id: 'bw-emom-10',
    title: 'Kroppsvikt EMOM Puls (10 min)',
    shortTitle: 'BW EMOM 10',
    type: 'bodyweight',
    format: WorkoutFormat.EMOM,
    detailedDescription: 'En pulshöjande EMOM med enbart kroppsvikt. Varje minut startar en ny övning. Effektivt och svettigt!',
    exerciseSummaryList: [
      { name: 'Höga Knän', details: '40 sek (udda min)' },
      { name: 'Armhävningar', details: 'Max reps på 30 sek (jämna min)' },
    ],
    totalEstimatedTimeMinutes: 10,
    timedSegments: Array(10).fill(null).map((_, i) => ({
      name: `Minut ${i + 1}: ${ (i + 1) % 2 !== 0 ? 'Höga Knän' : 'Armhävningar'}`,
      type: ExercisePhaseType.WORK,
      durationSeconds: 60,
      instructions: `${ (i + 1) % 2 !== 0 ? 'Utför Höga Knän i 40 sekunder.' : 'Utför maximalt antal Armhävningar på 30 sekunder.'} Vila resten av minuten.`,
      exercises: [( (i + 1) % 2 !== 0 ? 
        { name: 'Höga Knän', durationSeconds: 40, instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Höga Knän')?.instructionCue } :
        { name: 'Armhävningar', reps: 'Max reps', durationSeconds: 30, instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Armhävningar')?.instructionCue }
      )],
      currentRound: i + 1,
      totalRounds: 10,
    })),
    difficultyLevel: 'Medel',
    tags: ['helkropp', 'emom', 'puls', 'snabbpass', 'kroppsvikt'],
  },
  {
    id: 'bw-classic-15',
    title: 'Klassisk Kroppsvikt Cirkel (15 min)',
    shortTitle: 'BW Cirkel 15',
    type: 'bodyweight',
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: 'En allsidig kroppsviktscirkel som tränar hela kroppen. Utför varje övning med god teknik och kontroll.',
    exerciseSummaryList: [
      { name: 'Knäböj (Air Squats)', details: '15 reps' },
      { name: 'Utfallssteg (Lunges)', details: '10 reps/ben' },
      { name: 'Plankan (Plank)', details: '45 sek' },
      { name: 'Mountain Climbers', details: '30 sek' },
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: (() => {
      const segments: TimedSegment[] = [];
      const exercises: ExerciseInWorkout[] = [
        { name: 'Knäböj (Air Squats)', reps: '15 reps', instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Knäböj (Air Squats)')?.instructionCue },
        { name: 'Utfallssteg (Lunges)', reps: '10 reps/ben', instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Utfallssteg (Lunges)')?.instructionCue },
        { name: 'Plankan (Plank)', durationSeconds: 45, instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Plankan (Plank)')?.instructionCue },
        { name: 'Mountain Climbers', durationSeconds: 30, instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Mountain Climbers')?.instructionCue },
      ];
      const rounds = 3;
      for (let r = 0; r < rounds; r++) {
        exercises.forEach(ex => {
          segments.push({
            name: ex.name,
            type: ExercisePhaseType.WORK,
            durationSeconds: ex.durationSeconds || 40, // Default 40s if no duration
            instructions: `Utför ${ex.name} (${ex.reps || (ex.durationSeconds + ' sek')}). Runda ${r + 1} av ${rounds}.`,
            exercises: [ex],
            currentRound: r + 1,
            totalRounds: rounds,
          });
          if (ex.name !== exercises[exercises.length -1].name) {
             segments.push({
                name: "Sippaus",
                type: ExercisePhaseType.REST,
                durationSeconds: 15,
                instructions: BREATHING_CUE_REST + " Kort vila.",
             });
          }
        });
        if (r < rounds - 1) {
             segments.push({
                name: "Varvsvila",
                type: ExercisePhaseType.REST,
                durationSeconds: 30,
                instructions: BREATHING_CUE_REST + " Längre vila inför nästa varv.",
             });
        }
      }
      return segments;
    })(),
    roundsText: '3 varv',
    difficultyLevel: 'Nybörjare',
    tags: ['helkropp', 'cirkelträning', 'kroppsvikt', 'core'],
  },
  {
    id: 'bw-amrap-12',
    title: 'Kroppsvikt AMRAP Puls & Styrka (12 min)',
    shortTitle: 'BW AMRAP 12',
    type: 'bodyweight',
    format: WorkoutFormat.AMRAP,
    detailedDescription: 'En intensiv AMRAP som kombinerar pulshöjande övningar med styrka. Ge allt du har på 12 minuter! Kom ihåg att logga ditt resultat.',
    exerciseSummaryList: [
      { name: 'Burpees', details: '5 reps' },
      { name: 'Situps', details: '10 reps' },
      { name: 'Jumping Jacks', details: '20 reps' },
    ],
    totalEstimatedTimeMinutes: 12,
    timedSegments: [{
      name: 'AMRAP Cirkel',
      type: ExercisePhaseType.WORK,
      durationSeconds: 12 * 60,
      instructions: `Så många varv och reps som möjligt (AMRAP) av följande på 12 minuter:`,
      exercises: [
        { name: 'Burpees', reps: '5 reps', instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Burpees')?.instructionCue },
        { name: 'Situps', reps: '10 reps', instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Situps')?.instructionCue },
        { name: 'Jumping Jacks', reps: '20 reps', instructions: BW_EXERCISES_LIST.find(ex => ex.name === 'Jumping Jacks (Sprattelgubbe)')?.instructionCue },
      ],
    }],
    difficultyLevel: 'Medel',
    tags: ['helkropp', 'amrap', 'högintensiv', 'puls', 'styrka', 'kroppsvikt'],
  },

  // --- WARM-UPS ---
  {
    id: 'warmup-dynamic-5',
    title: 'Dynamisk Helkropp (5 min)',
    shortTitle: 'Dynamisk 5',
    type: 'bodyweight', 
    format: WorkoutFormat.CLASSIC_ROUNDS, 
    detailedDescription: 'En klassisk dynamisk uppvärmning för att förbereda kroppen för träning. Fokus på rörlighet och att få igång pulsen.',
    exerciseSummaryList: [
      { name: 'Armcirklar (framåt & bakåt)', details: '45s' },
      { name: 'Höftcirklar (med & motsols)', details: '45s' },
      { name: 'Benpendlingar (framåt & sidled)', details: '60s' },
      { name: 'Lätt jogg / Höga knän', details: '60s' },
      { name: 'Knäböj (långsamt)', details: '45s'},
      { name: 'Katt-Ko', details: '45s'},
    ],
    totalEstimatedTimeMinutes: 5,
    timedSegments: [
      { name: 'Armcirklar (framåt & bakåt)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Stora, kontrollerade cirklar med armarna.' },
      { name: 'Höftcirklar (med & motsols)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Stora cirklar med höften.' },
      { name: 'Benpendlingar (framåt & sidled)', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Pendla benen kontrollerat, 30 sek per ben (15s framåt, 15s sidled).' },
      { name: 'Lätt jogg på stället / Höga knän (lugnt tempo)', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Få igång pulsen lite lätt.' },
      { name: 'Knäböj utan vikt (långsamt)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Fokus på rörelseuttag och teknik.' },
      { name: 'Katt-Ko (Cat-Cow)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Mjuka upp ryggen.' },
    ],
    difficultyLevel: 'Nybörjare',
    tags: ['uppvärmning', 'dynamisk', 'helkropp', 'rörlighet', 'kroppsvikt', '5min'],
  },
  {
    id: 'warmup-general-body-5', 
    title: 'Allmän Kroppsvärmning (5 min)',
    shortTitle: 'Allmän 5', 
    type: 'bodyweight', 
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: 'Fokuserar på att få igång hela kroppen med marsch, axelrullningar och bålvridningar. Förbereder muskler och leder för aktivitet utan redskap.',
    exerciseSummaryList: [
      { name: 'Marsch på stället', details: '60s' },
      { name: 'Axelrullningar', details: '45s' },
      { name: 'Stående Bålvridning', details: '45s' },
      { name: 'Sidostretch', details: '60s' },
      { name: 'Små Utfallssteg', details: '45s' },
      { name: 'Ankelcirklar', details: '45s' },
    ],
    totalEstimatedTimeMinutes: 5,
    timedSegments: [ 
      { name: 'Marsch på stället & Armpendling', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Kom igång! Marschera på stället, pendla med armarna.' },
      { name: 'Axelrullningar (framåt & bakåt)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Mjuka upp axlarna. Stora, lugna cirklar framåt och bakåt.' },
      { name: 'Stående Bålvridning', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Fötterna axelbrett, vrid överkroppen mjukt från sida till sida.' },
      { name: 'Sidostretch (höger & vänster)', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Sträck ena armen över huvudet, luta åt sidan. Håll ca 30 sek per sida.' },
      { name: 'Små Utfallssteg (växelvis)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Korta utfallssteg framåt, fokus på mjuk rörelse. Växla ben.' },
      { name: 'Ankelcirklar (höger & vänster)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Cirkla ena fotleden, byt sedan fot. Båda riktningarna.' },
    ],
    difficultyLevel: 'Nybörjare',
    tags: ['uppvärmning', 'allmän', 'helkropp', 'rörlighet', 'kroppsvikt', '5min'], 
  },
  {
    id: 'warmup-mobility-focus-5',
    title: 'Rörlighetsfokus (5 min)',
    shortTitle: 'Rörlighet 5',
    type: 'bodyweight',
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: 'En mjukare uppvärmning med fokus på att öka rörligheten i lederna. Perfekt för att starta dagen eller innan ett lugnare pass.',
    exerciseSummaryList: [
      { name: 'Nackrullningar', details: '45s' },
      { name: 'Axelcirklar', details: '45s' },
      { name: 'Handledscirklar & Fingersträck', details: '45s' },
      { name: 'Bålvridningar (stående)', details: '45s' },
      { name: 'Höftcirklar', details: '60s' },
      { name: 'Ankelcirklar', details: '60s' },
    ],
    totalEstimatedTimeMinutes: 5,
    timedSegments: [
      { name: 'Nackrullningar (försiktigt)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Luta huvudet försiktigt från sida till sida, sedan framåt och lätt bakåt. Undvik fulla cirklar om det känns obehagligt.' },
      { name: 'Axelcirklar (stora)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Gör stora, långsamma cirklar med axlarna, både framåt och bakåt.' },
      { name: 'Handleds- & Finger Cirklar/Sträck', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Cirkla handlederna. Knyt och spreta med fingrarna.' },
      { name: 'Stående Bålvridningar (mjuka)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Stå med fötterna axelbrett, håll armarna avslappnade och vrid överkroppen mjukt från sida till sida.' },
      { name: 'Höftcirklar (stora)', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Stå med lätt böjda knän och gör stora cirklar med höfterna, både med- och motsols.' },
      { name: 'Ankelcirklar', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Lyft ett ben i taget och cirkla fotleden, 30 sekunder per fot, båda riktningarna.' },
    ],
    difficultyLevel: 'Nybörjare',
    tags: ['uppvärmning', 'rörlighet', 'leder', 'lågintensiv', 'kroppsvikt', '5min'],
  },
  {
    id: 'warmup-pulse-coordination-5',
    title: 'Puls & Koordination (5 min)',
    shortTitle: 'Puls 5',
    type: 'bodyweight',
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: 'Väck kroppen och nervsystemet! En uppvärmning som lätt höjer pulsen och utmanar koordinationen.',
    exerciseSummaryList: [
      { name: 'Lätt marsch/jogg', details: '45s' },
      { name: 'Hälkickar', details: '45s' },
      { name: 'Jumping Jacks (Sprattel)', details: '60s' },
      { name: 'Krysshopp / Sidosteg armlyft', details: '60s' },
      { name: 'Höga knän (lugnt)', details: '45s' },
      { name: 'Skuggboxning (lätt)', details: '45s' },
    ],
    totalEstimatedTimeMinutes: 5,
    timedSegments: [
      { name: 'Lätt marsch / Jogg på stället', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Börja med att marschera eller jogga lätt på stället. Pendla med armarna.' },
      { name: 'Hälkickar (Butt Kicks)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Spring på stället och försök nudda rumpan med hälarna. Håll ett lätt tempo.' },
      { name: 'Jumping Jacks (Sprattelgubbe)', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Klassiska sprattelgubbar. Kan modifieras till step-jacks utan hopp om så önskas.' },
      { name: 'Krysshopp / Sidosteg med armlyft', type: ExercisePhaseType.WORK, durationSeconds: 60, instructions: 'Alternera mellan att korsa fötterna i ett litet hopp, eller ta sidosteg och lyft armarna.' },
      { name: 'Höga knän (lugnt tempo)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Dra upp knäna mot bröstet i ett lugnt, kontrollerat tempo.' },
      { name: 'Skuggboxning (lätt)', type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: 'Stå med lätt böjda knän och boxas lätt i luften. Rör på fötterna.' },
    ],
    difficultyLevel: 'Nybörjare',
    tags: ['uppvärmning', 'puls', 'koordination', 'kroppsvikt', '5min'],
  },
];


export const getCurrentWorkoutLevel = (totalWorkouts: number): Level => {
  let currentLevel = LEVEL_DEFINITIONS[0];
  for (const level of LEVEL_DEFINITIONS) {
    if (totalWorkouts >= (level.minWorkouts ?? 0)) {
      currentLevel = level;
    } else {
      break; 
    }
  }
  return currentLevel;
};

// --- WALKING CHALLENGE (Definitions moved up, values used here) ---
export const WALKING_LEVEL_DEFINITIONS: Level[] = [
  { name: 'Promenad-Pionjär', minDays: 0, description: 'Första stegen på din 30-dagars promenadresa!', icon: FootstepsIcon },
  { name: 'Stigfinnare', minDays: 5, description: 'Du hittar nya vägar och njuter av rörelsen!', icon: FootstepsIcon },
  { name: 'Kilometer-Klippare', minDays: 10, description: 'Halvvägs genom första etappen, bra jobbat!', icon: FootstepsIcon },
  { name: 'Terräng-Trotjänare', minDays: 15, description: 'Du bemästrar både asfalt och skogsstigar!', icon: FootstepsIcon },
  { name: 'Horisont-Hajkare', minDays: 20, description: 'Nya vyer och starkare ben för varje dag!', icon: FootstepsIcon },
  { name: 'Vandrings-Virtuos', minDays: 25, description: 'Snart i mål, vilken uthållighet!', icon: FootstepsIcon },
  { name: 'Promenad-Mästare', minDays: WALKING_CHALLENGE_TOTAL_DAYS, description: `Grattis! Du har klarat ${WALKING_CHALLENGE_TOTAL_DAYS}-dagars Promenadutmaning!`, icon: TrophyIcon },
];

export const getCurrentWalkingLevel = (completedDays: number): Level => {
  let currentLevel = WALKING_LEVEL_DEFINITIONS[0];
   const effectiveDays = completedDays > WALKING_CHALLENGE_TOTAL_DAYS ? WALKING_CHALLENGE_TOTAL_DAYS : completedDays;
  for (const level of WALKING_LEVEL_DEFINITIONS) {
    if (effectiveDays >= (level.minDays ?? 0)) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};


// --- APP STRINGS ---
export const APP_STRINGS = {
  logoText: 'Flexibel Sommarutmaning!',
  appName: 'Flexibel Sommarutmaning 2025!',
  appDescription: 'Sommarutmaning 2025! Din dagliga dos av pepp för sommarens utmaningar. Korta, effektiva träningspass och motiverande promenadutmaningar.',
  appMainCampaignTitle: 'Flexibels Sommarutmaning 2025',
  appHashtag: '#FlexibelSommar',
  
  // Home View
  homeViewFooterText: '© 2025 Flexibel Hälsostudio. Alla rättigheter förbehållna.',
  greetingMorning: 'God morgon, {name}!',
  greetingDay: 'Heja på, {name}!',
  greetingEvening: 'God kväll, {name}!',
  greetingSuperSharerSuffixPart1: 'Du är en ',
  greetingSuperSharerSuffixStar: 'Flexibel Super-Stjärna!',
  greetingSuperSharerSuffixPart2: ' ✨',

  strongRemark: 'Du ser stark ut idag!',
  enterYourNamePrompt: 'Välkommen till Flexibels Sommarutmaning!',
  enterYourNameEngagingSubtitle: 'Ange ditt namn för att spara dina framsteg och få personliga hälsningar. All data lagras lokalt i din webbläsare och raderas om du rensar webbhistorik/cache.',
  enterYourNameInputLabel: 'Ditt namn',
  saveNameButton: 'Spara & Starta!',
  
  homeStreakLabel: 'Streak',
  homeStreakUnit: 'dagar',
  homeTotalWorkoutsLabel: 'Totalt antal pass',
  homeTotalWorkoutsUnit: 'pass',
  homeCurrentLevelLabel: 'Nivå (Träning)',
  
  warmUpButton: 'Uppvärmning 5 min',
  warmUpButtonTitle: 'Starta en snabb och effektiv uppvärmning',
  workoutOfTheDayKBButton: 'Dagens KB-Pass',
  workoutOfTheDayKBButtonTitle: 'Starta ett slumpmässigt kettlebellpass (10-15 min)',
  workoutOfTheDayBWButton: 'Dagens Kroppsviktspass',
  workoutOfTheDayBWButtonTitle: 'Starta ett slumpmässigt kroppsviktspass (10-15 min)',
  generateButton: 'Flexibel Bartender', // Removed AI
  viewLevelsButton: 'Visa Träningsnivåer',
  noWorkoutsAvailable: 'Inga pass av denna typ finns just nu.',
  maxLevelReachedText: 'Maximal nivå uppnådd! Fantastiskt!',
  workoutsToNextLevelText: '{count} pass kvar till {levelName}!',

  homeDailyExtraTitle: 'Dagens Extra Pepp:',
  homeDailyPepButtonText: 'Visa Dagens Pepp-Meddelande!',
  pepModalTitle: "Dagens Pepp från Flexibel!",

  homeNavButtonDiplomasAndFavorites: 'Min Profil & Logg',
  homeNavButtonInfoAndContact: 'Info & Kontakt',
  homeNavButtonTipsAndInspiration: 'Tips & Inspiration',

  // Workout Detail View
  backToHome: 'Tillbaka till Start',
  startWorkout: 'Starta Passet',
  startGeneratedWorkoutButton: 'Drick Cocktailen!', 
  addToFavoritesTooltip: 'Lägg till som favorit',
  removeFromFavoritesTooltip: 'Ta bort från favoriter',
  workoutDetailPreviousScoreLabel: 'Ditt senaste resultat på detta pass:',

  // Pre-Workout Countdown View
  preWorkoutCountdownTitle: 'Passet startar om...',
  preWarmupCountdownTitle: 'Uppvärmningen startar om...',
  prepareSegmentTitlePersonalized: '{name}, gör dig redo!',

  // Active Workout View
  nextExerciseLabel: 'Nästa:',
  pause: 'Pausa',
  resume: 'Återuppta',
  endWorkout: 'Avsluta Pass',
  confirmEndWorkoutTitle: 'Är du säker?',
  confirmEndWorkoutMessage: 'Vill du verkligen avsluta passet nu? Dina framsteg för detta pass kommer inte att sparas fullt ut.',
  confirmEndWarmupMessage: 'Vill du avsluta uppvärmningen? Du kommer då att få välja ett nytt pass.',
  confirmEndWorkoutYesButton: 'Ja, avsluta',
  confirmEndWorkoutNoButton: 'Nej, fortsätt',
  timeCapCompleteWorkoutButton: 'Färdig! (For Time)',

  // Post-Workout View
  postWorkoutTitle: 'Starkt Jobbat!',
  workoutCompleteTitle: 'Pass Slutfört!',
  postWorkoutBaseCompletionMessage: 'Bra kämpat, {name}! Ett pass närmare dina mål.',
  postWorkoutFirstEverMessage: 'GRATTIS till ditt första slutförda pass, {name}! Vilken start!',
  postWorkoutStreakContinuedMessage: 'Din streak fortsätter: {streak} dagar i rad! Grymt, {name}!',
  postWorkoutNewStreakMessage: 'Ny streak påbörjad! Heja dig, {name}!',
  postWorkoutTotalCountMessage: 'Totalt antal slutförda pass: {count} st.',
  postWorkoutLevelUpMessage: 'GRATTIS, {name}! Du har nått nivån: {levelName}!',
  postWorkoutScoreLabelAMRAP: 'Ditt resultat (Varv + Reps):',
  postWorkoutScorePlaceholderAMRAP: 'Ex: 7 varv + 5 reps eller 7r + 5p',
  postWorkoutScoreLabelTimeCap: 'Din tid (MM:SS):',
  postWorkoutScorePlaceholderTimeCap: 'Ex: 14:30',
  postWorkoutCommentLabel: 'Kommentar till passet (valfritt):',
  postWorkoutCommentPlaceholder: 'Hur kändes passet? Några PB:s?',
  markAsFavoriteQuestion: 'Markera som favoritpass?',
  showDiplomaButton: 'Visa Diplom',
  shareLevelUpButton: 'Dela Nivåhöjning',
  saveAndGoHomeButton: 'Spara & Gå Hem', // Used in PostWorkout and PostWalking
  shareWorkoutLevelUpText: "Jag har nått en ny nivå i Flexibels Träningsutmaning: {levelName}! Heja mig! {hashtag} {appFullName}", // Added
  
  postWorkoutAbortedTitle: "Pass Avbrutet",
  postWorkoutAbortedInfo: "Inga problem, ibland blir det inte som man tänkt! Kom tillbaka starkare nästa gång.",


  // Diploma View
  diplomaViewTitle: 'Träningsdiplom',
  diplomaCongratulations: 'GRATTIS {name}!',
  diplomaHeadlineUser: 'Du har bemästrat följande utmaning:',
  diplomaHeadlineGeneric: 'Du har bemästrat följande utmaning:',
  diplomaWorkoutLabel: 'Pass:',
  diplomaDateLabel: 'Datum:',
  diplomaTimeLabel: 'Tid/Varaktighet:',
  diplomaLevelLabel: 'Nivå vid slutförande:',
  diplomaTotalWorkoutsLabel: 'Totalt antal pass vid detta tillfälle:',
  diplomaCommentLabel: 'Din kommentar:',
  diplomaNewLevelReachedText: 'Ny nivå uppnådd:',
  shareDiplomaButton: 'Dela Diplom',
  shareWorkoutDiplomaText: "Jag klarade {workoutTitle} den {date} kl {time}! Nivå: {levelName}. {hashtag} {appFullName}", // Added
  diplomaLogEntryButton: 'Visa',
  diplomaYourScoreLabel: 'Ditt resultat:',
  diplomaNewRecordText: 'Nytt personligt rekord!',
  diplomaPreviousBestText: 'Tidigare bästa:',
  closeDiplomaButtonAriaLabel: 'Stäng diplom',

  // Level System View
  levelSystemViewTitle: 'Träningsnivåer',
  workoutLevelSystemTitle: 'Träningsnivåer - Sommarutmaningen',
  currentLevelText: 'Din nuvarande nivå: ',
  workoutsToNextText: '{count} pass kvar till nästa nivå: {levelName}',
  levelRequirementText: '{minWorkouts} pass',

  // Profile View
  profileViewTitle: 'Min Profil',
  editNameTooltip: 'Redigera namn',
  changeNameLabelInProfile: 'Ändra ditt visningsnamn:',
  saveProfileButton: 'Spara Namn',
  cancelButton: 'Avbryt',
  profileDiplomasTitle: 'Mina Träningsdiplom',
  profileNoDiplomas: 'Inga träningsdiplom ännu. Slutför pass för att samla!',
  profileFavoriteWorkoutsTitle: 'Mina Favoritpass',
  profileNoFavoriteWorkouts: 'Inga favoritpass markerade ännu.',
  viewWorkoutButton: 'Visa',
  profileDataStorageInfoTitle: 'Dataskyddsinformation',
  profileDataStorageInfoText: 'All din data, inklusive namn, träningslogg och framsteg, lagras endast lokalt i din webbläsare på denna enhet. Ingen data skickas externt eller sparas på servrar. Om du rensar din webbläsares cache eller historik för denna sida kommer din data att raderas permanent.',
  profileWalkingChallengeTitle: 'Min Promenadutmaning',
  profileWalkingChallengeLogTitle: 'Loggade Promenader',
  profileNoWalkingLogEntries: 'Inga promenader loggade ännu.',
  profileWalkingDayCompleted: 'Dag {day} avklarad',
  profileWalkingLogDistanceLabel: 'Distans:',
  profileWalkingLogStepsLabel: 'Steg:',
  profileMinaPromenadDiplomTitle: 'Mina Promenaddiplom',
  profileNoPromenadDiplom: 'Inga promenaddiplom ännu. Logga promenader för att samla!',

  // Spread Love View / Info & Kontakt
  spreadLoveViewTitle: 'Information & Kontakt',
  shareAppTitle: 'Sprid Träningsglädjen!',
  shareAppButton: 'Dela Sommarutmaningen!', // Button text for a general "share app"
  spreadLoveShareMotivationText: 'Hjälp oss sprida träningsglädje! Dela Sommarutmaningen med vänner och familj.',
  spreadLoveCommunityHashtagSuggestion: 'Använd gärna #FlexibelSommar när du delar!',
  linkCopiedToClipboard: 'Länk kopierad till urklipp!',
  aboutUsSectionTitle: 'Om Flexibel Friskvård & Hälsa',
  aboutUsParagraph1: 'Vi på Flexibel Friskvård & Hälsa brinner för att göra träning och hälsa tillgängligt och roligt för alla. Vår vision är att inspirera till en aktiv livsstil genom personlig coaching, gruppträning och skräddarsydda lösningar för både privatpersoner och företag.',
  aboutUsParagraph2: 'Med studios i Salems centrum och Kärra centrum erbjuder vi en välkomnande miljö där du kan utmana dig själv, nå dina mål och bli en del av en stöttande gemenskap. Vi tror på kraften i att må bra, både fysiskt och psykiskt.',
  aboutUsTagline: 'Välkommen till oss – din partner för en starkare och gladare vardag!',
  contactEmailLabel: 'E-post:',
  contactEmailValue: 'info@flexibelfriskvardhalsa.se',
  contactPhoneNumberLabel: 'Telefon:',
  contactPhoneNumberValue: '076-000 09 25', // Updated phone number
  spreadLoveStudioLocationsInfo: 'Studios i Salems Centrum & Kärra Centrum.',
  bookIntroTitle: 'Boka Introsamtal eller Pass',
  bookIntroLinkText: 'Boka Introsamtal',
  qrCodeAltText: 'QR-kod till bokningssidan',
  shareBookingButtonText: 'Dela Bokningslänk',
  shareBookingMessageText: 'Nyfiken på Flexibel? Boka ett introsamtal eller pass här: {bookingUrl} {hashtag} {appFullName}',

  // Tips View
  tipsViewTitle: 'Tips, Inspiration & Sociala Medier',
  summerReadingsTitle: 'Inspiration & Sommartips',
  summerReadingsButton: 'Till Bloggen',
  instagramSectionTitle: 'Följ Oss på Instagram',
  instagramButtonText: '@flexibelhalsa',
  facebookSectionTitle: 'Gilla Oss på Facebook',
  facebookButtonText: 'Flexibel Friskvård & Hälsa',

  // Post Warm-Up Prompt View
  postWarmUpPromptTitle: 'Uppvärmning Klar!',
  postWarmUpPromptQuestion: 'Redo för dagens utmaning?',
  
  // Walking Challenge
  walkingChallengeHomeTitle: "Promenadutmaning (30 dagar)",
  logWalkButton: "Logga Dagens Promenad",
  logWalkFormTitle: "Logga din promenad",
  logWalkInstruction: "Bra jobbat med promenaden, {name}! Ange detaljer nedan.",
  logWalkDurationLabel: "Promenadens längd (minuter)",
  logWalkDurationPlaceholder: "Minst {min_duration} min för att räknas",
  logWalkDurationErrorInvalid: "Ange en giltig längd i minuter (mer än 0).",
  logWalkDurationInfo: `Minst ${WALKING_CHALLENGE_DAILY_MINUTES} minuter krävs för att klara dagens Promenadutmaning.`,
  logWalkDistanceLabel: "Distans (km, valfritt)",
  logWalkDistancePlaceholder: "Ex: 3.5",
  logWalkStepsLabel: "Antal steg (valfritt)",
  logWalkStepsPlaceholder: "Ex: 4500",
  logWalkCommentLabel: "Kommentar (valfritt)",
  logWalkCommentPlaceholder: "Hur kändes promenaden? Något speciellt du såg?",
  logWalkSaveButton: "Spara Promenad",
  walkingChallengeInfoButtonTooltip: "Info om Promenadutmaning",
  walkingChallengeInfoModalTitle: "Info: Promenadutmaning",
  walkingChallengeInfoModalPurposeLabel: "Syfte:",
  walkingChallengeInfoModalPurposeText: "Att uppmuntra till daglig rörelse och skapa en hälsosam vana under sommaren.",
  walkingChallengeInfoModalHowItWorksLabel: "Så funkar det:",
  walkingChallengeInfoModalRule1ManualLog: `Du loggar dina promenader manuellt här i appen. En promenad på minst ${WALKING_CHALLENGE_DAILY_MINUTES} minuter krävs för att klara en dag.`,
  walkingChallengeInfoModalRule2: "Utmaningen pågår i 30 dagar. Målet är att klara så många dagar som möjligt.",
  walkingChallengeInfoModalRule3: "Du kan logga en promenad per dag. Om du går flera gånger, logga den längsta eller den du vill räkna.",
  walkingChallengeInfoModalRule4: "Nivåer och diplom låses upp baserat på antalet avklarade dagar.",
  walkingChallengeInfoModalRule5: "Försök att vara ärlig med din loggning för bästa upplevelse!",
  walkingChallengeInfoModalTipsLabel: "Tips:",
  walkingChallengeInfoModalTipsText: "Variera dina rutter, lyssna på en podd eller musik, eller gå tillsammans med en vän!",
  walkingChallengeDayDisplay: "Dag {day} av {totalDays} avklarad!",
  walkingChallengeStreakLabel: "Gång-Streak",
  walkingChallengeCurrentLevelLabel: "Nivå (Gång)",
  viewWalkingLevelsButton: "Visa Gångnivåer",
  walkingChallengeNotCompletedToday: `Du har inte loggat dagens ${WALKING_CHALLENGE_DAILY_MINUTES} minuters promenad ännu.`,
  walkingChallengeCompletedToday: "Dagens promenad loggad!",
  walkingChallengeAllDaysCompleted: `Alla ${WALKING_CHALLENGE_TOTAL_DAYS} dagar avklarade! Grymt!`,
  walkingChallengeAllDaysCompletedShort: "Alla dagar klara!", // Shorter version for buttons etc.
  daysToNextWalkingLevelText: "{count} dagar kvar till {levelName}!",

  // Active Walking View (Obsolete, but some strings might be reused or adapted for LogWalk)
  activeWalkingTitle: "Promenad Pågår",
  activeWalkingStartTimeLabel: "Starttid:",
  pauseWalkingButton: "Pausa Promenad",
  resumeWalkingButton: "Återuppta Promenad",
  completeWalkingChallengeButton: "Slutför Promenad", // Was completeAndLogWalkButton
  confirmEndWalkingTitle: "Avsluta Promenad?",
  confirmEndWalkingDurationInfo: "Din promenad varade i {duration}.",
  confirmEndWalkingMotivationEarned: "Snyggt jobbat! Dagens utmaning är klar.",
  confirmEndWalkingMotivationNoDiploma: `Bra kämpat! För att klara dagens utmaning och få den registrerad behöver du gå minst ${WALKING_CHALLENGE_DAILY_MINUTES} minuter.`,
  confirmEndWalkingQuestion: "Vill du avsluta och logga denna promenad?",

  // Post Walking View
  postWalkingTitle: "Promenad Loggad!",
  postWalkingSuccessMessage: "Härligt, {name}! Dag {dayNumber} av Promenadutmaning är loggad.",
  postWalkingChallengeFullyCompletedMessage: "Stort grattis, {name}! Du har klarat hela Promenadutmaning på {totalDays} dagar!", 
  postWalkingDurationLogged: "Din loggade tid: {duration}.",
  postWalkingStreakMessage: "Din promenad-streak är nu {streak} dagar! Fortsätt så!",
  postWalkingLevelUpMessage: "GRATTIS, {name}! Du har nått en ny gångnivå: {levelName}!",
  postWalkingAbortedTitle: "Promenad Ej Fullföljd",
  postWalkingAbortedInfoShort: "Försök igen! Minst 30 minuter behövs för att klara en dag.",
  postWalkingAbortedInfoLong: "Din promenad på {duration} var lite för kort. Minst {min_duration} minuter behövs för att klara en dag. Kämpa på!",
  postWalkingDistanceLabel: "Distans (km, valfritt):",
  postWalkingDistancePlaceholder: "Ex: 3.5",
  postWalkingStepsLabel: "Antal steg (valfritt):",
  postWalkingStepsPlaceholder: "Ex: 5000",
  postWalkingShowDiplomaButton: "Visa Promenaddiplom",
  shareWalkingLevelUpText: "Jag har nått en ny nivå i Flexibels Promenadutmaning: {levelName}! Heja mig! {hashtag} {appFullName}",
  shareChallengeCompletedButton: "Dela Bedrift", // For completing all 30 days
  shareWalkingChallengeCompletedText: "{name} har klarat hela Flexibels Promenadutmaning på {totalDays} dagar! Vilken prestation! {hashtag} {appFullName}",


  // Walking Diploma View
  walkingDiplomaViewTitle: "Promenaddiplom",
  walkingDiplomaCongratulations: "BRA GÅTT, {name}!",
  walkingDiplomaHeadlineUser: "Du har promenerat med bravur:",
  walkingDiplomaHeadlineGeneric: "Du har promenerat med bravur:",
  walkingDiplomaChallengeDayLabel: "Utmaningsdag:",
  walkingDiplomaDateLabel: "Datum:",
  walkingDiplomaStartTimeLabel: "Starttid:",
  walkingDiplomaEndTimeLabel: "Sluttid:",
  walkingDiplomaDurationLabel: "Varaktighet:",
  walkingDiplomaDistanceLabel: "Distans:",
  walkingDiplomaStepsLabel: "Antal steg:",
  walkingDiplomaLevelLabel: "Nivå vid slutförande:",
  walkingDiplomaTotalDaysLabel: "Totalt antal dagar vid detta tillfälle:",
  walkingDiplomaStreakLabel: "Gång-streak vid detta tillfälle:",
  walkingDiplomaNewDistanceRecordText: "Nytt distansrekord!",
  walkingDiplomaPreviousBestDistanceText: "Tidigare bästa:",
  walkingDiplomaNewStepsRecordText: "Nytt stegrekord!",
  walkingDiplomaPreviousBestStepsText: "Tidigare bästa:",
  shareWalkingDiplomaButton: "Dela Promenaddiplom",
  shareWalkingDiplomaText: "Jag klarade dag {challengeDay} av Flexibels Promenadutmaning den {date} kl {time}! Nivå: {levelName}. Streak: {streak} dagar! {hashtag} {appFullName}",
  shareWalkingDiplomaNoStreakText: "Jag klarade dag {challengeDay} av Flexibels Promenadutmaning den {date} kl {time}! Nivå: {levelName}. {hashtag} {appFullName}",


  // Walking Level System View
  walkingLevelSystemViewTitle: 'Promenadnivåer - Promenadutmaning',
  walkingChallengeMaxLevelReachedText: 'Maximal nivå uppnådd i Promenadutmaning! Strålande!',

  // Workout Challenge Info Modal (Home View)
  workoutChallengeInfoButtonTooltip: "Info om Träningsutmaningarna",
  workoutChallengeInfoModalTitle: "Träningsutmaningar", 
  workoutChallengeInfoModalPurposeLabel: "Syfte:",
  workoutChallengeInfoModalPurposeText: "Att motivera till regelbunden och varierad träning under sommaren, med både färdiga pass och genererade alternativ.", // Removed AI
  workoutChallengeInfoModalHowItWorksLabel: "Så funkar det:",
  workoutChallengeInfoModalRule1: "Välj mellan förprogrammerade Kettlebell-pass eller Kroppsviktspass (ca 10-15 min).",
  workoutChallengeInfoModalRule2: "Efter varje slutfört pass loggas dina framsteg, din streak räknas och du kan gå upp i nivå.",
  workoutChallengeInfoModalRuleGenerated: "Använd 'Flexibel Bartender' för att skapa ett unikt pass anpassat efter dina önskemål (typ, tid, fokus, svårighetsgrad).", // Renamed RuleAI to RuleGenerated, removed AI
  workoutChallengeInfoModalRule3: "Du kan även starta en kortare uppvärmning (5 min) innan ditt valda pass.",
  workoutChallengeInfoModalRule4: "Kommentarer och resultat (för AMRAP/For Time) kan sparas och visas på dina diplom.",
  workoutChallengeInfoModalTipsLabel: "Tips:",
  workoutChallengeInfoModalTipsText: "Försök variera typ av pass. Glöm inte att fira dina framsteg och dela dina diplom!",

  // Generate Workout View
  generateWorkoutViewTitle: 'Flexibel Bartender', // Removed AI
  generateWorkoutDescription: 'Låt vår bartender blanda ihop en unik träningscocktail åt dig! Välj dina ingredienser nedan.', // Removed AI
  workoutTypeLabel: 'Bas (Typ av träning):',
  kettlebellOption: 'Kettlebell Styrka',
  bodyweightOption: 'Kroppsvikt Energi',
  durationLabel: 'Styrka (Längd i minuter):',
  focusLabel: 'Smakprofil (Fokusområde):',
  fullBodyOption: 'Helkroppssensation',
  upperBodyOption: 'Överkroppselixir',
  lowerBodyOption: 'Underkroppsboost',
  coreOption: 'Kärnkrafts-kick',
  difficultyLabel: 'Intensitet (Svårighetsgrad):',
  beginnerOption: 'Lätt & Läskande (Nybörjare)',
  intermediateOption: 'Medelstark & Mättande (Medel)',
  advancedOption: 'Rivig & Resultatinriktad (Avancerad)',
  formatLabel: 'Serveringsstil (Träningsformat):',
  classicRoundsOption: 'Klassiska Shots (Varvcirkel)',
  emomOption: 'EMOM Elixir (Varje Minut)',
  amrapOption: 'AMRAP Aperitif (Så Många Varv Som Möjligt)',
  timeCapOption: 'Time Cap Tonic (På Tid)',
  generateButtonTitle: 'Blanda din unika träningscocktail!',
  generatingWorkoutTitle: 'Bartendern Mixar...',
  generatingWorkoutMessage: 'Din personliga träningscocktail skakas just nu. Snart serverad!',
  errorGeneratingWorkoutTitle: 'Hoppsan, spill i baren!',
  errorGeneratingWorkoutMessage: 'Kunde inte blanda din cocktail just nu. Försök igen eller justera dina ingredienser.',
  errorInvalidResponse: 'Bartendern verkar ha blandat ihop ingredienserna lite. Prova gärna igen!', // Removed AI
  errorGeneratedWorkoutMissingExercises: "Bartendern glömde visst några ingredienser i din cocktail (övningar saknas i ett segment). Vänligen försök igen!", // Renamed errorAIWorkoutMissingExercises, Removed AI
  generatedWorkoutTitle: 'Din Cocktail Är Serverad!',
  discardAndRegenerateButton: 'Blanda Ny Drink',

  // Achievements View
  profileAchievementsTitle: "Mina Utmärkelser",
  achievementLockedTooltip: "Denna utmärkelse är fortfarande låst. Fortsätt kämpa!",
  
  // Summer Status (Home View)
  homeSummerStatusTitle: "Total Sommarstatus",
  homeSummerStatusScoreLabel: "Poäng:",
  homeSummerViewAchievementsButton: "Visa Alla Utmärkelser",
  homeSummerScoreInfoButtonTooltip: "Information om Sommarpoäng",
  homeSummerScoreInfoModalTitle: "Information om Sommarpoäng",
  homeSummerScoreInfoModalDesc1: "Din totala sommarstatus baseras på poäng från tre källor:",
  homeSummerScoreInfoModalWorkoutPoints: "Träningspass: 1 poäng per slutfört pass (max {points}p).",
  homeSummerScoreInfoModalWalkingPoints: "Promenadutmaning: 1 poäng per avklarad dag (max {points}p).",
  homeSummerScoreInfoModalAchievementPoints: "Utmärkelser: 1 poäng per upplåst utmärkelse (max {points}p).", 

  // Share and Engagement
  superSharerModalTitleEnhanced: "Flexibel Super-Stjärna!",
  superSharerModalMessage1Enhanced: "Wow, {name}! Du är en sann Flexibel Super-Stjärna som delat appen fyra gånger! Tack för att du sprider träningsglädjen!",
  superSharerModalRewardDetails: "Som tack får du en NOCCO eller Vitamin Well när du besöker studion! Vi har 20 st av varje i Salems centrum och Kärra centrum.",
  superSharerModalInstructionsAndCode: "", 
  superSharerModalFinePrint: "(Gäller så långt lagret räcker. Max en dryck per Super-Stjärna.)",

  spreadLoveCardTitle: "Dela Appen - Dela hälsa", // Updated title
  spreadLoveCardText: "Gillar du appen? Hjälp oss nå ut till fler genom att dela den med dina vänner!",
  spreadLoveCardButton: "Dela Appen - Dela hälsa", // Updated button text
};

// --- DAILY EXTRAS ---
export const DAILY_EXTRAS = [
  { text: "Visste du att ett kort, intensivt pass kan vara lika effektivt som ett längre, lugnare pass? Kör hårt!", iconType: 'tip' as const },
  { text: "Kom ihåg att dricka vatten! Speciellt viktigt under varma sommardagar och efter träning.", iconType: 'tip' as const },
  { text: "\"Den bästa tiden att plantera ett träd var för 20 år sedan. Den näst bästa tiden är nu.\" - Kinesiskt ordspråk. Detsamma gäller träning!", iconType: 'quote' as const },
  { text: "Fokusera på framsteg, inte perfektion. Varje litet steg räknas!", iconType: 'tip' as const },
  { text: "Glöm inte bort vardagsmotionen! Ta trapporna, cykla till jobbet, eller gå en extra sväng med hunden.", iconType: 'tip' as const },
  { text: "\"Skillnaden mellan det omöjliga och det möjliga ligger i en persons beslutsamhet.\" - Tommy Lasorda", iconType: 'quote' as const },
  { text: "Sov ordentligt! Återhämtning är lika viktigt som själva träningen för att bygga muskler och må bra.", iconType: 'tip' as const },
];

export const DAILY_PEP_MESSAGES = [
  "Du är starkare än du tror! Ge järnet idag!",
  "Varje repetition, varje steg, tar dig närmare ditt mål. Heja dig!",
  "Kom ihåg varför du började. Din hälsa är värd det!",
  "Lite träningsvärk imorgon är ett kvitto på dagens insats. Bra jobbat!",
  "Energin du investerar i träning får du tillbaka med råge. Kör hårt!",
  "Sätt på din favoritmusik och känn peppen flöda!",
  "Du klarar mer än du tror. Utmana dig själv lite extra idag!",
  "Idag är en perfekt dag att vara stolt över dina framsteg, stora som små.",
  "Ett träningspass är en present till dig själv. Njut av det!",
  "Fokusera på känslan efteråt – den är oslagbar!",
  "Släpp alla måsten och ge dig själv denna stund. Du förtjänar det!",
  "Oavsett hur dagen varit, så kan ett träningspass vända det. Ta chansen!",
  "Du bygger inte bara muskler, du bygger självförtroende. Fortsätt så!",
  "Varje svettpärla är ett steg mot en piggare och gladare du.",
  "Glöm inte att le – träning ska vara kul!",
  "Lyssna på din kropp, men våga också utmana den.",
  "Tänk på den där härliga känslan av att ha genomfört något bra för dig själv.",
  "Du är en inspirationskälla, både för dig själv och andra!",
  "Framsteg är summan av små ansträngningar, upprepade dag efter dag.",
  "Ta ett djupt andetag och känn kraften inom dig. Nu kör vi!"
];

// --- TOTAL SUMMER SCORE CALCULATION ---
export const MAX_WORKOUT_CHALLENGE_POINTS = 30; // Max 30 points from workouts
export const MAX_WALKING_CHALLENGE_POINTS = WALKING_CHALLENGE_TOTAL_DAYS; // Max 30 points

const isSuperstarAchievement = (ach: AchievementDefinition) => ach.id === "engage_sharer_4_superstar";

// Filter out the superstar achievement IF its modal has NOT been shown.
// If the modal HAS been shown, or if it's any other achievement, it's counted.
const countDisplayableAchievements = (allAchievements: AchievementDefinition[], superstarModalShown: boolean): number => {
  return allAchievements.filter(ach => {
    if (isSuperstarAchievement(ach)) {
      // Only count superstar if its modal has been shown OR if it's achieved through other means (though modal is main reveal)
      return superstarModalShown || ach.isAchieved(tempCheckDataForCount()); // tempCheckData might be too simple here
    }
    return true; // Count all other achievements
  }).length;
};
// Temporary dummy data for the sole purpose of getting a count.
// This is NOT used for actual achievement checking during runtime, only for MAX_ACHIEVEMENT_POINTS.
const tempCheckDataForCount = (): AchievementCheckData => ({
  workoutLog: [], walkingLog: [], favoriteWorkoutIds: [],
  currentWorkoutLevel: LEVEL_DEFINITIONS[0], currentWalkingLevel: WALKING_LEVEL_DEFINITIONS[0],
  totalWorkoutsCompleted: 0, totalWalkingDaysCompleted: 0,
  currentWorkoutStreak: 0, currentWalkingStreak: 0, appShareCount: 0,
});


// Calculate based on ALL defined achievements, as this is the theoretical max.
// The display logic for the superstar achievement is separate.
export const MAX_ACHIEVEMENT_POINTS = ACHIEVEMENT_DEFINITIONS.length;

// This constant is for display purposes on HomeView if we want to show a slightly adjusted "possible" score
// if the superstar achievement is still hidden.
export const MYSTERY_ACHIEVEMENT_COUNT_DISPLAY = ACHIEVEMENT_DEFINITIONS.some(isSuperstarAchievement) ? 1 : 0;


export const TOTAL_SUMMER_SCORE_MAX = MAX_WORKOUT_CHALLENGE_POINTS + MAX_WALKING_CHALLENGE_POINTS + MAX_ACHIEVEMENT_POINTS;

export const SUMMER_STATUS_LEVELS: SummerStatusLevel[] = [
    { name: "Sommar-Nybörjare", minScore: 0, icon: SunIcon },
    { name: "Aktiv Solstråle", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.15), icon: SunIcon },
    { name: "Strand-Atlet", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.30), icon: WaveIcon },
    { name: "Semester-Sprinter", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.45), icon: FootstepsIcon },
    { name: "Energi-Entusiast", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.60), icon: FireIcon },
    { name: "Flexibel Fenix", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.75), icon: SparklesIcon },
    { name: "Sommarlegendar", minScore: Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.90), icon: TrophyIcon },
    { name: "Gyllene Ananasen", minScore: TOTAL_SUMMER_SCORE_MAX, icon: StarIcon }
];

// --- URLS ---
export const BLOG_URL = "https://www.flexibelfriskvardhalsa.se/blogg";
export const INSTAGRAM_URL = "https://www.instagram.com/flexibelhalsa/";
export const FACEBOOK_URL = "https://www.facebook.com/flexibelfriskvardhalsa";
