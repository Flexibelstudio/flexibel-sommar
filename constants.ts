
import { Workout, ExercisePhaseType, TimedSegment, WorkoutFormat, ExerciseInWorkout, Level, AchievementDefinition, AchievementCategory, AchievementCheckData, SummerStatusLevel } from './types';
import { StarIcon, TrophyIcon, CheckCircleIcon, FireIcon, FootstepsIcon, AcademicCapIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, KettlebellIcon, StickFigureIcon, BicepIcon, HighFiveIcon, FistBumpIcon, ShareIcon, SunIcon, LightbulbIcon, BookOpenIcon, InstagramIcon, FacebookIcon, WaveIcon, DrinkIcon, InformationCircleIcon, EditIcon, ShuffleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon, CertificateIcon, SparklesIcon } from './components/Icons'; // Added SparklesIcon

export const PREPARE_SEGMENT: TimedSegment = {
  name: "Gör dig redo!",
  type: ExercisePhaseType.PREPARE,
  durationSeconds: 5,
  instructions: "Passet startar snart..."
};

export const BREATHING_CUE_REST = ""; // Removed specific breathing cue

// --- KETTLEBELL EXERCISES (uppdaterad lista) ---
export const KB_EXERCISES_LIST: { name: string; defaultDetail: string; instructionCue: string }[] = [
  {
    name: 'Kettlebell Swings', // Standard two-handed swing to chest/eye level
    defaultDetail: '15-20 reps',
    instructionCue: 'Explosiv höftrörelse, håll ryggen rak. Svinga till bröst/ögonhöjd.'
  },
  {
    name: 'Goblet Squats',
    defaultDetail: '12-15 reps',
    instructionCue: 'Håll KB mot bröstet, gå djupt, knän utåt.'
  },
  {
    name: 'Kettlebell Rows', // "Enarmsrodd" maps to this
    defaultDetail: '10-12 reps/sida',
    instructionCue: 'Stöd ena handen, dra KB mot höften, rak rygg.'
  },
  {
    name: 'Kettlebell Twists', // Replaced "Russian Twists"
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
    name: 'Kettlebell Cleans', // Assumed single-arm unless specified by AI
    defaultDetail: '6-8 reps/sida',
    instructionCue: 'Svinga klotet mellan benen, håll överarmen mot kroppen, låt armbågen leda rörelsen. Klotet ska landa mjukt i rackposition.'
  },
  {
    name: 'Kettlebell Push Press', // "Push Press (växelvis)" and "Axelpress (på knä)" map to this
    defaultDetail: '8-10 reps/sida',
    instructionCue: 'Använd benen, pressa vikten över huvudet.'
  },
  {
    name: 'Alternating KB Lunges',
    defaultDetail: '10-12 reps/ben',
    instructionCue: 'Håll KB i rack eller goblet, kliv fram, byt ben varje gång.'
  },
  {
    name: 'Kettlebell Figure 8s',
    defaultDetail: '6-10 varv',
    instructionCue: 'För KB i en åtta mellan benen, håll rak rygg.'
  },
  {
    name: 'Goblet Thrusters', // "Thrusters" and "KB Thrusters (växelvis)" map to this. "Växelvis" would be a performance note.
    defaultDetail: '8-12 reps',
    instructionCue: 'Från knäböj till press – explosiv uppgång.'
  },
  {
    name: 'Kettlebell Overhead Swings', // Replaced "Russian Swings", specific for overhead
    defaultDetail: '10-15 reps',
    instructionCue: 'Explosiv höftrörelse. Svinga kettlebellen hela vägen upp över huvudet med raka armar. Kontrollerad nedåtrörelse.'
  },
  {
    name: 'Kettlebell Deadlifts',
    defaultDetail: '12-15 reps',
    instructionCue: 'Skjut höften bak, håll vikten nära kroppen, rak rygg.'
  },
  {
    name: 'KB Push Press', 
    defaultDetail: '8-10 reps/sida',
    instructionCue: 'Böj lätt i benen, pressa rakt upp med kraft från benen.'
  },
  {
    name: 'Hollow Hold',
    defaultDetail: '20-30 sek',
    instructionCue: 'Spänn magen, armar och ben utsträckta, ländryggen i golvet.'
  },
  {
    name: 'KB Snatch',
    defaultDetail: '5-8 reps/sida',
    instructionCue: 'Explosivt från mark till över huvudet i en rörelse. Kontrollerad och kraftfull.'
  },
  {
    name: 'Situps', // Also in BW_EXERCISES_LIST for primary location
    defaultDetail: '10-15 reps',
    instructionCue: 'Upp med bröstet först, kontrollerad rörelse ner.'
  },
  {
    name: 'Burpees',
    defaultDetail: '6-10 reps',
    instructionCue: 'Bröst mot golv, hoppa upp, klappa ovanför huvudet.'
  },
  {
    name: 'Goblet Hold Squat',
    defaultDetail: '30-40 sek',
    instructionCue: 'Håll KB mot bröstet, sitt djupt och håll positionen.'
  },
  {
    name: 'KB Suitcase Deadlift',
    defaultDetail: '10-12 reps/sida',
    instructionCue: 'Lyft KB vid sidan av kroppen – rak rygg, spänn sidan.'
  },
  {
    name: 'KB Windmill (modifierad)',
    defaultDetail: '5 reps/sida',
    instructionCue: 'Sträck upp KB, fäll långsamt mot benet – håll rak arm.'
  },
  {
    name: 'KB Farmer\'s Hold',
    defaultDetail: '30-60 sek',
    instructionCue: 'Stå med tung KB i varje hand – spänn hela kroppen.'
  },
  {
    name: 'KB Around the World',
    defaultDetail: '10 varv',
    instructionCue: 'För KB runt kroppen, håll bål och höfter stilla.'
  },
  {
    name: 'KB Front Rack March',
    defaultDetail: '20-30 sek',
    instructionCue: 'Håll KB i rackposition, lyft ett ben i taget – spänn bålen.'
  },
  {
    name: 'Kettlebell Floor Press', // For "KB Bröstpress (liggande)"
    defaultDetail: '8-12 reps',
    instructionCue: 'Ligg på rygg, armbågar ca 45 grader från kroppen. Pressa kettlebellen/kettlebellsen rakt upp från bröstet. Sänk kontrollerat.'
  },
  {
    name: 'Kettlebell Split Stance RDL', // For "Split-stance RDL"
    defaultDetail: '8-10 reps/sida',
    instructionCue: 'Stå med ena foten lite framför den andra. Håll vikten i handen på samma sida som bakre benet. Fäll från höften med rak rygg, sänk vikten mot främre foten. Fokus på bakre lårets baksida.'
  },
  { 
    name: 'Kettlebell RDL', 
    defaultDetail: '10-12 reps', 
    instructionCue: 'Tvåhandsfattning. Skjut höften bakåt, lätt böjda knän, rak rygg. Sänk kettlebellen mot golvet, känn sträck i baksida lår.'
  },
  {
    name: 'Kettlebell Turkish Get-up', // New advanced exercise
    defaultDetail: '3-5 reps/sida',
    instructionCue: 'Långsam och kontrollerad rörelse från liggande till stående med KB sträckt mot taket. Fokus på stabilitet genom hela rörelsen. Många steg, lär dig dem!'
  },
];

export const BW_EXERCISES_LIST: { name: string; instructionCue: string }[] = [
  { name: 'Jumping Jacks', instructionCue: 'Hoppa med armar och ben ut och in. Håll ett lätt tempo för uppvärmning.' },
  { name: 'Armhävningar', instructionCue: 'På knä eller tår. Sänk bröstet mot golvet, spänn core.' },
  { name: 'Utfallsteg (alternerande)', instructionCue: 'Stort kliv framåt, sänk bakre knät mot golvet. Tänk på knäposition.' },
  { name: 'Plankan', instructionCue: 'Spänn magen, håll kroppen rak – undvik svank.' },
  { name: 'Burpees (förenklad)', instructionCue: 'Hoppa upp, ner i planka, tillbaka och hoppa. Utan armhävning.' },
  { name: 'Mountain Climbers', instructionCue: 'Händer under axlarna, dra knäna mot bröstet växelvis.' },
  { name: 'Höga Knän', instructionCue: 'Spring på stället, lyft knäna högt.' },
  { name: 'Superman', instructionCue: 'Ligg på mage, lyft armar och ben samtidigt, spänn rygg och rumpa.' },
  { name: 'Glute Bridges', instructionCue: 'Ligg på rygg, fötter nära rumpan, lyft höften.' },
  { name: 'Squat Jumps', instructionCue: 'Gå ner i en knäböj, explodera upp i ett hopp.' },
  { name: 'Marsch på stället', instructionCue: 'Lyft knäna växelvis, pendla med armarna.' },
  { name: 'Armcirklar', instructionCue: 'Stora cirklar med armarna, både framåt och bakåt.' },
  { name: 'Benpendlingar', instructionCue: 'Pendla ett ben i taget framåt/bakåt och sida till sida. Byt ben halvvägs.' },
  { name: 'Höftcirklar', instructionCue: 'Stå på ett ben, rita stora cirklar med andra knät. Byt ben och riktning.' },
  { name: 'Stående Torso Twists', instructionCue: 'Stå axelbrett, rotera överkroppen sida till sida. Håll höfterna stilla.' },
  { name: 'Katt-Ko', instructionCue: 'Stå på alla fyra. Runda och svanka ryggen långsamt i takt med andningen.' },
  { name: 'Knäböj (kroppsvikt)', instructionCue: 'Fötter axelbrett, gå ner så djupt som känns bra, håll bröstet upp.' }, // Maps to "Air Squats"
  { name: 'Walkouts', instructionCue: 'Böj dig framåt, gå ut med händerna till plankposition, gå tillbaka. Håll benen så raka du kan.' },
  { name: 'Side Plank (Höftlyft)', instructionCue: 'Ligg på sidan, lyft höften mot taket, håll kroppen i rak linje.'},
  { name: 'Bear Hold', instructionCue: 'Stå på alla fyra, lyft knäna några centimeter – spänn hela bålen.'},
  { name: 'Heel Taps', instructionCue: 'Ligg på rygg, nudda hälarna sida till sida. Spänn sidomagen.'},
  { name: 'Wall Sit', instructionCue: 'Sitt mot vägg som om du satt på en stol – knän i 90°, håll bröstet upp.'},
  {
    name: 'Plank with Arm Lift', // For "Plankan med armlyft"
    instructionCue: 'Stå i hög plankposition med stark bål. Lyft ena armen rakt fram utan att vrida höfterna. Sätt ner handen och byt arm.'
  },
  { 
    name: 'Situps', // Added here as primary location
    instructionCue: 'Upp med bröstet först, kontrollerad rörelse ner.' 
  },
  { 
    name: 'Plankan med Touch', // For "Plankan med Touch"
    instructionCue: 'Stå i hög plankposition. Nudda motsatt axel med handen, byt sida. Håll höfterna stilla.'
  },
  {
    name: 'Shoulder Taps', // For "Shoulder Taps"
    instructionCue: 'Stå i hög plankposition. Lyft en hand och nudda motsatt axel. Håll höfterna stilla. Byt sida.'
  },
  {
    name: 'Push-up till Down Dog', // For "Push-up till Down Dog"
    instructionCue: 'Gör en armhävning. Från toppen av armhävningen, skjut höften upp och bakåt till en nedåtgående hund. Tillbaka till planka.'
  },
  { name: 'Planka med Knäindrag', instructionCue: 'Stå i hög plankposition. Dra ett knä mot bröstet, byt sida. Håll höfterna stilla och bålen spänd.' },
  { name: 'Liggande Benlyft', instructionCue: 'Ligg på rygg, benen raka. Lyft benen mot taket utan att svanka. Sänk långsamt.' },
  { name: 'Plank Jacks', instructionCue: 'Starta i hög plankposition. Hoppa ut med fötterna brett isär och sedan tillbaka ihop, likt ett sprattelben i plankposition. Håll bålen spänd och undvik att höften åker upp för mycket.' }
];

// Helper function to get instruction cue
const getKbCue = (name: string) => KB_EXERCISES_LIST.find(ex => ex.name === name)?.instructionCue || '';
const getBwCue = (name: string) => {
    // Mapping common names to the BW_EXERCISES_LIST keys
    const nameMap: { [key: string]: string } = {
        "Air Squats": "Knäböj (kroppsvikt)",
        "Push-ups": "Armhävningar",
        "Lunges": "Utfallsteg (alternerande)",
        "Alternating Lunges": "Utfallsteg (alternerande)",
        "High Knees": "Höga Knän",
        "Glute Bridge": "Glute Bridges",
        "Liggande Arm- och Benlyft": "Superman", // Assuming "Superman" is the intended exercise
        "Superman Hold": "Superman" 
    };
    const mappedName = nameMap[name] || name;
    return BW_EXERCISES_LIST.find(ex => ex.name === mappedName)?.instructionCue || KB_EXERCISES_LIST.find(ex => ex.name === mappedName)?.instructionCue || '';
}


// --- LEVEL DEFINITIONS ---
export const LEVEL_DEFINITIONS: Level[] = [
  { name: "Nybörjare", minWorkouts: 0, description: "0-4 pass." },
  { name: "Aktiv Startare", minWorkouts: 5, description: "5-9 pass." },
  { name: "Regelbunden Motionär", minWorkouts: 10, description: "10-14 pass." },
  { name: "Engagerad Entusiast", minWorkouts: 15, description: "15-19 pass." },
  { name: "Hängiven Kämpe", minWorkouts: 20, description: "20-24 pass." },
  { name: "HälsoProffs", minWorkouts: 25, description: "25-29 pass." },
  { name: "Träningsmästare", minWorkouts: 30, description: "30+ pass. Grymt jobbat!" }
];

export const WALKING_CHALLENGE_TOTAL_DAYS = 30;
export const WALKING_CHALLENGE_DAILY_MINUTES = 30;

export const WALKING_LEVEL_DEFINITIONS: Level[] = [
  { name: "Första steget", minDays: 0, description: "0-2 dagar." },
  { name: "Upptäckare", minDays: 3, description: "3-4 dagar." },
  { name: "Gångare", minDays: 5, description: "5-9 dagar." },
  { name: "Vandrare", minDays: 10, description: "10-14 dagar." },
  { name: "Stigfinnare", minDays: 15, description: "15-19 dagar." },
  { name: "Terränglöpare", minDays: 20, description: "20-24 dagar." },
  { name: "Milslukare", minDays: 25, description: "25-29 dagar." },
  { name: "Promenadmästare", minDays: 30, description: "30+ dagar. Fantastiskt!" }
];

// --- WORKOUT DEFINITIONS ---
const baseWarmupsAndBWChallenges: Workout[] = [
    {
      id: 'warmup-dynamic-001',
      title: "Dynamisk Start (5 min)",
      shortTitle: "Uppvärmning 5min",
      type: 'bodyweight',
      format: WorkoutFormat.CLASSIC_ROUNDS, // Will be one round
      totalEstimatedTimeMinutes: 5,
      detailedDescription: "En enkel och effektiv dynamisk uppvärmning för att förbereda kroppen inför dagens utmaning. Fokus på att öka rörlighet och få igång pulsen lätt.",
      exerciseSummaryList: [
        { name: "Marsch på stället", details: "45s" },
        { name: "Armcirklar", details: "45s" },
        { name: "Höga Knän (lätt)", details: "45s" },
        { name: "Knäböj (kroppsvikt)", details: "45s" },
        { name: "Jumping Jacks (lätt)", details: "45s" },
        { name: "Katt-Ko", details: "45s" },
      ],
      timedSegments: [
        PREPARE_SEGMENT,
        { name: "Marsch på stället", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Marsch på stället"), exercises: [{ name: "Marsch på stället" }], currentRound: 1, totalRounds: 1 },
        { name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 5, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: 1, totalRounds: 1 },
        { name: "Armcirklar", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Armcirklar"), exercises: [{ name: "Armcirklar" }], currentRound: 1, totalRounds: 1 },
        { name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 5, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: 1, totalRounds: 1 },
        { name: "Höga Knän (lätt)", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Höga Knän"), exercises: [{ name: "Höga Knän" }], currentRound: 1, totalRounds: 1 },
        { name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 5, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: 1, totalRounds: 1 },
        { name: "Knäböj (kroppsvikt)", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Knäböj (kroppsvikt)"), exercises: [{ name: "Knäböj (kroppsvikt)" }], currentRound: 1, totalRounds: 1 },
        { name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 5, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: 1, totalRounds: 1 },
        { name: "Jumping Jacks (lätt)", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Jumping Jacks"), exercises: [{ name: "Jumping Jacks" }], currentRound: 1, totalRounds: 1 },
        { name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 5, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: 1, totalRounds: 1 },
        { name: "Katt-Ko", type: ExercisePhaseType.WORK, durationSeconds: 45, instructions: getBwCue("Katt-Ko"), exercises: [{ name: "Katt-Ko" }], currentRound: 1, totalRounds: 1 },
      ],
      difficultyLevel: 'Nybörjare',
      tags: ['uppvärmning', 'dynamisk', 'helkropp', 'rörlighet'],
    }
];
const existingWarmupsAndBW: Workout[] = baseWarmupsAndBWChallenges.filter(w => w.id.startsWith('warmup-'));


const userKettlebellWorkouts: Workout[] = [
  // KB001: Sving i Solnedgång (EMOM 15 min)
  {
    id: "kb001",
    title: "Sving i Solnedgång",
    shortTitle: "KB EMOM Solnedg.",
    type: "kettlebell",
    format: WorkoutFormat.EMOM,
    detailedDescription: "Ett effektivt 15-minuters EMOM-pass där du jobbar varje minut med en ny övning. Fokuserar på hela kroppen med betoning på höft, ben och axlar. Utför angivet arbete och vila resten av minuten.",
    exerciseSummaryList: [
      { name: "Kettlebell Swings", details: "Min 1, 7, 13: Max reps 45s" }, 
      { name: "Goblet Squats", details: "Min 2, 8, 14: 10-12 reps" },
      { name: "Goblet Thrusters", details: "Min 3, 9, 15: 8-10 reps" },
      { name: "Kettlebell Rows", details: "Min 4, 10: 8-10 reps/sida" },
      { name: "Situps", details: "Min 5, 11: Max reps 45s" },
      { name: "Kettlebell Push Press", details: "Min 6, 12: 6-8 reps/sida" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      ...Array.from({ length: 15 }, (_, i) => {
        const minute = i + 1;
        let exerciseName = '';
        let segmentInstructionText = '';
        let exerciseWork: { reps?: string; durationSeconds?: number } = {};
        let cue = '';
        const cycleIndex = i % 6; 

        switch (cycleIndex) {
          case 0: 
            exerciseName = 'Kettlebell Swings'; 
            segmentInstructionText = `Minutens uppgift: Max reps Kettlebell Swings på 45 sekunder. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { durationSeconds: 45 }; // Implies max reps within this time
            cue = getKbCue(exerciseName); 
            break;
          case 1: 
            exerciseName = 'Goblet Squats'; 
            segmentInstructionText = `Minutens uppgift: 10-12 Goblet Squats. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { reps: '10-12' };
            cue = getKbCue(exerciseName); 
            break;
          case 2: 
            exerciseName = 'Goblet Thrusters'; 
            segmentInstructionText = `Minutens uppgift: 8-10 Goblet Thrusters. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { reps: '8-10' };
            cue = getKbCue(exerciseName); 
            break;
          case 3: 
            exerciseName = 'Kettlebell Rows'; 
            segmentInstructionText = `Minutens uppgift: 8-10 Kettlebell Rows per sida. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { reps: '8-10/sida' };
            cue = getKbCue(exerciseName); 
            break;
          case 4: 
            exerciseName = 'Situps'; 
            segmentInstructionText = `Minutens uppgift: Max reps Situps på 45 sekunder. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { durationSeconds: 45 }; // Implies max reps
            cue = getKbCue(exerciseName); 
            break; 
          case 5: 
            exerciseName = 'Kettlebell Push Press'; 
            segmentInstructionText = `Minutens uppgift: 6-8 Kettlebell Push Press per sida. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim(); 
            exerciseWork = { reps: '6-8/sida' };
            cue = getKbCue(exerciseName); 
            break;
        }
        return {
          name: `Minut ${minute}: ${exerciseName}`,
          type: ExercisePhaseType.WORK,
          durationSeconds: 60, // EMOM minute is always 60s
          instructions: segmentInstructionText, // Overall instruction for the minute
          exercises: [{ name: exerciseName, ...exerciseWork, instructions: cue }], // Specific work for the exercise
          currentRound: minute,
          totalRounds: 15,
        };
      })
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'helkropp', 'emom', 'kondition'],
  },
  // KB002: AMRAP under Palmen (AMRAP 15 min)
  {
    id: "kb002",
    title: "AMRAP under Palmen",
    shortTitle: "KB AMRAP Palmen",
    type: "kettlebell",
    format: WorkoutFormat.AMRAP,
    detailedDescription: "Jobba på i egen takt i 15 minuter – så många varv som möjligt. Övningarna aktiverar hela kroppen. Notera hur många varv du hinner.",
    exerciseSummaryList: [
      { name: "Goblet Squats", details: "10 reps" },
      { name: "Kettlebell Floor Press", details: "8 reps" },
      { name: "Kettlebell Rows", details: "6 reps/sida" },
      { name: "Situps", details: "10 reps" },
      { name: "Kettlebell Push Press", details: "8 reps/sida" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "AMRAP Cirkel",
        type: ExercisePhaseType.WORK,
        durationSeconds: 15 * 60,
        instructions: `Så många varv som möjligt (AMRAP) på 15 minuter av: (Vila vid behov. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Goblet Squats", reps: "10", instructions: getKbCue("Goblet Squats") },
          { name: "Kettlebell Floor Press", reps: "8", instructions: getKbCue("Kettlebell Floor Press") },
          { name: "Kettlebell Rows", reps: "6/sida", instructions: getKbCue("Kettlebell Rows") },
          { name: "Situps", reps: "10", instructions: getKbCue("Situps") },
          { name: "Kettlebell Push Press", reps: "8/sida", instructions: getKbCue("Kettlebell Push Press") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'helkropp', 'amrap', 'styrka'],
  },
  // KB003: Heatwave Hustle (Time Cap 15 min)
  {
    id: "kb003",
    title: "Heatwave Hustle",
    shortTitle: "KB TimeCap Heat",
    type: "kettlebell",
    format: WorkoutFormat.TIME_CAP,
    detailedDescription: "Du har 15 minuter på dig att klara 4 varv av detta flåsiga helkroppsupplägg. Tävla mot klockan eller mot dig själv!",
    exerciseSummaryList: [
      { name: "Kettlebell Swings", details: "12 reps" }, 
      { name: "Goblet Squats", details: "10 reps" },
      { name: "Kettlebell Rows", details: "8 reps/sida" },
      { name: "Goblet Thrusters", details: "6 reps/sida" }, 
      { name: "Burpees", details: "4 reps" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: 4 Varv Så Snabbt Som Möjligt", 
        type: ExercisePhaseType.WORK,
        durationSeconds: 0, 
        instructions: `Slutför 4 varv av nedanstående övningar SÅ SNABBT SOM MÖJLIGT. Max tid: 15 minuter. (Vila smart. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Kettlebell Swings", reps: "12", instructions: getKbCue("Kettlebell Swings") },
          { name: "Goblet Squats", reps: "10", instructions: getKbCue("Goblet Squats") },
          { name: "Kettlebell Rows", reps: "8/sida", instructions: getKbCue("Kettlebell Rows") },
          { name: "Goblet Thrusters", reps: "6/sida", instructions: getKbCue("Goblet Thrusters") }, 
          { name: "Burpees", reps: "4", instructions: getKbCue("Burpees") }
        ]
      }
    ],
    difficultyLevel: 'Avancerad',
    tags: ['kettlebell', 'helkropp', 'timecap', 'kondition', 'utmaning'],
  },
  // KB004: Kokosintervaller (30/15 Intervals, 2 varv, 15 min)
  {
    id: "kb004",
    title: "Kokosintervaller",
    shortTitle: "KB Int. Kokos",
    type: "kettlebell",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "Ett blockbaserat 30/15-pass med 2 varv av 10 övningar. Jobba 30 sek, vila 15 sek. Ett svettigt, lätt-coachat upplägg som passar alla nivåer.",
    exerciseSummaryList: [
      { name: "Goblet Squats", details: "30s arbete / 15s vila" },
      { name: "Kettlebell Swings", details: "30s arbete / 15s vila" }, 
      { name: "Kettlebell Split Stance RDL", details: "30s/sida / 15s vila" },
      { name: "Kettlebell Floor Press", details: "30s arbete / 15s vila" },
      { name: "Kettlebell Push Press", details: "30s arbete / 15s vila" },
      { name: "Situps", details: "30s arbete / 15s vila" },
      { name: "Plank with Arm Lift", details: "30s arbete / 15s vila" },
      { name: "KB Suitcase Deadlift", details: "30s/sida / 15s vila" },
    ],
    totalEstimatedTimeMinutes: 15, 
    roundsText: "2 varv",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[1, 2].flatMap(round => 
        [
          { name: "Goblet Squats", cue: getKbCue("Goblet Squats") },
          { name: "Kettlebell Swings", cue: getKbCue("Kettlebell Swings") },
          { name: "Kettlebell Split Stance RDL (vänster)", cue: getKbCue("Kettlebell Split Stance RDL") },
          { name: "Kettlebell Split Stance RDL (höger)", cue: getKbCue("Kettlebell Split Stance RDL") },
          { name: "Kettlebell Floor Press", cue: getKbCue("Kettlebell Floor Press") },
          { name: "Kettlebell Push Press", cue: getKbCue("Kettlebell Push Press") }, 
          { name: "Situps", cue: getKbCue("Situps") },
          { name: "Plank with Arm Lift", cue: getBwCue("Plank with Arm Lift") },
          { name: "KB Suitcase Deadlift (vänster)", cue: getKbCue("KB Suitcase Deadlift") },
          { name: "KB Suitcase Deadlift (höger)", cue: getKbCue("KB Suitcase Deadlift") },
        ].flatMap((ex, index, arr) => {
          const segments: TimedSegment[] = [];
          segments.push({ name: ex.name, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: `Arbete: 30 sekunder`, exercises: [{ name: ex.name, instructions: ex.cue }], currentRound: round, totalRounds: 2 });
          if (!(index === arr.length - 1 && round === 2)) { 
            segments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 15, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: round, totalRounds: 2 });
          }
          return segments;
        })
      )
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'intervaller', 'helkropp', 'kondition'],
  },
  // KB005: Solstegs-Stegen (Ladder/AMRAP 15 min)
  {
    id: "kb005",
    title: "Solstegs-Stegen",
    shortTitle: "KB Stege Sol",
    type: "kettlebell",
    format: WorkoutFormat.AMRAP,
    detailedDescription: "En stege med 5 reps som startpunkt där du ökar med 1 rep varje varv för varje övning. Hinner du upp till 10 reps av varje innan tiden (15 min) är slut? Notera ditt resultat!",
    exerciseSummaryList: [
      { name: "Goblet Squats", details: "Stege: Start 5, öka +1/varv" },
      { name: "Kettlebell Swings", details: "Stege: Start 5, öka +1/varv" }, 
      { name: "Kettlebell Rows", details: "Stege: Start 5/sida, öka +1/varv" },
      { name: "Situps", details: "Stege: Start 5, öka +1/varv" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Reps-stege (AMRAP 15 min)",
        type: ExercisePhaseType.WORK,
        durationSeconds: 15 * 60,
        instructions: `Börja med 5 reps av varje. Öka +1 rep per varv för varje övning. Kör så många varv som möjligt (AMRAP) på 15 min. (Vila vid behov. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Goblet Squats", instructions: getKbCue("Goblet Squats") },
          { name: "Kettlebell Swings", instructions: getKbCue("Kettlebell Swings") },
          { name: "Kettlebell Rows", instructions: getKbCue("Kettlebell Rows") + " (lika många reps per sida)" },
          { name: "Situps", instructions: getKbCue("Situps") }
        ]
      }
    ],
    difficultyLevel: 'Medel-Avancerad',
    tags: ['kettlebell', 'stege', 'amrap', 'helkropp', 'styrka'],
  },
  // KB006: Beach Burnout (Pyramid/Time Cap 15 min)
  {
    id: "kb006",
    title: "Beach Burnout",
    shortTitle: "KB Pyramid Burn",
    type: "kettlebell",
    format: WorkoutFormat.TIME_CAP, 
    detailedDescription: "En rep-pyramid: gör först 5 reps av VARJE övning i listan, sedan 10 reps av VARJE övning, sedan 15, sedan ner till 10 reps av VARJE, och slutligen 5 reps av VARJE. Fokuserar på bröst, ben och bål. Målet är att slutföra hela pyramiden så snabbt som möjligt inom tidsgränsen på 15 minuter. Vila smart!",
    exerciseSummaryList: [
      { name: "Kettlebell Swings", details: "Pyramid: 5-10-15-10-5 reps" }, 
      { name: "Goblet Squats", details: "Pyramid: 5-10-15-10-5 reps" },
      { name: "Situps", details: "Pyramid: 5-10-15-10-5 reps" }
    ],
    totalEstimatedTimeMinutes: 15, 
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: Pyramid 5-10-15-10-5",
        type: ExercisePhaseType.WORK,
        durationSeconds: 0, 
        instructions: `Pyramid: 5-10-15-10-5 reps av varje övning. Kör SÅ SNABBT SOM MÖJLIGT! Max tid 15 min.`,
        exercises: [ 
          { name: "Kettlebell Swings", instructions: getKbCue("Kettlebell Swings") },
          { name: "Goblet Squats", instructions: getKbCue("Goblet Squats") },
          { name: "Situps", instructions: getKbCue("Situps") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'pyramid', 'timecap', 'helkropp'],
  },
  // KB007: Svalkande Svettfest (E2MOM 12 min)
  {
    id: "kb007",
    title: "Svalkande Svettfest",
    shortTitle: "KB E2MOM Svalk",
    type: "kettlebell",
    format: WorkoutFormat.CLASSIC_ROUNDS, // E2MOM is best represented as Classic Rounds here for segment timing
    detailedDescription: "Varje 2-minutersblock innehåller 3 övningar. Utför alla repetitioner och vila resten av blocket. 6 block totalt (12 minuter).",
    exerciseSummaryList: [
      { name: "Goblet Squats", details: "8 reps" },
      { name: "Kettlebell Swings", details: "8 reps" }, 
      { name: "Kettlebell Push Press", details: "6 reps/sida" }
    ],
    totalEstimatedTimeMinutes: 12,
    roundsText: "6 block (varje 2 min)", // Describes the E2MOM structure
    timedSegments: [
      PREPARE_SEGMENT,
      ...Array(6).fill(null).flatMap((_, roundIndex) => ([
        {
          name: `Block ${roundIndex + 1}/6: Arbete`,
          type: ExercisePhaseType.WORK,
          durationSeconds: 120, // Each block is 2 minutes
          instructions: `Gör 8 Goblet Squats, 8 KB Swings, 6 Push Press/sida. Vila resten av de 2 minutrarna. ${BREATHING_CUE_REST}`.trim(),
          exercises: [ 
            { name: "Goblet Squats", reps: "8", instructions: getKbCue("Goblet Squats") },
            { name: "Kettlebell Swings", reps: "8", instructions: getKbCue("Kettlebell Swings") },
            { name: "Kettlebell Push Press", reps: "6/sida", instructions: getKbCue("Kettlebell Push Press") }
          ],
          currentRound: roundIndex + 1, // Represents the E2MOM block number
          totalRounds: 6
        }
      ]))
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'e2mom', 'intervaller', 'helkropp'],
  },
  // KB008: Palm Power Circuit (Circuit/Time Cap 15 min)
  {
    id: "kb008",
    title: "Palm Power Circuit",
    shortTitle: "KB Circuit Palm",
    type: "kettlebell",
    format: WorkoutFormat.TIME_CAP, 
    detailedDescription: "Ett 3-varvs circuitpass som blandar styrka och puls. Inkluderar både unilateral och coreträning. Försök slutföra så snabbt som möjligt inom 15 minuter.",
    exerciseSummaryList: [
      { name: "KB Suitcase Deadlift", details: "10 reps/sida" },
      { name: "Kettlebell Floor Press", details: "10 reps" },
      { name: "Goblet Squats", details: "10 reps" },
      { name: "Mountain Climbers", details: "20 reps totalt" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: 3 Varv Så Snabbt Som Möjligt",
        type: ExercisePhaseType.WORK,
        durationSeconds: 0,
        instructions: `Slutför 3 varv av följande övningar SÅ SNABBT SOM MÖJLIGT. Max tid: 15 minuter. (Vila smart. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "KB Suitcase Deadlift", reps: "10/sida", instructions: getKbCue("KB Suitcase Deadlift") },
          { name: "Kettlebell Floor Press", reps: "10", instructions: getKbCue("Kettlebell Floor Press") },
          { name: "Goblet Squats", reps: "10", instructions: getKbCue("Goblet Squats") },
          { name: "Mountain Climbers", reps: "20 totalt", instructions: getBwCue("Mountain Climbers") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kettlebell', 'circuit', 'timecap', 'styrka', 'core'],
  },
  // KB009: Tropisk Tabata (TABATA - Adjusted to 19 min)
  {
    id: "kb009",
    title: "Tropisk Tabata",
    shortTitle: "KB Tabata Tropisk",
    type: "kettlebell",
    format: WorkoutFormat.CLASSIC_ROUNDS, 
    detailedDescription: "Fyra 4-minuters tabatablock (20 sek arbete / 10 sek vila) med olika fokus, med 1 minuts vila mellan varje block. Varje block är en övning som upprepas 8 gånger. Totalt 19 minuter.",
    exerciseSummaryList: [
      { name: "Kettlebell Overhead Swings", details: "Tabata (8x 20s/10s)" }, 
      { name: "Goblet Squats", details: "Tabata (8x 20s/10s)" },
      { name: "Situps", details: "Tabata (8x 20s/10s)" },
      { name: "Kettlebell Push Press", details: "Tabata (8x 20s/10s, växelvis)" }
    ],
    totalEstimatedTimeMinutes: 19, 
    roundsText: "4 Tabata-block med vila",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[
        { exercise: "Kettlebell Overhead Swings", blockName: "Tabata 1 – KB Overhead Swings" }, 
        { exercise: "Goblet Squats", blockName: "Tabata 2 – Goblet Squats" },
        { exercise: "Situps", blockName: "Tabata 3 – Situps" },
        { exercise: "Kettlebell Push Press", blockName: "Tabata 4 – Push Press" }
      ].flatMap((block, blockIndex, allBlocks) => {
        const blockSegments: TimedSegment[] = [];
        for (let i = 0; i < 8; i++) {
          blockSegments.push({ name: block.exercise, type: ExercisePhaseType.WORK, durationSeconds: 20, instructions: "Arbete: 20 sekunder", exercises: [{ name: block.exercise, instructions: getKbCue(block.exercise) }], currentRound: i + 1, totalRounds: 8 });
           if (i < 7 || (blockIndex < allBlocks.length -1)) { 
             blockSegments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 10, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: i + 1, totalRounds: 8 });
          }
        }
        if (blockIndex < allBlocks.length - 1) { 
          blockSegments.push({ name: "Blockvila", type: ExercisePhaseType.REST, durationSeconds: 60, instructions: `1 min vila. ${BREATHING_CUE_REST}`.trim() });
        }
        return blockSegments;
      })
    ],
    difficultyLevel: 'Avancerad',
    tags: ['kettlebell', 'tabata', 'intervaller', 'högintensiv', 'kondition'],
  },
  // KB010: Sandstrand Superset (Superset/Intervals - Adjusted to ~14 min)
  {
    id: "kb010",
    title: "Sandstrand Superset",
    shortTitle: "KB Superset Sand",
    type: "kettlebell",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "Arbeta i 4 superset där varje par körs 3 gånger med 30 sek arbete per övning och 10 sek vila endast efter båda övningarna i paret. Totalt ca 14 minuter.",
    exerciseSummaryList: [
      { name: "Superset 1: Goblet Squats + Plankan", details: "3 varv (30s/övning, 10s vila)" },
      { name: "Superset 2: Kettlebell RDL + Situps", details: "3 varv (30s/övning, 10s vila)" },
      { name: "Superset 3: Kettlebell Swings + Mountain Climbers", details: "3 varv (30s/övning, 10s vila)" }, 
      { name: "Superset 4: Kettlebell Floor Press + KB Suitcase Deadlift", details: "3 varv (30s/övning, 10s vila)" }
    ],
    totalEstimatedTimeMinutes: 14, 
    roundsText: "4 Superset (3 varv/superset)",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[
        { pair: [{name: "Goblet Squats", cue: getKbCue("Goblet Squats")}, {name: "Plankan", cue: getBwCue("Plankan")}], supersetName: "Superset 1"},
        { pair: [{name: "Kettlebell RDL", cue: getKbCue("Kettlebell RDL")}, {name: "Situps", cue: getKbCue("Situps")}], supersetName: "Superset 2"},
        { pair: [{name: "Kettlebell Swings", cue: getKbCue("Kettlebell Swings")}, {name: "Mountain Climbers", cue: getBwCue("Mountain Climbers")}], supersetName: "Superset 3"},
        { pair: [{name: "Kettlebell Floor Press", cue: getKbCue("Kettlebell Floor Press")}, {name: "KB Suitcase Deadlift", cue: getKbCue("KB Suitcase Deadlift") + " (byt sida halvvägs)"}], supersetName: "Superset 4"}
      ].flatMap((superset, supersetIndex, allSupersets) => {
        const supersetSegments: TimedSegment[] = [];
        for (let round = 1; round <= 3; round++) {
          supersetSegments.push({ name: superset.pair[0].name, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: "Arbete: 30 sekunder", exercises: [{name: superset.pair[0].name, instructions: superset.pair[0].cue}], currentRound:round, totalRounds:3 });
          supersetSegments.push({ name: superset.pair[1].name, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: "Arbete: 30 sekunder", exercises: [{name: superset.pair[1].name, instructions: superset.pair[1].cue}], currentRound:round, totalRounds:3 });
          if (!(round === 3 && supersetIndex === allSupersets.length - 1)) { 
            supersetSegments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 10, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound:round, totalRounds:3 });
          }
        }
        if (supersetIndex < allSupersets.length - 1) {
          supersetSegments.push({ name: "Vila mellan superset", type: ExercisePhaseType.REST, durationSeconds: 10, instructions: `Vila. ${BREATHING_CUE_REST}`.trim() }); 
        }
        return supersetSegments;
      })
    ],
    difficultyLevel: 'Medel-Avancerad',
    tags: ['kettlebell', 'superset', 'intervaller', 'helkropp', 'styrka', 'kondition'],
  }
];

const userBodyweightWorkouts: Workout[] = [
  // BW001: Soluppgångs-EMOM (15 min) - UPDATED
  {
    id: "bw001",
    title: "Soluppgångs-EMOM",
    shortTitle: "BW EMOM Soluppg.",
    type: "bodyweight",
    format: WorkoutFormat.EMOM,
    detailedDescription: "Ett kroppsvikts-EMOM på 15 minuter. Utför angivet antal repetitioner för övningen varje minut och vila resterande tid av minuten. Både styrka och puls i ett soligt format.",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "Min 1: 15-20 reps" },
      { name: "Armhävningar", details: "Min 2: 10-15 reps" },
      { name: "Mountain Climbers", details: "Min 3: 30-40 reps (totalt)" },
      { name: "Situps", details: "Min 4: 15-20 reps" },
      { name: "Superman", details: "Min 5: 12-15 reps" },
      { name: "Plankan med Touch", details: "Min 6: 16-20 reps (totalt)" },
      { name: "Jumping Jacks", details: "Min 7: 30-40 reps" },
      { name: "Utfallsteg (alternerande)", details: "Min 8: 16-20 reps (totalt)" },
      { name: "Shoulder Taps", details: "Min 9: 20-30 reps (totalt)" },
      { name: "Glute Bridges", details: "Min 10: 15-20 reps" },
      { name: "Squat Jumps", details: "Min 11: 10-12 reps" },
      { name: "Plank Jacks", details: "Min 12: 20-25 reps" },
      { name: "Push-up till Down Dog", details: "Min 13: 6-10 reps" },
      { name: "Höga Knän", details: "Min 14: 40-50 reps (totalt)" },
      { name: "Side Plank (Höftlyft)", details: "Min 15: 10-12 reps (vänster sida)" } 
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      ...[
        { exName: "Knäböj (kroppsvikt)", reps: "15-20" }, 
        { exName: "Armhävningar", reps: "10-15" }, 
        { exName: "Mountain Climbers", reps: "30-40 (totalt)" }, 
        { exName: "Situps", reps: "15-20" }, 
        { exName: "Superman", reps: "12-15" },
        { exName: "Plankan med Touch", reps: "16-20 (totalt)" }, 
        { exName: "Jumping Jacks", reps: "30-40" }, 
        { exName: "Utfallsteg (alternerande)", reps: "16-20 (totalt)", displayName: "Utfall (växelvis)" },
        { exName: "Shoulder Taps", reps: "20-30 (totalt)" },
        { exName: "Glute Bridges", reps: "15-20" }, 
        { exName: "Squat Jumps", reps: "10-12" }, 
        { exName: "Plank Jacks", reps: "20-25" }, 
        { exName: "Push-up till Down Dog", reps: "6-10" }, 
        { exName: "Höga Knän", reps: "40-50 (totalt)" }, 
        { exName: "Side Plank (Höftlyft)", reps: "10-12", displayName: "Side Plank Höftlyft (vänster)" }
      ].map((exerciseInfo, i) => {
        const actualExName = exerciseInfo.exName;
        const displayExName = exerciseInfo.displayName || actualExName;
        const segmentInstructionText = `Minutens uppgift: ${exerciseInfo.reps} ${displayExName}. Vila resten av minuten. ${BREATHING_CUE_REST}`.trim();
        
        return {
          name: `Minut ${i + 1}: ${displayExName}`,
          type: ExercisePhaseType.WORK,
          durationSeconds: 60, // EMOM minute is always 60s
          instructions: segmentInstructionText,
          exercises: [{ name: displayExName, reps: exerciseInfo.reps, instructions: getBwCue(actualExName) }],
          currentRound: i + 1,
          totalRounds: 15,
        }
      })
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'emom', 'helkropp', 'kondition', 'styrka'],
  },
  // BW002: Svettdroppar i Sanden (AMRAP 15 min)
  {
    id: "bw002",
    title: "Svettdroppar i Sanden",
    shortTitle: "BW AMRAP Sanden",
    type: "bodyweight",
    format: WorkoutFormat.AMRAP,
    detailedDescription: "Så många varv du kan på 15 minuter. Ett flåsigt pass med fullkroppsinriktning och funktionella övningar. Sätt ett personligt rekord!",
    exerciseSummaryList: [
      { name: "Jumping Jacks", details: "20 reps" },
      { name: "Knäböj (kroppsvikt)", details: "10 reps" },
      { name: "Situps", details: "10 reps" },
      { name: "Utfallsteg (alternerande)", details: "10 reps (5/ben)" },
      { name: "Armhävningar", details: "10 reps" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "AMRAP Cirkel",
        type: ExercisePhaseType.WORK,
        durationSeconds: 15 * 60,
        instructions: `Så många varv som möjligt (AMRAP) på 15 minuter av: (Vila vid behov. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Jumping Jacks", reps: "20", instructions: getBwCue("Jumping Jacks") },
          { name: "Knäböj (kroppsvikt)", reps: "10", instructions: getBwCue("Knäböj (kroppsvikt)") },
          { name: "Situps", reps: "10", instructions: getBwCue("Situps") },
          { name: "Utfallsteg (alternerande)", reps: "10 (5/ben)", instructions: getBwCue("Utfallsteg (alternerande)") },
          { name: "Armhävningar", reps: "10", instructions: getBwCue("Armhävningar") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'amrap', 'helkropp', 'kondition'],
  },
  // BW003: Heta Hopp & Hållning (Time Cap 15 min)
  {
    id: "bw003",
    title: "Heta Hopp & Hållning",
    shortTitle: "BW TimeCap Hopp",
    type: "bodyweight",
    format: WorkoutFormat.TIME_CAP,
    detailedDescription: "Klara 3 varv av detta helkroppspass så snabbt som möjligt, inom 15 minuter. Perfekt kombination av statisk core, ben och puls.",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "15 reps" },
      { name: "Mountain Climbers", details: "20 reps (totalt)" },
      { name: "Armhävningar", details: "10 reps" },
      { name: "Situps", details: "20 reps" },
      { name: "Plankan", details: "30 sek" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: 3 Varv Så Snabbt Som Möjligt",
        type: ExercisePhaseType.WORK,
        durationSeconds: 0, 
        instructions: `Slutför 3 varv av nedanstående övningar SÅ SNABBT SOM MÖJLIGT. Max tid: 15 minuter. (Vila smart. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Knäböj (kroppsvikt)", reps: "15", instructions: getBwCue("Knäböj (kroppsvikt)") },
          { name: "Mountain Climbers", reps: "20 (totalt)", instructions: getBwCue("Mountain Climbers") },
          { name: "Armhävningar", reps: "10", instructions: getBwCue("Armhävningar") },
          { name: "Situps", reps: "20", instructions: getBwCue("Situps") },
          { name: "Plankan", durationSeconds: 30, instructions: getBwCue("Plankan") } 
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'timecap', 'helkropp', 'core', 'kondition'],
  },
  // BW004: Strandstegen (Ladder/AMRAP 15 min)
  {
    id: "bw004",
    title: "Strandstegen",
    shortTitle: "BW Stege Strand",
    type: "bodyweight",
    format: WorkoutFormat.AMRAP,
    detailedDescription: "Repsstege där du börjar med 5 reps och ökar med 1 per varv för varje övning. Testa hur högt du kommer innan tiden (15 min) tar slut! Notera ditt resultat!",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "Stege: Start 5, öka +1/varv" },
      { name: "Armhävningar", details: "Stege: Start 5, öka +1/varv" },
      { name: "Situps", details: "Stege: Start 5, öka +1/varv" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Reps-stege (AMRAP 15 min)",
        type: ExercisePhaseType.WORK,
        durationSeconds: 15 * 60,
        instructions: `Börja med 5 reps av varje övning. Öka +1 rep per varv för varje övning. Kör så många varv som möjligt (AMRAP) på 15 min. (Vila vid behov. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Knäböj (kroppsvikt)", instructions: getBwCue("Knäböj (kroppsvikt)") },
          { name: "Armhävningar", instructions: getBwCue("Armhävningar") },
          { name: "Situps", instructions: getBwCue("Situps") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'stege', 'amrap', 'helkropp', 'styrka'],
  },
  // BW005: Pyramid på Bryggan (Pyramid/Time Cap 15 min)
  {
    id: "bw005",
    title: "Pyramid på Bryggan",
    shortTitle: "BW Pyramid Brygga",
    type: "bodyweight",
    format: WorkoutFormat.TIME_CAP, 
    detailedDescription: "En rep-pyramid: gör först 5 reps av VARJE övning, sedan 10 reps av VARJE, sedan 15, sedan ner till 10 reps av VARJE, och slutligen 5 reps av VARJE. Enkelt men svettigt – och perfekt utmaning för både nybörjare och erfarna. Målet är att slutföra hela pyramiden så snabbt som möjligt inom tidsgränsen på 15 minuter.",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "Pyramid: 5-10-15-10-5 reps" },
      { name: "Armhävningar", details: "Pyramid: 5-10-15-10-5 reps" },
      { name: "Situps", details: "Pyramid: 5-10-15-10-5 reps" }
    ],
    totalEstimatedTimeMinutes: 15, 
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: Pyramid 5-10-15-10-5",
        type: ExercisePhaseType.WORK,
        durationSeconds: 0, 
        instructions: `Pyramid: 5-10-15-10-5 reps av varje övning. Kör SÅ SNABBT SOM MÖJLIGT! Max tid 15 min.`,
        exercises: [ 
          { name: "Knäböj (kroppsvikt)", instructions: getBwCue("Knäböj (kroppsvikt)") },
          { name: "Armhävningar", instructions: getBwCue("Armhävningar") },
          { name: "Situps", instructions: getBwCue("Situps") }
        ]
      }
    ],
    difficultyLevel: 'Nybörjare-Medel',
    tags: ['kroppsvikt', 'pyramid', 'timecap', 'helkropp'],
  },
  // BW006: Dopp i Plankan (30/15 Intervals, 2 varv, 15 min)
  {
    id: "bw006",
    title: "Dopp i Plankan",
    shortTitle: "BW Int. Plankan",
    type: "bodyweight",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "En klassisk 30/15-intervall med 2 varv av 10 övningar. Jobba i 30 sekunder, vila 15. Fokuserar på bål, ben och axelstabilitet.",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "30s arbete / 15s vila" },
      { name: "Mountain Climbers", details: "30s arbete / 15s vila" },
      { name: "Planka med Knäindrag", details: "30s arbete / 15s vila" },
      { name: "Armhävningar", details: "30s arbete / 15s vila" },
      { name: "Liggande Benlyft", details: "30s arbete / 15s vila" },
      { name: "Glute Bridges", details: "30s arbete / 15s vila" },
      { name: "Situps", details: "30s arbete / 15s vila" },
      { name: "Plankan", details: "30s arbete / 15s vila" },
      { name: "Höga Knän", details: "30s arbete / 15s vila" },
      { name: "Superman", details: "30s arbete / 15s vila" }
    ],
    totalEstimatedTimeMinutes: 15, 
    roundsText: "2 varv",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[1, 2].flatMap(round => 
        [
          "Knäböj (kroppsvikt)", "Mountain Climbers", "Planka med Knäindrag", "Armhävningar", "Liggande Benlyft",
          "Glute Bridges", "Situps", "Plankan", "Höga Knän", "Superman"
        ].flatMap((exName, index, arr) => {
          const segments: TimedSegment[] = [];
          segments.push({ name: exName, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: "Arbete: 30 sekunder", exercises: [{ name: exName, instructions: getBwCue(exName) }], currentRound: round, totalRounds: 2 });
          if (!(index === arr.length - 1 && round === 2)) {
            segments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 15, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: round, totalRounds: 2 });
          }
          return segments;
        })
      )
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'intervaller', 'helkropp', 'bål'],
  },
  // BW007: Vågskvalp & Varv (Circuit/Time Cap 15 min)
  {
    id: "bw007",
    title: "Vågskvalp & Varv",
    shortTitle: "BW Circuit Våg",
    type: "bodyweight",
    format: WorkoutFormat.TIME_CAP,
    detailedDescription: "Tre varv av fem övningar som du gör i följd. Välj själv tempo – vila kort mellan övningarna och längre mellan varven. Svettig, enkel och effektiv cirkel! Försök klara på 15 minuter.",
    exerciseSummaryList: [
      { name: "Knäböj (kroppsvikt)", details: "15 reps" },
      { name: "Armhävningar", details: "10 reps" },
      { name: "Mountain Climbers", details: "20 reps (totalt)" },
      { name: "Situps", details: "20 reps" },
      { name: "Plankan", details: "30 sek" }
    ],
    totalEstimatedTimeMinutes: 15,
    timedSegments: [
      PREPARE_SEGMENT,
      {
        name: "Uppgift: 3 Varv Så Snabbt Som Möjligt",
        type: ExercisePhaseType.WORK,
        durationSeconds: 0,
        instructions: `Slutför 3 varv av nedanstående övningar SÅ SNABBT SOM MÖJLIGT. Max tid: 15 minuter. (Vila smart. ${BREATHING_CUE_REST})`.trim(),
        exercises: [
          { name: "Knäböj (kroppsvikt)", reps: "15", instructions: getBwCue("Knäböj (kroppsvikt)") },
          { name: "Armhävningar", reps: "10", instructions: getBwCue("Armhävningar") },
          { name: "Mountain Climbers", reps: "20 (totalt)", instructions: getBwCue("Mountain Climbers") },
          { name: "Situps", reps: "20", instructions: getBwCue("Situps") },
          { name: "Plankan", durationSeconds: 30, instructions: getBwCue("Plankan") }
        ]
      }
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'circuit', 'timecap', 'helkropp'],
  },
  // BW008: Bris & Bränn (Superset/Intervals - 18 min)
  {
    id: "bw008",
    title: "Bris & Bränn",
    shortTitle: "BW Superset Bris",
    type: "bodyweight",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "Ett lekfullt supersetpass där du kör två övningar i taget tre gånger innan du går vidare. 4 supersets = 12 block. Arbeta 30 sek, vila 15 sek mellan övningarna. Totalt 18 minuter.",
    exerciseSummaryList: [
      { name: "Superset 1: Knäböj (kroppsvikt) + Situps", details: "3 varv (30s/övning, 15s vila)" },
      { name: "Superset 2: Armhävningar + Superman", details: "3 varv (30s/övning, 15s vila)" },
      { name: "Superset 3: Jumping Jacks + Plankan", details: "3 varv (30s/övning, 15s vila)" },
      { name: "Superset 4: Mountain Climbers + Glute Bridges", details: "3 varv (30s/övning, 15s vila)" }
    ],
    totalEstimatedTimeMinutes: 18, 
    roundsText: "4 Superset (3 varv/superset)",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[
        { pair: [{name: "Knäböj (kroppsvikt)", cue: getBwCue("Knäböj (kroppsvikt)")}, {name: "Situps", cue: getBwCue("Situps")}], supersetName: "Superset 1"},
        { pair: [{name: "Armhävningar", cue: getBwCue("Armhävningar")}, {name: "Superman", cue: getBwCue("Superman")}], supersetName: "Superset 2"},
        { pair: [{name: "Jumping Jacks", cue: getBwCue("Jumping Jacks")}, {name: "Plankan", cue: getBwCue("Plankan")}], supersetName: "Superset 3"},
        { pair: [{name: "Mountain Climbers", cue: getBwCue("Mountain Climbers")}, {name: "Glute Bridges", cue: getBwCue("Glute Bridges")}], supersetName: "Superset 4"}
      ].flatMap((superset, supersetIndex, allSupersets) => {
        const supersetSegments: TimedSegment[] = [];
        for (let round = 1; round <= 3; round++) {
          supersetSegments.push({ name: superset.pair[0].name, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: "Arbete: 30 sekunder", exercises: [{name: superset.pair[0].name, instructions: superset.pair[0].cue}], currentRound:round, totalRounds:3 });
          supersetSegments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 15, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound:round, totalRounds:3 });
          supersetSegments.push({ name: superset.pair[1].name, type: ExercisePhaseType.WORK, durationSeconds: 30, instructions: "Arbete: 30 sekunder", exercises: [{name: superset.pair[1].name, instructions: superset.pair[1].cue}], currentRound:round, totalRounds:3 });
          if (!(round === 3 && supersetIndex === allSupersets.length - 1)) { 
            supersetSegments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 15, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound:round, totalRounds:3 });
          }
        }
        return supersetSegments;
      })
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'superset', 'intervaller', 'helkropp'],
  },
  // BW009: Sommarstorm-Tabata (TABATA - 19 min)
  {
    id: "bw009",
    title: "Sommarstorm-Tabata",
    shortTitle: "BW Tabata Storm",
    type: "bodyweight",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "Fyra tabatablock med 1 minuts paus mellan blocken. Varje block fokuserar på en övning – 20 sek arbete, 10 sek vila, 8 rundor/block. Totalt 19 minuter.",
    exerciseSummaryList: [
      { name: "Block 1: Jumping Jacks", details: "Tabata (8x 20s/10s)" },
      { name: "Block 2: Situps", details: "Tabata (8x 20s/10s)" },
      { name: "Block 3: Armhävningar", details: "Tabata (8x 20s/10s)" },
      { name: "Block 4: Mountain Climbers", details: "Tabata (8x 20s/10s)" }
    ],
    totalEstimatedTimeMinutes: 19, 
    roundsText: "4 Tabata-block med vila",
    timedSegments: [
      PREPARE_SEGMENT,
      ...[
        { exercise: "Jumping Jacks", blockName: "Tabata 1 – Jumping Jacks" },
        { exercise: "Situps", blockName: "Tabata 2 – Situps" },
        { exercise: "Armhävningar", blockName: "Tabata 3 – Armhävningar" },
        { exercise: "Mountain Climbers", blockName: "Tabata 4 – Mountain Climbers" }
      ].flatMap((block, blockIndex, allBlocks) => {
        const blockSegments: TimedSegment[] = [];
        for (let i = 0; i < 8; i++) {
          blockSegments.push({ name: block.exercise, type: ExercisePhaseType.WORK, durationSeconds: 20, instructions: "Arbete: 20 sekunder", exercises: [{ name: block.exercise, instructions: getBwCue(block.exercise) }], currentRound: i + 1, totalRounds: 8 });
           if (i < 7 || (blockIndex < allBlocks.length -1)) { 
             blockSegments.push({ name: "Vila", type: ExercisePhaseType.REST, durationSeconds: 10, instructions: `Kort vila. ${BREATHING_CUE_REST}`.trim(), currentRound: i + 1, totalRounds: 8 });
          }
        }
        if (blockIndex < allBlocks.length - 1) { 
          blockSegments.push({ name: "Blockvila", type: ExercisePhaseType.REST, durationSeconds: 60, instructions: `1 min vila. ${BREATHING_CUE_REST}`.trim() });
        }
        return blockSegments;
      })
    ],
    difficultyLevel: 'Avancerad',
    tags: ['kroppsvikt', 'tabata', 'högintensiv', 'kondition'],
  },
  // BW010: Havsluft & Hållfasthet (Mixed Intervals 15 min)
  {
    id: "bw010",
    title: "Havsluft & Hållfasthet",
    shortTitle: "BW Mixed Hållf.",
    type: "bodyweight",
    format: WorkoutFormat.CLASSIC_ROUNDS,
    detailedDescription: "Tre 5-minutersblock: 1. Flås, 2. Core, 3. Kombinerad. Inom varje block, kör 30s arbete / 15s vila och upprepa övningarna i blocket så att varje block blir 5 minuter. Varierad helkroppsträning utan redskap – perfekt för att avsluta en aktiv dag.",
    exerciseSummaryList: [
      { name: "Block 1 (5 min): Höga Knän, Jumping Jacks, Squat Jumps", details: "30s/övning, 15s vila" },
      { name: "Block 2 (5 min): Plankan, Situps, Hollow Hold", details: "30s/övning, 15s vila" },
      { name: "Block 3 (5 min): Knäböj (kroppsvikt), Armhävningar, Mountain Climbers", details: "30s/övning, 15s vila" }
    ],
    totalEstimatedTimeMinutes: 15,
    roundsText: "3 block á 5 min",
    timedSegments: [
      PREPARE_SEGMENT,
      // Block 1 – Puls (5 min = 300s. Pattern: 30w-15r-30w-15r-30w-15r-30w-15r-30w-15r. (30+15)*4 = 180. 30+15+30 = 75. 180+75 = 255.  Two full rounds (30+15+30+15+30+15) = 2 * 135s = 270s.  Then High Knees 30s to make it 300s.
      ...[
        {name:"Höga Knän", cue: getBwCue("Höga Knän")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Jumping Jacks", cue: getBwCue("Jumping Jacks")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Squat Jumps", cue: getBwCue("Squat Jumps")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Höga Knän", cue: getBwCue("Höga Knän")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Jumping Jacks", cue: getBwCue("Jumping Jacks")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Squat Jumps", cue: getBwCue("Squat Jumps")}
      ].map((ex) => ({
        name: ex.name, type: ex.type || ExercisePhaseType.WORK, durationSeconds: ex.duration || 30, instructions: ex.type === ExercisePhaseType.REST ? (ex.instructionText || `15s Vila. ${BREATHING_CUE_REST}`.trim()) : "Arbete: 30 sekunder", exercises: ex.type === ExercisePhaseType.WORK ? [{name: ex.name, instructions: ex.cue}] : [], currentRound: 1, totalRounds: 1 
      })),
       // Block 2 – Core (5 min)
      ...[
        {name:"Plankan", cue: getBwCue("Plankan")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Situps", cue: getBwCue("Situps")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Hollow Hold", cue: getBwCue("Hollow Hold")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Plankan", cue: getBwCue("Plankan")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Situps", cue: getBwCue("Situps")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Hollow Hold", cue: getBwCue("Hollow Hold")},
      ].map((ex) => ({
        name: ex.name, type: ex.type || ExercisePhaseType.WORK, durationSeconds: ex.duration || 30, instructions: ex.type === ExercisePhaseType.REST ? (ex.instructionText || `15s Vila. ${BREATHING_CUE_REST}`.trim()) : "Arbete: 30 sekunder", exercises: ex.type === ExercisePhaseType.WORK ? [{name: ex.name, instructions: ex.cue}] : [], currentRound: 1, totalRounds: 1
      })),
      // Block 3 – Helkropp (5 min)
      ...[
        {name:"Knäböj (kroppsvikt)", cue: getBwCue("Knäböj (kroppsvikt)")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Armhävningar", cue: getBwCue("Armhävningar")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Mountain Climbers", cue: getBwCue("Mountain Climbers")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Knäböj (kroppsvikt)", cue: getBwCue("Knäböj (kroppsvikt)")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Armhävningar", cue: getBwCue("Armhävningar")}, {name:"Vila", type:ExercisePhaseType.REST, duration:15, instructionText: `15s Vila. ${BREATHING_CUE_REST}`.trim()},
        {name:"Mountain Climbers", cue: getBwCue("Mountain Climbers")},
      ].map((ex) => ({
        name: ex.name, type: ex.type || ExercisePhaseType.WORK, durationSeconds: ex.duration || 30, instructions: ex.type === ExercisePhaseType.REST ? (ex.instructionText || `15s Vila. ${BREATHING_CUE_REST}`.trim()) : "Arbete: 30 sekunder", exercises: ex.type === ExercisePhaseType.WORK ? [{name: ex.name, instructions: ex.cue}] : [], currentRound: 1, totalRounds: 1
      }))
    ],
    difficultyLevel: 'Medel',
    tags: ['kroppsvikt', 'intervaller', 'helkropp', 'varierat'],
  }
];

export const WORKOUTS: Workout[] = [
  ...existingWarmupsAndBW,
  ...userKettlebellWorkouts,
  ...userBodyweightWorkouts
];


// Function to get the current workout level
export const getCurrentWorkoutLevel = (workoutsCompleted: number): Level => {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (LEVEL_DEFINITIONS[i].minWorkouts !== undefined && workoutsCompleted >= LEVEL_DEFINITIONS[i].minWorkouts!) {
      return LEVEL_DEFINITIONS[i];
    }
  }
  return LEVEL_DEFINITIONS[0]; // Default to the first level if none match
};

// Function to get the current walking challenge level
export const getCurrentWalkingLevel = (daysCompleted: number): Level => {
  for (let i = WALKING_LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (WALKING_LEVEL_DEFINITIONS[i].minDays !== undefined && daysCompleted >= WALKING_LEVEL_DEFINITIONS[i].minDays!) {
      return WALKING_LEVEL_DEFINITIONS[i];
    }
  }
  return WALKING_LEVEL_DEFINITIONS[0]; // Default to the first level
};

export const DAILY_EXTRAS = [
  { text: 'Visste du att 5 minuters rörelse varje timme kan göra stor skillnad för din energi under dagen?', iconType: 'tip' as const },
  { text: 'Kom ihåg att dricka tillräckligt med vatten idag, speciellt om det är varmt!', iconType: 'tip' as const },
  { text: '"Det är inte berget vi erövrar, utan oss själva." - Sir Edmund Hillary', iconType: 'quote' as const },
  { text: 'Ett skratt om dagen förlänger livet – och gör magmusklerna glada!', iconType: 'tip' as const },
  { text: '"Styrka kommer inte från att vinna. Dina motgångar utvecklar din styrka." - Arnold Schwarzenegger', iconType: 'quote' as const },
  { text: 'Ta en stund för djupa andetag. Syre är din bästa vän!', iconType: 'tip' as const },
  { text: '"Det enda dåliga träningspasset är det som inte blir av."', iconType: 'quote' as const }
];

// --- ACHIEVEMENT DEFINITIONS ---
const checkWorkoutsOnSameDay = (data: AchievementCheckData, countThreshold: number): boolean => {
  const workoutsByDay: { [date: string]: number } = {};
  data.workoutLog.forEach(log => {
    if (!log.workoutId.startsWith('warmup-')) { // Exclude warm-ups
      const date = log.dateCompleted; // YYYY-MM-DD format
      workoutsByDay[date] = (workoutsByDay[date] || 0) + 1;
    }
  });
  return Object.values(workoutsByDay).some(count => count >= countThreshold);
};

const MIN_WORKOUTS_FOR_AKTIV_STARTARE = LEVEL_DEFINITIONS.find(l => l.name === "Aktiv Startare")?.minWorkouts || 5;
const MIN_DAYS_FOR_UPPTACKARE = WALKING_LEVEL_DEFINITIONS.find(l => l.name === "Upptäckare")?.minDays || 3;


export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Training Milestones
  { id: 'train_first_blood', name: "Första Svettdroppen", description: "Slutför ditt allra första träningspass. Bra start!", icon: BicepIcon, category: AchievementCategory.TRAINING, isAchieved: (data) => data.totalWorkoutsCompleted >= 1 },
  { id: 'train_five_star', name: "Femlingan", description: "Slutför 5 träningspass. Du är på gång!", icon: StarIcon, category: AchievementCategory.TRAINING, isAchieved: (data) => data.totalWorkoutsCompleted >= 5 },
  { id: 'train_ten_tags', name: "Tio Taggar", description: "Slutför 10 träningspass. Imponerande!", icon: TrophyIcon, category: AchievementCategory.TRAINING, isAchieved: (data) => data.totalWorkoutsCompleted >= 10 },
  { id: 'train_twenty_milestone', name: "20-Strecket", description: "Grattis! Du har nått 20 träningspass. En stark milstolpe!", icon: TrophyIcon, category: AchievementCategory.TRAINING, isAchieved: (data: AchievementCheckData) => data.totalWorkoutsCompleted >= 20 },
  { id: 'train_thirty_champion', name: "30-Pass Champion", description: "Wow! 30 träningspass avklarade! Du är en sann champion och inspirationskälla!", icon: TrophyIcon, category: AchievementCategory.TRAINING, isAchieved: (data: AchievementCheckData) => data.totalWorkoutsCompleted >= 30 },
  { 
    id: 'train_level_active_starter', 
    name: "Nivå Upptäckt (Träning)", 
    description: "Nå träningsnivån 'Aktiv Startare'.", 
    icon: AcademicCapIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data) => data.totalWorkoutsCompleted >= MIN_WORKOUTS_FOR_AKTIV_STARTARE
  },
  { id: 'train_kb_novice', name: "Kettlebell Novis", description: "Slutför 3 kettlebellpass.", icon: KettlebellIcon, category: AchievementCategory.TRAINING, isAchieved: (data) => data.workoutLog.filter(log => log.workoutType === 'kettlebell' && !log.workoutId.startsWith('warmup-')).length >= 3 },
  { id: 'train_bw_warrior', name: "Kroppsvikts Kämpe", description: "Slutför 3 kroppsviktspass.", icon: StickFigureIcon, category: AchievementCategory.TRAINING, isAchieved: (data) => data.workoutLog.filter(log => log.workoutType === 'bodyweight' && !log.workoutId.startsWith('warmup-')).length >= 3 },
  { 
    id: 'train_ai_workout_completed', 
    name: "Bartender Connoisseur", 
    description: "Slutför din första Bartender Cocktail. Du är en digital mixolog!", 
    icon: SparklesIcon, 
    category: AchievementCategory.ENGAGEMENT, 
    isAchieved: (data: AchievementCheckData) => data.workoutLog.some(log => log.workoutId.startsWith('generated-')) 
  },
  { 
    id: 'train_ai_workout_30min', 
    name: "Bartender Maraton", 
    description: "Skapa och slutför en träningscocktail med Flexibel Bartender som är minst 30 minuter lång. Skål för uthålligheten!", 
    icon: TrophyIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data: AchievementCheckData) => data.workoutLog.some(log => log.workoutId.startsWith('generated-') && log.durationMinutes && log.durationMinutes >= 30) 
  },
  { 
    id: 'train_forty_machine', 
    name: "Träningsmaskinen (40 Pass)", 
    description: "Otroligt! 40 träningspass slutförda. Du är en maskin!", 
    icon: TrophyIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data: AchievementCheckData) => data.totalWorkoutsCompleted >= 40 
  },
  { 
    id: 'train_fifty_legend', 
    name: "Träningslegend (50 Pass)", 
    description: "Legendariskt! 50 träningspass i boken. Vilken inspiration!", 
    icon: TrophyIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data: AchievementCheckData) => data.totalWorkoutsCompleted >= 50 
  },
  { 
    id: 'train_daily_double', 
    name: "Dubbel Dagens Dos", 
    description: "Två pass på en dag! Vilken energi!", 
    icon: BicepIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data) => {
        const workoutsByDay: { [date: string]: number } = {};
        data.workoutLog.forEach(log => {
            if (!log.workoutId.startsWith('warmup-')) {
            workoutsByDay[log.dateCompleted] = (workoutsByDay[log.dateCompleted] || 0) + 1;
            }
        });
        return Object.values(workoutsByDay).some(count => count === 2);
    }
  },
  { 
    id: 'train_daily_triple', 
    name: "Trippel Tränings-Triumf", 
    description: "Tre pass på en dag! Otroligt engagemang!", 
    icon: FireIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data) => {
        const workoutsByDay: { [date: string]: number } = {};
        data.workoutLog.forEach(log => {
            if (!log.workoutId.startsWith('warmup-')) {
            workoutsByDay[log.dateCompleted] = (workoutsByDay[log.dateCompleted] || 0) + 1;
            }
        });
        return Object.values(workoutsByDay).some(count => count === 3);
    }
  },
  { 
    id: 'train_daily_quadruple', 
    name: "Kvadrupel Kraftprov", 
    description: "Fyra pass på en dag! En sann träningslegend!", 
    icon: TrophyIcon, 
    category: AchievementCategory.TRAINING, 
    isAchieved: (data) => checkWorkoutsOnSameDay(data, 4) // Stays as >= 4 for the highest tier
  },
  // Walking Milestones
  { id: 'walk_first_step', name: "Första Steget", description: "Slutför din första promenaddag. Heja dig!", icon: FootstepsIcon, category: AchievementCategory.WALKING, isAchieved: (data) => data.totalWalkingDaysCompleted >= 1 },
  { id: 'walk_seven_league_boots', name: "Veckans Vandrare", description: "Slutför 7 promenaddagar. Vilken framfart!", icon: SunIcon, category: AchievementCategory.WALKING, isAchieved: (data) => data.totalWalkingDaysCompleted >= 7 },
  { 
    id: 'walk_level_discoverer', 
    name: "Nivå Upptäckt (Promenad)", 
    description: "Nå gångnivån 'Upptäckare'.", 
    icon: AcademicCapIcon, 
    category: AchievementCategory.WALKING, 
    isAchieved: (data) => data.totalWalkingDaysCompleted >= MIN_DAYS_FOR_UPPTACKARE
  },
  { id: 'walk_streak_3', name: "Promenad Streak x3", description: "Uppnå en promenadstreak på 3 dagar i rad.", icon: FireIcon, category: AchievementCategory.WALKING, isAchieved: (data) => data.currentWalkingStreak >= 3 },
  { 
    id: 'walk_one_hour', 
    name: "Timmesvandraren", 
    description: "Genomför en promenad på minst 60 minuter. Bra uthållighet!", 
    icon: FootstepsIcon, 
    category: AchievementCategory.WALKING, 
    isAchieved: (data: AchievementCheckData) => data.walkingLog.some(log => log.durationMinutes >= 60 && log.durationMinutes < 120) 
  },
  { 
    id: 'walk_two_hours', 
    name: "Långfärdsexperten", 
    description: "Starkt! Genomför en promenad på minst 120 minuter.", 
    icon: FootstepsIcon, 
    category: AchievementCategory.WALKING, 
    isAchieved: (data: AchievementCheckData) => data.walkingLog.some(log => log.durationMinutes >= 120) 
  },
  // Engagement Achievements
  { id: 'engage_favorite_finder', name: "Favoritfinnaren", description: "Markera minst ett pass som favorit.", icon: HeartIcon, category: AchievementCategory.ENGAGEMENT, isAchieved: (data) => data.favoriteWorkoutIds.length >= 1 },
  { id: 'engage_feedback_fairy', name: "Feedback Fén", description: "Lämna en kommentar på minst ett träningspass.", icon: ChatBubbleOvalLeftEllipsisIcon, category: AchievementCategory.ENGAGEMENT, isAchieved: (data) => data.workoutLog.some(log => log.comment && log.comment.trim() !== '') },
  { id: 'engage_score_hunter', name: "Resultatjägaren", description: "Logga ett resultat (tid/varv) på ett AMRAP/Time Cap-pass.", icon: EditIcon, category: AchievementCategory.ENGAGEMENT, isAchieved: (data) => data.workoutLog.some(log => log.score && log.score.trim() !== '') },
  { 
    id: 'engage_sharer_1', 
    name: "Hälsobudbärare", 
    description: "Delade appen för första gången. Tack för att du sprider peppen!", 
    icon: ShareIcon, 
    category: AchievementCategory.ENGAGEMENT, 
    isAchieved: (data) => data.appShareCount >= 1 
  },
  { 
    id: 'engage_sharer_2', 
    name: "Dubbel Pepp-Spridare", 
    description: "Delade appen för andra gången. Två gånger så mycket glädje!", 
    icon: ShareIcon, 
    category: AchievementCategory.ENGAGEMENT, 
    isAchieved: (data) => data.appShareCount >= 2
  },
  { 
    id: 'engage_sharer_3', 
    name: "Trippel Hälso-Ambassadör", 
    description: "Delade appen för tredje gången. Du är en sann inspirationskälla!", 
    icon: ShareIcon, 
    category: AchievementCategory.ENGAGEMENT, 
    isAchieved: (data) => data.appShareCount >= 3
  },
  { 
    id: 'engage_sharer_4_superstar', 
    name: "Stjärnspridare Deluxe", 
    description: "Delade appen 4 gånger eller mer. Du är en Super-Delare och har låst upp en hemlighet!", 
    icon: SparklesIcon, 
    category: AchievementCategory.ENGAGEMENT, 
    isAchieved: (data) => data.appShareCount >= 4
  },
];

// --- TOTAL SUMMER STATUS ---
export const MAX_WORKOUT_CHALLENGE_POINTS = 30;
export const MAX_WALKING_CHALLENGE_POINTS = 30;
export const MAX_ACHIEVEMENT_POINTS = ACHIEVEMENT_DEFINITIONS.length; // Actual number for calculation
export const MYSTERY_ACHIEVEMENT_COUNT_DISPLAY = 88; // Number to display to user

export const TOTAL_SUMMER_SCORE_MAX = MAX_WORKOUT_CHALLENGE_POINTS + MAX_WALKING_CHALLENGE_POINTS + MAX_ACHIEVEMENT_POINTS;

export const SUMMER_STATUS_LEVELS: SummerStatusLevel[] = [
  { name: "Solglimt", minScore: 0, icon: SunIcon },
  { name: "Strandfynd", minScore: 11, icon: StarIcon },
  { name: "Semesterlunkare", minScore: 26, icon: WaveIcon },
  { name: "Sommarutforskare", minScore: 41, icon: FootstepsIcon },
  { name: "HälsoVeteran", minScore: 56, icon: BicepIcon }, 
  { name: "SommarChampion!", minScore: TOTAL_SUMMER_SCORE_MAX -3, icon: TrophyIcon } 
];
// Ensure the last level includes the max score, or adjust minScore for SommarChampion
if (SUMMER_STATUS_LEVELS.length > 0 && TOTAL_SUMMER_SCORE_MAX > 0) {
    const championLevel = SUMMER_STATUS_LEVELS[SUMMER_STATUS_LEVELS.length - 1];
    if (championLevel.name === "SommarChampion!" && championLevel.minScore > TOTAL_SUMMER_SCORE_MAX - 5 && championLevel.minScore <= TOTAL_SUMMER_SCORE_MAX) {
        // current logic is fine
    } else if (championLevel.name === "SommarChampion!"){
      championLevel.minScore = Math.max(0, TOTAL_SUMMER_SCORE_MAX - Math.floor(TOTAL_SUMMER_SCORE_MAX * 0.10)); 
    }
}


// --- DAILY PEP MESSAGES ---
export const DAILY_PEP_MESSAGES: string[] = [
  "Du är starkare än du tror!",
  "Ett litet steg idag är ett stort kliv imorgon.",
  "Kom ihåg att dricka vatten – din kropp tackar dig!",
  "Ta en minut och sträck på dig, det gör susen!",
  "Le mot dig själv i spegeln – du är grym!",
  "Varje rörelse räknas, oavsett hur liten.",
  "Bra jobbat att du är här och tar hand om dig!",
  "Energi föder energi. Sätt igång så kommer det mer!",
  "Ditt välmående är en investering, inte en kostnad.",
  "Lyssna på din kropp, den är smartare än du anar.",
  "Du har kraften att förändra din dag, en handling i taget.",
  "Sätt ett litet, uppnåeligt mål för dagen. Känslan efteråt är oslagbar!",
  "Var stolt över varje framsteg, stort som litet.",
  "Glöm inte bort vilan, den är lika viktig som aktiviteten.",
  "Du är kapabel till fantastiska saker!",
  "En promenad kan rensa huvudet och ge nya perspektiv.",
  "Fokusera på känslan, inte bara på prestationen.",
  "Varje dag är en ny chans att må bra.",
  "Ge dig själv en klapp på axeln – du förtjänar det!",
  "Lite pepp från oss till dig: Kör hårt (eller mjukt, vad som passar dig)!"
];

// --- TEXT STRINGS (APP_STRINGS) ---
export const APP_STRINGS = {
  logoText: "Sommarutmaning 2025",
  appMainCampaignTitle: "Sommarutmaning 2025!",
  appHashtag: "#FlexibelHälsostudioSommar",

  enterYourNamePrompt: "Välkommen! Redo att starta din utmaning?",
  enterYourNameEngagingSubtitle: "Släpp alla tråkiga 'måsten' – här blir hälsa ett äventyr! Knappa in ditt namn så bjuder vi på personlig high-five-energi, håller stenkoll på dina framsteg och hjälper dig göra sommaren oförglömlig. Din data är bara din, tryggt och säkert i din webbläsare.",
  enterYourNameInputLabel: "Ditt namn eller smeknamn",
  saveNameButton: "Spara & Starta Utmaningen!",
  
  greetingMorning: "God morgon, {name}!",
  greetingDay: "Hej {name}!",
  greetingEvening: "God kväll, {name}!",
  strongRemark: "Vilken energi du sprider idag!",
  greetingSuperSharerSuffixPart1: "Du är verkligen en stor ",
  greetingSuperSharerSuffixStar: "STJÄRNA",
  greetingSuperSharerSuffixPart2: " som hjälper till att sprida ordet! ",
  // greetingSuperSharerSuffixQuotedStar: 'stjärna', // Removed as per request


  homeViewFooterText: "© 2025 Flexibel Hälsostudio. Alla rättigheter förbehållna.",

  // Home View - Workout Challenge Section
  workoutChallengesMainTitle: "Träningsutmaning",
  homeStreakLabel: "Streak",
  homeStreakUnit: "dagar",
  homeTotalWorkoutsLabel: "Totalt",
  homeTotalWorkoutsUnit: "pass",
  homeCurrentLevelLabel: "Nivå",
  workoutsToNextLevelText: "{count} pass kvar till nivån: {levelName}!",
  maxLevelReachedText: "Maximal träningsnivå uppnådd!",
  viewLevelsButton: "Visa Träningsnivåer",
  warmUpButton: "Uppvärmning",
  workoutOfTheDayKBButton: "Träningspass Kettlebell",
  workoutOfTheDayBWButton: "Träningspass Kroppsvikt",
  generateWorkoutButton: "Flexibel Bartender", // Updated for bartender theme
  noWorkoutsAvailable: "Inga pass tillgängliga för denna kategori just nu.",
  warmUpButtonTitle: "Starta en slumpmässig 5-minuters uppvärmning",
  workoutOfTheDayKBButtonTitle: "Starta ett slumpmässigt kettlebellpass (10-19 min)", 
  workoutOfTheDayBWButtonTitle: "Starta ett slumpmässigt kroppsviktspass (10-19 min)", 
  
  // Home View - Walking Challenge Section
  walkingChallengeHomeTitle: "Promenadutmaning",
  walkingChallengeDayDisplay: "{day} / {totalDays} dagar avklarade",
  walkingChallengeStreakLabel: "Promenad Streak",
  walkingChallengeCurrentLevelLabel: "Gångnivå",
  daysToNextWalkingLevelText: "{count} dagar kvar till nivån: {levelName}!",
  walkingChallengeMaxLevelReachedText: "Maximal gångnivå uppnådd!",
  walkingChallengeNotCompletedToday: "Dagens promenad (30 min) ej avklarad.",
  walkingChallengeCompletedToday: "Dagens promenad (30 min) avklarad!",
  startWalkingChallengeButton: "Starta Dagens Promenad!",
  walkingChallengeAllDaysCompleted: "Alla 30 promenaddagar avklarade! Fantastiskt!",
  viewWalkingLevelsButton: "Visa Gångnivåer",
  walkingChallengeInfoButtonTooltip: "Info om Promenadutmaningen",
  workoutChallengeInfoButtonTooltip: "Info om Träningsutmaningen",

  // Home View - Bottom Nav Buttons
  profileButtonLabel: "Diplom & Favvopass",
  contactAndShareButtonLabel: "Info & Kontakt", // Updated
  tipsButtonLabel: "Tips & Inspiration", // Updated
  viewAchievementsButtonLabel: "Visa Utmärkelser",

  // Home View - Daily Extra
  homeDailyExtraTitle: "Dagens Lilla Extra",
  
  // Home View - Daily Pep
  homeDailyPepButtonText: "Tänd Dagens Pepp-Ljus ✨",
  pepModalTitle: "Dagens Pepp!",

  // Home View - Total Summer Status
  homeSummerStatusTitle: "Din Sommarstatus!",
  homeSummerStatusLevelLabel: "Din titel:",
  homeSummerStatusScoreLabel: "Poäng:",
  homeSummerScoreInfoButtonTooltip: "Visa information om poängberäkning",
  homeSummerScoreInfoModalTitle: "Hur Beräknas Din SommarPoäng?",
  homeSummerScoreInfoModalDesc1: "Din totala SommarPoäng är en summa av dina framsteg i flera delar av utmaningen:",
  homeSummerScoreInfoModalWorkoutPoints: "Träningspass: Varje slutfört träningspass ger 1 poäng (max {points}p).",
  homeSummerScoreInfoModalWalkingPoints: "Promenader: Varje avklarad promenaddag ger 1 poäng (max {points}p).",
  homeSummerScoreInfoModalAchievementPoints: "Utmärkelser: Varje upplåst utmärkelse ger 1 poäng (just nu {points}p möjliga).",


  // Workout Detail View
  backToHome: "Tillbaka till Start",
  startWorkout: "Starta", 
  addToFavoritesTooltip: "Lägg till som favorit",
  removeFromFavoritesTooltip: "Ta bort från favoriter",
  workoutDetailPreviousScoreLabel: "Ditt senaste resultat:",

  // Pre-Workout Countdown View
  preWorkoutCountdownTitle: "Träningen börjar om...",
  preWarmupCountdownTitle: "Uppvärmningen börjar om...", 

  // Workout Active View
  prepareSegmentTitlePersonalized: "Gör dig redo, {name}!",
  pause: "Pausa",
  resume: "Återuppta",
  endWorkout: "Avbryt", 
  confirmEndWorkoutTitle: "Är du säker?",
  confirmEndWorkoutMessage: "Vill du verkligen avsluta passet nu? Dina framsteg för detta pass kommer inte att sparas.",
  confirmEndWarmupMessage: "Vill du verkligen avsluta uppvärmningen nu?",
  confirmEndWorkoutYesButton: "Ja, avsluta",
  confirmEndWorkoutNoButton: "Nej, fortsätt",
  emomMinute: "Minut",
  emomOf: "av",
  amrapTimer: "AMRAP Tid Kvar:",
  timeCapOverallTimer: "Tid Kvar:",
  timeCapTask: "Uppgift",
  timeCapCompleteWorkoutButton: "Jag är färdig!", 
  nextExerciseLabel: "Nästa:", 


  // Post Workout View
  workoutCompleteTitle: "Passet Slutfört!", 
  postWorkoutBaseCompletionMessage: "{name}, grymt jobbat med passet!",
  postWorkoutFirstEverMessage: "Första passet avklarat, {name}! Vilken start!",
  postWorkoutStreakContinuedMessage: "{name}, din streak fortsätter! Nu {streak} dagar i rad!",
  postWorkoutNewStreakMessage: "{name}, en ny träningsstreak har börjat!",
  postWorkoutLevelUpMessage: "GRATTIS {name}! Du har nått nivån: {levelName}!",
  postWorkoutTotalCountMessage: "Totalt antal pass: {count}.",
  postWorkoutCommentLabel: "Lägg till en kommentar (valfritt):",
  postWorkoutCommentPlaceholder: "Hur kändes passet? Några tankar?",
  postWorkoutScoreLabelAMRAP: "Hur många varv + reps hann du?",
  postWorkoutScorePlaceholderAMRAP: "t.ex. 7 varv + 5 reps",
  postWorkoutScoreLabelTimeCap: "Din tid (MM:SS):",
  postWorkoutScorePlaceholderTimeCap: "t.ex. 14:30",
  showDiplomaButton: "Visa Diplom",
  shareLevelUpButton: "Dela Nivåhöjning",
  markAsFavoriteQuestion: "Gillar du passet? Markera som favorit:",
  postWorkoutAbortedTitle: "Passet Avbrutet",
  postWorkoutAbortedInfo: "Inga problem, ibland blir det inte som man tänkt. Nytt försök nästa gång!",

  // Post Warm-Up Prompt View
  postWarmUpPromptTitle: "Uppvärmning Klar!",
  postWarmUpPromptQuestion: "Vilken typ av utmaning vill du köra nu?",

  // Level System View
  levelSystemViewTitle: "Dina Träningsnivåer",
  workoutLevelSystemTitle: "Dina Träningsnivåer", 
  levelRequirementText: "{minWorkouts} pass",

  // Profile View
  profileViewTitle: "Min Profil",
  editNameTooltip: "Redigera namn",
  changeNameLabelInProfile: "Ändra ditt visningsnamn:",
  saveProfileButton: "Spara Ändringar",
  cancelButton: "Avbryt",
  profileDiplomasTitle: "Mina Diplom",
  profileMinaPromenadDiplomTitle: "Mina Promenaddiplom",
  diplomaLogEntryButton: "Diplom",
  profileNoDiplomas: "Inga träningsdiplom ännu. Slutför ett pass för att få ditt första!",
  profileNoPromenadDiplom: "Inga promenaddiplom ännu. Slutför en promenaddag för att få ditt första!",
  profileFavoriteWorkoutsTitle: "Mina Favoritpass",
  viewWorkoutButton: "Visa Pass",
  profileNoFavoriteWorkouts: "Du har inte markerat några pass som favoriter än.",
  profileWorkoutLogTitle: "Träningslogg:", 
  profileNoWorkoutLogEntries: "Inga loggade träningspass ännu.", 
  profileDataStorageInfoTitle: "Din Data, Ditt Ansvar",
  profileDataStorageInfoText: "All din data (namn, framsteg, loggar) sparas endast lokalt i din webbläsare. Om du rensar webbläsardata eller byter webbläsare/enhet kommer din data att försvinna. Det finns ingen central lagring eller backup.",
  profileAchievementsTitle: "Mina Utmärkelser",
  achievementLockedTooltip: "Fortsätt kämpa för att låsa upp denna utmärkelse!",
  
  // Walking Challenge - Profile
  profileWalkingChallengeTitle: "Min Promenadutmaning",
  profileWalkingDayCompleted: "Dag {day} avklarad",
  profileNoWalkingLogEntries: "Inga loggade promenader än.",
  profileWalkingChallengeLogTitle: "Promenadlogg:",
  profileWalkingLogDistanceLabel: "Distans:",
  profileWalkingLogStepsLabel: "Steg:",


  // Diploma View
  diplomaViewTitle: "Träningsdiplom",
  diplomaCongratulations: "GRATTIS, {name}!",
  diplomaHeadlineUser: "Du har framgångsrikt slutfört följande träningspass:",
  diplomaHeadlineGeneric: "Du har framgångsrikt slutfört följande träningspass:",
  diplomaWorkoutLabel: "Pass:",
  diplomaDateLabel: "Datum:",
  diplomaTimeLabel: "Tid:",
  diplomaLevelLabel: "Nivå uppnådd:",
  diplomaTotalWorkoutsLabel: "Totalt antal pass vid slutförande:",
  diplomaCommentLabel: "Din kommentar:",
  diplomaNewLevelReachedText: "Ny nivå uppnådd!",
  diplomaYourScoreLabel: "Ditt resultat:",
  diplomaNewRecordText: "NYTT REKORD!",
  diplomaPreviousBestText: "Tidigare:",
  shareDiplomaButton: "Dela Diplom",
  linkCopiedToClipboard: "Länk kopierad till urklipp!",
  shareDiplomaText: "Jag klarade precis '{workoutTitle}' den {date} kl {time} och nådde nivån '{levelName}' i {hashtag}! 💪 Känslan är på topp! Delta du också i {appFullName}!",
  shareWorkoutLevelUpText: "Jippi! Jag har precis nått träningsnivån '{levelName}' i {hashtag}! Framsteg känns grymt! 🎉 Ta del av {appFullName} du med!",
  
  // Share and Contact View (SpreadLoveView) - Now "Info & Kontakt"
  spreadLoveViewTitle: "Om Oss & Kontakt", // Updated title
  spreadLoveShareMotivationText: "Hjälp oss att sprida rörelseglädje och peppa fler att haka på sommarens utmaningar! Dela appen med vänner, familj och kollegor.",
  shareAppTitle: "Sprid Kärleken ❤️", // Updated from "Dela Denna App"
  shareAppButton: "Dela Kärleken Nu!", // Updated from "Dela Appen Nu!"
  shareAppFallbackText: "Din webbläsare stöder inte direkt delning. Kopiera och klistra in länken nedan för att dela:",
  spreadLoveCommunityHashtagSuggestion: `Använd gärna ${"FlexibelHälsostudioSommar"} i sociala medier!`, // Note: appMainCampaignTitle updated, hashtag might need update if it was dynamic
  bookIntroTitle: "Boka Kostnadsfritt Introsamtal",
  bookIntroLinkText: "Klicka här för att komma till bokningssidan",
  qrCodeAltText: "QR-kod till bokningssidan",
  shareBookingButtonText: "Dela Bokningslänk",
  shareBookingMessageText: "Nyfiken på personlig träning eller kostrådgivning? Boka ett kostnadsfritt introsamtal hos Flexibel Hälsostudio här: {bookingUrl} {hashtag}. En del av {appFullName}.",
  spreadLoveStudioLocationsInfo: "Vi finns i Salems Centrum och i Kärra centrum",
  spreadLoveContactEmail: "Kontakt: info@flexibelfriskvardhalsa.se", // Keep this one
  
  // Tips View (TipsView) - Now "Tips & Inspiration"
  tipsViewTitle: "Tips & Inspiration", // Updated title
  summerReadingsTitle: "Sommarläsning & Inspiration",
  summerReadingsButton: "Besök Vår Blogg",
  instagramSectionTitle: "Följ Oss På Instagram",
  instagramButtonText: "Till Flexibel på Instagram",
  facebookSectionTitle: "Gilla Oss På Facebook",
  facebookButtonText: "Till Flexibel på Facebook",
  aboutUsSectionTitle: "Om Flexibel Hälsostudio", // Will be moved visually within SpreadLoveView
  aboutUsParagraph1: "På Flexibel brinner vi för att hjälpa människor att uppnå och bibihålla hälsa. Vår vision och mission är att skapa de bästa förutsättningarna för dig att nå dina hälsomål. Genom att erbjuda högkvalitativa tjänster inom träning, återhämtning och kost i en stödjande och inspirerande miljö.",
  aboutUsParagraph2: "Vi skiljer oss från andra anläggningar genom vår helhetssyn och expertis inom träning, kost och mental hälsa. Med ett stort engagemang, vetenskaplig approach och best practice, arbetar vi för att ge dig de verktyg och den kunskap du behöver. Vår strategi är att tillhandahålla träning, återhämtning och kostråd samt öka din kunskap om hälsans betydelse, allt i en familjär, trygg och stöttande miljö.​​",
  aboutUsTagline: "Vi är här för att stödja dig varje steg på vägen, med vår expertis och vårt engagemang. Kontakta oss för en kostnadsfri konsultation och upptäck hur vi kan hjälpa dig att må bättre än någonsin.",
  contactEmailLabel: "E-post:", // This specific label might be redundant if email is directly in SpreadLoveView
  contactEmailValue: "info@flexibelfriskvardhalsa.se",
  contactPhoneNumberLabel: "Telefon:", // This specific label might be redundant if email is directly in SpreadLoveView
  contactPhoneNumberValue: "0760 00 09 25",

  // Active Walking View
  activeWalkingTitle: "Dagens Promenad",
  activeWalkingStartTimeLabel: "Startade kl:",
  pauseWalkingButton: "Pausa Promenad",
  resumeWalkingButton: "Återuppta Promenad",
  completeWalkingChallengeButton: "Slutför Promenad",
  confirmEndWalkingTitle: "Avsluta Promenaden?",
  confirmEndWalkingDurationInfo: "Du har promenerat i {duration}.", 
  confirmEndWalkingMotivationEarned: "Bra jobbat! Du har förtjänat ett diplom.", 
  confirmEndWalkingMotivationNoDiploma: "Om du avslutar nu räknas inte dagen för utmaningen (minst 30 min krävs).", 
  confirmEndWalkingQuestion: "Vill du avsluta promenaden?", 


  // Post Walking View
  postWalkingTitle: "Promenad Avklarad!",
  postWalkingAbortedTitle: "Promenad Avbruten",
  postWalkingAbortedInfo: "Inga problem, varje steg räknas! Försök igen senare.",
  postWalkingSuccessMessage: "{name}, bra kämpat! Dag {dayNumber} av promenadutmaningen är nu avklarad!",
  postWalkingLevelUpMessage: "GRATTIS, {name}! Du har nått en ny gångnivå: {levelName}!",
  postWalkingStreakMessage: "Din promenadstreak är nu {streak} dagar! Håll igång det!",
  postWalkingChallengeCompletedMessage: "{name}, du har slutfört hela promenadutmaningen! Fantastiskt jobbat!",
  postWalkingChallengeFullyCompletedMessage: "GRATTIS {name}! Du har klarat HELA Gå-Utmaningen! Vilken prestation!",
  postWalkingToHomeButton: "Tillbaka till Start",
  postWalkingShowDiplomaButton: "Visa Promenaddiplom",
  shareChallengeCompletedButton: "Dela Utmaningsprestation",
  postWalkingDistanceLabel: "Distans (valfritt, km):",
  postWalkingDistancePlaceholder: "t.ex. 3.2",
  postWalkingStepsLabel: "Antal steg (valfritt):",
  postWalkingStepsPlaceholder: "t.ex. 4100",
  shareWalkingLevelUpText: "Jippi! Jag har precis nått gångnivån '{levelName}' i {hashtag}! Varje steg räknas! 🚶‍♀️🎉 Bli med i {appFullName} du också!",
  shareWalkingChallengeCompletedText: "Jag klarade det! Hela Sommarens Promenadutmaning ({totalDays} dagar) är slutförd! Känns fantastiskt! 🏆🚶‍♂️ {hashtag}. Utmana dig själv med {appFullName}!",


  // Walking Level System View
  walkingLevelSystemViewTitle: "Dina Gångnivåer",
  levelRequirementDaysText: "{minDays} dagar",

  // Info Modals on Home Screen
  walkingChallengeInfoModalTitle: "Info: Sommarens Promenadutmaning",
  walkingChallengeInfoModalPurposeLabel: "Syfte:",
  walkingChallengeInfoModalPurposeText: "Att uppmuntra till daglig rörelse genom att gå minst 30 minuter varje dag i 30 dagar.",
  walkingChallengeInfoModalHowItWorksLabel: "Hur fungerar det?",
  walkingChallengeInfoModalRule1: "Starta 'Dagens Promenad' från hemskärmen.",
  walkingChallengeInfoModalRule2: "En timer startar och räknar uppåt. Du kan pausa och återuppta.", 
  walkingChallengeInfoModalRule3: "Om du promenerar minst 30 minuter räknas dagen som avklarad.", 
  walkingChallengeInfoModalRule4: "Samla dagar, bygg en streak och klättra i gångnivåer!",
  walkingChallengeInfoModalRule5: "Du kan valfritt logga distans och steg efter varje promenad.",
  walkingChallengeInfoModalTipsLabel: "Tips:",
  walkingChallengeInfoModalTipsText: "Hitta en trevlig runda, lyssna på en podd eller musik, eller ta med en vän! Varje steg räknas.",

  workoutChallengeInfoModalTitle: "Info: Sommarens Träningsutmaning",
  workoutChallengeInfoModalPurposeLabel: "Syfte:",
  workoutChallengeInfoModalPurposeText: "Att motivera till regelbunden och varierad träning genom att slutföra 30 korta och effektiva pass under sommaren.",
  workoutChallengeInfoModalHowItWorksLabel: "Så här deltar du:", 
  workoutChallengeInfoModalRule1: "Välj 'Träningspass Kettlebell' eller 'Träningspass Kroppsvikt' från hemskärmen.",
  workoutChallengeInfoModalRule2: "Ett slumpmässigt pass (10-19 min) väljs. Du kan också starta en uppvärmning först.",
  workoutChallengeInfoModalRuleAI: "Testa 'Flexibel Bartender' och låt din personliga AI-bartender blanda ihop en unik träningscocktail, helt efter dina önskemål!", // Updated
  workoutChallengeInfoModalRule3: "Följ instruktionerna och slutför passet.",
  workoutChallengeInfoModalRule4: "Samla pass, bygg en streak och klättra i träningsnivåer!",
  workoutChallengeInfoModalTipsLabel: "Tips:",
  workoutChallengeInfoModalTipsText: "Lyssna på kroppen, anpassa övningar om det behövs och ha roligt! Fokusera på teknik före hastighet.",
  
  // Fallback for general prompt (if context not workout or walking)
  generalPromptViewTitle: "Vad vill du göra nu?",

  // Walking Diploma View
  walkingDiplomaViewTitle: "Promenaddiplom",
  walkingDiplomaCongratulations: "GRATTIS, {name}!", 
  walkingDiplomaHeadlineUser: "Du har framgångsrikt slutfört följande promenaddag:",
  walkingDiplomaHeadlineGeneric: "Du har framgångsrikt slutfört följande promenaddag:",
  walkingDiplomaChallengeDayLabel: "Promenaddag:",
  walkingDiplomaStartTimeLabel: "Starttid:",
  walkingDiplomaEndTimeLabel: "Sluttid:",
  walkingDiplomaDurationLabel: "Total Promenadtid:",
  walkingDiplomaDateLabel: "Datum:",
  walkingDiplomaTimeLabel: "Promenadtid:", 
  walkingDiplomaLevelLabel: "Gångnivå uppnådd:",
  walkingDiplomaTotalDaysLabel: "Totalt antal dagar vid denna tidpunkt:",
  walkingDiplomaStreakLabel: "Promenadstreak vid denna tidpunkt:",
  walkingDiplomaDistanceLabel: "Din distans:",
  walkingDiplomaStepsLabel: "Dina steg:",
  walkingDiplomaNewDistanceRecordText: "NYTT DISTANSREKORD!",
  walkingDiplomaPreviousBestDistanceText: "Tidigare:",
  walkingDiplomaNewStepsRecordText: "NYTT STEGREKORD!",
  walkingDiplomaPreviousBestStepsText: "Tidigare:",
  shareWalkingDiplomaButton: "Dela Promenaddiplom",
  closeDiplomaButtonAriaLabel: "Stäng diplom",
  shareWalkingDiplomaText: "Jag klarade promenaddag {challengeDay} den {date} kl {time}, nådde nivån '{levelName}' och har nu en streak på {streak} dagar i {hashtag}! 🚶‍♀️💨 Häng med i {appFullName}!",
  shareWalkingDiplomaNoStreakText: "Jag klarade promenaddag {challengeDay} den {date} kl {time} och nådde nivån '{levelName}' i {hashtag}! 🚶‍♂️👍 Upptäck {appFullName}!",

  // Generate Workout View (Bartender Theme)
  generateWorkoutViewTitle: "Flexibel Bartender: Din Träningscocktail", 
  generateWorkoutDescription: "Släpp loss din inre mixolog och låt vår Flexibel Bartender skaka ihop en unik träningscocktail, perfekt anpassad efter dina önskemål! Välj dina 'ingredienser' (träningspreferenser) nedan, så komponerar vi en uppfriskande och energigivande mix som får dig att känna dig på topp. Skål för din hälsa!",
  workoutTypeLabel: "Typ av cocktailbas:", 
  kettlebellOption: "Kettlebell Spirit", 
  bodyweightOption: "Bodyweight Mixer", 
  durationLabel: "Önskad styrka (minuter):", 
  focusLabel: "Smakprofil (fokus):", 
  fullBodyOption: "Helkropp Highball", 
  upperBodyOption: "Överkropp On The Rocks", 
  lowerBodyOption: "Underkropp Power Punch", 
  coreOption: "Core Collins", 
  difficultyLabel: "Intensitet:", 
  beginnerOption: "Lätt & Frisk", 
  intermediateOption: "Balanserad & Stark", 
  advancedOption: "Extra Kryddig", 
  formatLabel: "Serveringsstil (format):", 
  classicRoundsOption: "Klassiska Shots (Varv)", 
  emomOption: "EMOM Elixir", 
  amrapOption: "AMRAP Aperitif", 
  timeCapOption: "Time Cap Tonic", 
  generateButton: "Blanda min Träningscocktail!", 
  generatingWorkoutTitle: "Blandar din cocktail...", 
  generatingWorkoutMessage: "Din Flexibel Bartender skakar just nu ihop en fantastisk träningscocktail åt dig! Håll ut, snart är det dags att njuta av en uppiggande och stärkande mix!", 
  generatedWorkoutTitle: "Din Träningscocktail är Serverad!", 
  startGeneratedWorkoutButton: "Låt festen börja!", 
  discardAndRegenerateButton: "Blanda Ny Cocktail", 
  errorGeneratingWorkoutTitle: "Oops! Bartendern spillde lite...", 
  errorGeneratingWorkoutMessage: "Kunde tyvärr inte blanda en cocktail just nu. Försök igen om en liten stund eller justera dina ingredienser.", 
  errorInvalidResponse: "Bartendern verkar ha blandat ihop receptet (oväntat svar från AI). Prova en ny beställning!", 
  errorAIWorkoutMissingExercises: "Hoppsan! Bartendern kunde inte hitta alla ingredienser (övningar saknas i ett segment) till din cocktail. Prova en annan blandning eller försök igen!", 
  
  // Super-Delare Easter Egg (Enhanced)
  superSharerModalTitleEnhanced: "HEMLIG UTMÄRKELSE UPPLÅST! 🌟",
  superSharerModalMessage1Enhanced: "Helt otroligt, {name}! Du har delat appen 4 gånger och precis låst upp den hemliga utmärkelsen 'Stjärnspridare Deluxe' OCH en exklusiv belöning!",
  superSharerModalRewardDetails: "Som tack för ditt fantastiska engagemang får de **20 FÖRSTA 'Super-Delarna'** per studio chansen att hämta ut en **GRATIS NOCCO eller VITAMIN WELL!** 🥤",
  superSharerModalInstructionsAndCode: "Visa upp detta meddelande i receptionen på Flexibel Salem ELLER Flexibel Kärra. Säg (eller visa) den hemliga frasen: '**Jag är en Super-Delare och stjärna som sprider hälsa!**'",
  superSharerModalFinePrint: "Gäller så långt lagret räcker (totalt 20 drycker per studio). Max en dryck per Super-Delare. Först till kvarn!",

};

// --- BLOG AND SOCIAL MEDIA URLS ---
export const BLOG_URL = "https://www.flexibelfriskvardhalsa.se/blogg";
export const INSTAGRAM_URL = "https://www.instagram.com/flexibel.halsostudio/";
export const FACEBOOK_URL = "https://www.facebook.com/flexibelfh";

// ENCOURAGEMENT MESSAGES
export const ENCOURAGEMENT_MESSAGES = [
    "Bra jobbat!",
    "Fortsätt kämpa!",
    "Du är stark!",
    "Ge järnet!",
    "Heja dig!",
    "Vilken kämpe!",
    "Du klarar det!",
    "Snart i mål!",
    "Lite till!",
    "Grymt!"
];
export const PERSONALIZED_ENCOURAGEMENT_MESSAGES = [
    "Kom igen nu, {name}!",
    "{name}, du är en stjärna!",
    "Kör hårt, {name}!",
    "Du fixar det här, {name}!",
    "Imponerande, {name}!"
];
