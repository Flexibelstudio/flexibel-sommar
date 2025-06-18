
import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { View, Workout, WorkoutGenerationParams, WorkoutFormat, ExercisePhaseType, TimedSegment } from '../types';
import { APP_STRINGS, PREPARE_SEGMENT, KB_EXERCISES_LIST, BW_EXERCISES_LIST } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, SparklesIcon, DrinkIcon } from '../components/Icons'; // Changed UserIcon to DrinkIcon
import { WorkoutDetailView } from './WorkoutDetailView';
import { SimpleModal } from '../components/SimpleModal';
import * as audioService from '../services/audioService';
import * as analyticsService from '../services/analyticsService'; // Import analytics service

interface GenerateWorkoutViewProps {
  onNavigate: (view: View, data?: any) => void;
  userName: string | null;
}

const BARTENDER_SECRET_CLICK_THRESHOLD = 7;

export const GenerateWorkoutView: React.FC<GenerateWorkoutViewProps> = ({ onNavigate, userName }) => {
  const [params, setParams] = useState<WorkoutGenerationParams>({
    type: 'kettlebell',
    duration: 15,
    focus: 'helkropp',
    difficulty: 'Medel',
    format: WorkoutFormat.CLASSIC_ROUNDS,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Easter Egg State
  const [drinkIconClickCount, setDrinkIconClickCount] = useState(0);
  const [showBartenderSecretModal, setShowBartenderSecretModal] = useState(false);

  const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) : value,
    }));
  };

  const handleDrinkIconClick = () => {
    const newCount = drinkIconClickCount + 1;
    setDrinkIconClickCount(newCount);
    if (newCount >= BARTENDER_SECRET_CLICK_THRESHOLD) {
      audioService.playConfettiSound(); // Re-using confetti sound for general positive feedback
      setShowBartenderSecretModal(true);
      setDrinkIconClickCount(0); // Reset for next time
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedWorkout(null);
    let jsonStr = ""; 

    // GA Event: generate_workout_request
    analyticsService.trackEvent('generate_workout_request', { // Renamed event
        event_category: 'generation_feature', // Renamed category
        event_action: 'submit_generation_params',
        generated_workout_type: params.type, // Renamed parameter
        generated_workout_duration: params.duration, // Renamed parameter
        generated_workout_focus: params.focus, // Renamed parameter
        generated_workout_difficulty: params.difficulty, // Renamed parameter
        generated_workout_format: params.format, // Renamed parameter
    });

    let advancedExerciseInstruction = "";
    if (params.type === 'kettlebell' && params.difficulty === 'Avancerad') {
      advancedExerciseInstruction = "For an 'Avancerad' (Advanced) kettlebell cocktail, be sure to include some premium 'ingredients' like Kettlebell Cleans (single or double), Kettlebell Snatches, Kettlebell Turkish Get-ups, Kettlebell Halos, and Kettlebell Overhead Swings. Blend these expertly with other ingredients for a potent and well-rounded advanced cocktail appropriate for the duration and focus.";
    }
    
    const kettlebellExerciseNames = KB_EXERCISES_LIST.map(e => e.name).join(', ');
    const bodyweightExerciseNames = BW_EXERCISES_LIST.map(e => e.name).join(', ');

    const systemInstruction = `
VERY IMPORTANT JSON RULES:
1.  The entire output MUST be a single, valid JSON object.
2.  Do NOT use any markdown formatting like \`\`\`json ... \`\`\` or any other text outside the JSON structure.
3.  ALL string values in the JSON, including keys and all textual content (titles, descriptions, names, instructions, array elements that are strings, etc.), MUST be enclosed in double quotes (e.g., "example string").
4.  Commas (,) are required between key-value pairs in an object and between elements in an array.
5.  A comma is NOT ALLOWED after the last key-value pair in an object or the last element in an array.
6.  Numbers (like 'durationSeconds', 'totalEstimatedTimeMinutes', 'currentRound', 'totalRounds') should be plain numbers (e.g., 15, 60), not enclosed in quotes.
7.  Boolean values should be plain true or false, not enclosed in quotes.
8.  If an optional field (e.g., 'reps', 'durationSeconds' within an exercise, 'roundsText', 'currentRound', 'totalRounds' in a segment) is not included or not applicable, it should be completely omitted from the JSON. Do not set it to null or undefined.
9.  Empty optional arrays (like "tags") MUST be represented as an empty array: []. However, for 'WORK' type segments in 'AMRAP', 'EMOM', and 'TIME_CAP' formats, the 'exercises' array MUST NOT be empty, MUST contain at least one exercise object, and should list the exercises (ingredients) to be performed for that segment/circuit/task.
10. If a string value itself needs to contain a double quote character (e.g., as part of an instruction or name), that double quote MUST be escaped using a backslash, like so: \`\\\". For example, \`"instructions": "Jump \\\"high\\\"!"\`.

You are a charismatic and expert 'Flexibel Bartender' at 'Flexibel Bar', known for mixing potent and energizing 'Training Cocktails'.
Your creations are legendary for making people feel fantastic and full of summer vitality.
Your language is always positive, witty, and encouraging. You celebrate the 'customer's' choice of 'ingredients' (parameters) and 'mix' with flair.
Your tone should be supportive, motivating, and reflect a passion for health and an active summer lifestyle, much like the team at Flexibel.
You create 'Training Cocktails' that are effective, well-balanced, and often have fun, summery names (e.g., using words like "Solstråle", "Strand", "Sommarbris", "Pepp").
Always prioritize safety and good form in your 'ingredient' choices and mixing instructions.
Use encouraging and "Flexibel"-style peppy language in the cocktail's "detailedDescription". For example: "Denna uppfriskande helkropps-cocktail är skakad, inte rörd, för att ge dig en endorfin-kick! Perfekt för att väcka kroppen och fånga sommarens energi. Skål för din styrka!".
For REST segments, segment "name" should be "Sippaus". Segment "instructions" should use encouraging phrases like "Liten sippaus vila nu!", "Hämta andan, snart dags för nästa shot av energi!", or "Njut av pausen, din cocktail blir bara bättre!".
For WORK segments, 'instructions' should be motivating and task-focused (e.g., 'Ingrediens: [Exercise Name], [duration/reps]. Mixa med kraft!', or 'Dags för [X] sekunder av [Exercise Name] – känn hur det skakar (på ett bra sätt)!' for EMOM work intervals).

IMPORTANT: Do not use the word 'Russian' in any exercise names. For example, instead of 'Russian Twists', use 'Kettlebell Twists' or 'Core Twists'. Instead of 'Russian Swings', use 'Kettlebell Swings' (for swings to chest/eye level) or 'Kettlebell Overhead Swings' (if the movement goes fully overhead).

The JSON object MUST conform to the following structure. Do NOT deviate from this structure.
{
  "title": "string (Swedish, descriptive cocktail name, e.g., 'Kettlebell Styrka Slammer', 'Solskens-Sweat Spritzer', MUST be enclosed in double quotes)",
  "shortTitle": "string (Swedish, short cocktail name, e.g., 'KB Slammer', 'Sol Spritzer', MUST be enclosed in double quotes)",
  "type": "string, MUST be exactly '${params.type}' (enclosed in double quotes)",
  "format": "string, MUST be exactly '${params.format}' (enclosed in double quotes)",
  "detailedDescription": "string (Swedish, detailed description of the cocktail, its effects, and goal, tailored to user's choices, using Flexibel Bartender's encouraging tone, MUST be enclosed in double quotes)",
  "exerciseSummaryList": [ { "name": "string (Swedish, ingredient/exercise name, MUST be enclosed in double quotes)", "details": "string (e.g., '10 stänk', '30s infusion', MUST be enclosed in double quotes)" } ],
  "totalEstimatedTimeMinutes": ${params.duration},
  "timedSegments": [
    {
      "name": "string (Swedish, segment name, e.g., ingredient/exercise name for WORK, or 'Sippaus', 'Energipaus', MUST be enclosed in double quotes)",
      "type": "string, MUST be one of these exact values: 'WORK' | 'REST' (enclosed in double quotes)",
      "durationSeconds": "number (duration of this specific segment/ingredient)",
      "instructions": "string (Swedish, general instructions for the segment. See notes above for WORK and REST segments. MUST be enclosed in double quotes)",
      "exercises": [ // For WORK segments in AMRAP, EMOM, TIME_CAP, this array MUST NOT be empty and MUST contain at least one exercise object.
        {
          "name": "string (Swedish, ingredient/exercise name, MUST be enclosed in double quotes)",
          "reps": "string (optional, e.g., '10 stänk', 'Max stänk', if present, MUST be enclosed in double quotes)",
          "durationSeconds": "number (optional, for a hold or timed ingredient)",
          "instructions": "string (optional, Swedish, specific mixing cue for this ingredient, e.g., 'Håll ryggen rak, explosiv höftrörelse. Du är en stjärnmixolog!', if present, MUST be enclosed in double quotes)"
        }
      ],
      "currentRound": "number (optional, for CLASSIC_ROUNDS, if applicable per segment, 1-indexed)",
      "totalRounds": "number (optional, for CLASSIC_ROUNDS, if applicable per segment)"
    }
  ],
  "roundsText": "string (optional, Swedish, e.g., '3 uppiggande shots', only for CLASSIC_ROUNDS format if the entire cocktail is structured in main rounds, if present, MUST be enclosed in double quotes)",
  "difficultyLevel": "string, MUST be exactly '${params.difficulty}' (enclosed in double quotes)",
  "tags": ["string (Swedish, lowercase, relevant to choices, e.g., 'helkropp', 'energi-boost', 'flexibel-finish', each tag MUST be enclosed in double quotes)"]
}

Use Swedish for ALL textual content.
Prioritize exercise names (ingredients) from these lists if suitable, otherwise create clear Swedish names:
Kettlebell Exercises: ${kettlebellExerciseNames}
Bodyweight Exercises: ${bodyweightExerciseNames}
${advancedExerciseInstruction}

For 'CLASSIC_ROUNDS' (Klassiska Shots), 'timedSegments' should alternate WORK and REST. 'totalRounds' in a segment refers to sub-rounds within that segment if applicable, while 'roundsText' at the top level refers to main rounds of the whole cocktail.
For 'EMOM' (EMOM Elixir - Every Minute On the Minute):
   - Each 'timedSegment' of type 'WORK' represents one full minute, so its 'durationSeconds' MUST be 60.
   - The 'exercises' array within this 'WORK' segment MUST list the specific ingredient(s) to be performed *within* that minute. For each ingredient in this array, you MUST specify either 'reps' (e.g., "10 stänk") or a 'durationSeconds' (e.g., for a hold, or work interval like "40s infusion").
   - The workload you define for the ingredients within the minute should be challenging but realistically allow for approximately 15-25 seconds of rest before the next minute begins.
   - The 'instructions' field for the 'WORK' segment (the minute itself) MUST clearly state this pattern, e.g., "Serveras varje minut: [X stänk av Ingrediens A]. Vila resten av minuten och njut!" or "Jobba med [Ingrediens A] i 40 sekunder. Vila resten av minuten. Känn hur det spritter!".
   - The 'exerciseSummaryList' should reflect the ingredients and their typical reps/work duration per minute.
For 'AMRAP' (AMRAP Aperitif), typically one main 'WORK' segment; its 'durationSeconds' is the total AMRAP time (which is 'totalEstimatedTimeMinutes' * 60). The 'instructions' for this segment should state the AMRAP goal (e.g., "Så många cocktails (varv) och ingredienser (repetitioner) som möjligt (AMRAP) av följande på ${params.duration} minuter:"). The 'exercises' array within this WORK segment MUST NOT be empty and MUST contain at least one exercise object listing all ingredients in the circuit.
For 'TIME_CAP' (Time Cap Tonic), 'totalEstimatedTimeMinutes' is the cap. 'timedSegments' describe tasks. The main WORK segment(s) for TIME_CAP should have 'durationSeconds' of 0 if the segment represents a task to be completed for time; the overall timer manages the cap. The 'instructions' for these WORK segments should clearly describe the overall task (e.g., "Mixa följande 3 cocktails (varv) så snabbt som möjligt inom tidsgränsen:"). The main 'WORK' segment(s) representing the task(s) to be completed MUST have a non-empty 'exercises' array, containing at least one exercise object, listing all ingredients for that task.
Ensure exercise instructions (mixing cues within 'exercises' array objects) are helpful and encouraging.
Do NOT include a 'PREPARE' segment in the 'timedSegments' array you generate. The frontend will add this.
The 'exerciseSummaryList' should give a concise overview of main ingredients and their typical load/duration.
Make sure the generated cocktail feels like it's from 'Flexibel Bar'! Keep instructions positive and motivating.
Every string value MUST be in double quotes. Numbers and booleans MUST NOT be in quotes.
If format is CLASSIC_ROUNDS and it has multiple main rounds, the 'roundsText' field should indicate this (e.g., "3 uppiggande shots").
`;

    const userPrompt = `
Generate a workout cocktail with these parameters following ALL rules in the system instruction:
- Base: ${params.type}
- Strength (duration): ${params.duration} minutes
- Flavor Profile (focus): ${params.focus}
- Intensity (difficulty): ${params.difficulty}
- Serving Style (format): ${params.format}
`;

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        },
      });

      jsonStr = response.text.trim(); 
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (!parsedData.title || !parsedData.timedSegments || parsedData.totalEstimatedTimeMinutes !== params.duration) {
        console.error("Generated data missing required fields, has invalid structure, or mismatched duration:", parsedData);
        throw new Error(APP_STRINGS.errorInvalidResponse);
      }

      if (parsedData.format === WorkoutFormat.AMRAP || parsedData.format === WorkoutFormat.EMOM || parsedData.format === WorkoutFormat.TIME_CAP) {
        const workSegments = parsedData.timedSegments.filter((seg: TimedSegment) => seg.type === ExercisePhaseType.WORK);
        for (const segment of workSegments) {
          if (!segment.exercises || segment.exercises.length === 0) {
            console.error(`Generated ${parsedData.format} workout has a WORK segment with no exercises:`, segment, "Full data:", parsedData);
            throw new Error(APP_STRINGS.errorGeneratedWorkoutMissingExercises); // Renamed error constant
          }
        }
      }
      
      const workoutFromGenerator: Omit<Workout, 'id'> = parsedData; // Renamed
      const generatedId = `generated-${Date.now()}`;

      const finalWorkout: Workout = {
        ...workoutFromGenerator, // Renamed
        id: generatedId, 
        type: params.type, 
        timedSegments: [ 
          PREPARE_SEGMENT, 
          ...(workoutFromGenerator.timedSegments || []) // Renamed
        ],
      };
      setGeneratedWorkout(finalWorkout);

      // GA Event: generate_workout_success
      analyticsService.trackEvent('generate_workout_success', { // Renamed event
          event_category: 'generation_feature', // Renamed category
          event_action: 'generation_success',
          generated_workout_id: generatedId, // Renamed parameter
          generated_workout_type: params.type, // Renamed parameter
          generated_workout_duration: params.duration, // Renamed parameter
          generated_workout_focus: params.focus, // Renamed parameter
          generated_workout_difficulty: params.difficulty, // Renamed parameter
          generated_workout_format: params.format, // Renamed parameter
      });

    } catch (err: any) {
      console.error("Error generating workout cocktail:", err);
      let detailedErrorMessage = err.message || APP_STRINGS.errorGeneratingWorkoutMessage;
      if (err instanceof SyntaxError) {
          detailedErrorMessage = `Fel vid tolkning av svar (JSON SyntaxError): ${err.message}. Försök igen, eller kontrollera bartenderns recept. Recept: ${jsonStr ? jsonStr.substring(0, 500) : "[Inget recept mottaget eller fel innan tolkning]"}`; // Removed AI
      } else if (detailedErrorMessage.includes("API key not valid")) {
          detailedErrorMessage = "API-nyckeln är ogiltig. Kontrollera barens licens.";
      } else if (err.message === APP_STRINGS.errorGeneratedWorkoutMissingExercises) { // Renamed error constant
          detailedErrorMessage = APP_STRINGS.errorGeneratedWorkoutMissingExercises; // Renamed error constant
      }
      setError(detailedErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = (name: string, label: string, value: string | number, options: {value: string | WorkoutFormat, label: string}[]) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleParamChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#51A1A1] focus:border-[#51A1A1] bg-white text-gray-800"
      >
        {options.map(opt => <option key={opt.value.toString()} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-pink-50 text-pink-700"> {/* Thematic loading colors */}
        <DrinkIcon className="w-20 h-20 mb-6 text-pink-500 flexibel-ai-loading-animation" /> {/* Updated icon and animation class */}
        <h2 className="text-3xl font-semibold mb-2">{APP_STRINGS.generatingWorkoutTitle}</h2>
        <p className="text-lg">{APP_STRINGS.generatingWorkoutMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-50 text-red-700">
        <h2 className="text-3xl font-semibold mb-2">{APP_STRINGS.errorGeneratingWorkoutTitle}</h2>
        <p className="text-lg mb-6">{error}</p>
        <Button onClick={() => { setError(null); setIsLoading(false); setGeneratedWorkout(null); }} variant="secondary">
          Försök Blanda Igen
        </Button>
      </div>
    );
  }

  if (generatedWorkout) {
    return (
      <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-800">
         <div className="flex items-center justify-between mt-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#418484] flex items-center">
                <SparklesIcon className="w-8 h-8 mr-3 text-pink-500" /> {/* Thematic icon color */}
                {APP_STRINGS.generatedWorkoutTitle}
            </h1>
            <Button onClick={() => { setGeneratedWorkout(null); }} variant="ghost" className="text-sm text-red-500 hover:text-red-700">
              {APP_STRINGS.discardAndRegenerateButton}
            </Button>
        </div>
        {/* Pass "Starta Detta Pass" or a thematic variant like "Drick Cocktailen!" to WorkoutDetailView button if needed */}
        <WorkoutDetailView workout={{...generatedWorkout, title: generatedWorkout.title, shortTitle: generatedWorkout.shortTitle }} onNavigate={onNavigate} />
      </div>
    );
  }
  

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-800">
      {/* Container for the back button, ensuring it's on its own line */}
      <div className="w-full flex justify-start mt-2 mb-3">
        <Button
          onClick={() => onNavigate(View.Home)}
          variant="ghost"
          className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
          aria-label={APP_STRINGS.backToHome}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{APP_STRINGS.backToHome}</span>
        </Button>
      </div>

      {/* Container for the title, ensuring it's centered and below the button */}
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#418484] flex items-center justify-center">
          <div 
            onClick={handleDrinkIconClick}
            className="cursor-pointer p-1 rounded-full hover:bg-pink-100 transition-colors"
            title="Klicka för en överraskning..."
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDrinkIconClick();}}
          >
            <DrinkIcon className="w-8 h-8 text-pink-500" />
          </div>
          <span className="ml-3">{APP_STRINGS.generateWorkoutViewTitle}</span>
        </h1>
      </div>
      
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg mx-auto">
        <p className="text-gray-600 mb-6 text-center text-lg">{APP_STRINGS.generateWorkoutDescription}</p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {renderSelect('type', APP_STRINGS.workoutTypeLabel, params.type, [
            { value: 'kettlebell', label: APP_STRINGS.kettlebellOption },
            { value: 'bodyweight', label: APP_STRINGS.bodyweightOption },
          ])}

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">{APP_STRINGS.durationLabel}</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={params.duration}
              onChange={handleParamChange}
              min="15"
              max="60"
              step="5"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#51A1A1] focus:border-[#51A1A1] bg-white text-gray-800"
            />
          </div>

          {renderSelect('focus', APP_STRINGS.focusLabel, params.focus, [
            { value: 'helkropp', label: APP_STRINGS.fullBodyOption },
            { value: 'överkopp', label: APP_STRINGS.upperBodyOption },
            { value: 'underkropp', label: APP_STRINGS.lowerBodyOption },
            { value: 'core', label: APP_STRINGS.coreOption },
          ])}

          {renderSelect('difficulty', APP_STRINGS.difficultyLabel, params.difficulty, [
            { value: 'Nybörjare', label: APP_STRINGS.beginnerOption },
            { value: 'Medel', label: APP_STRINGS.intermediateOption },
            { value: 'Avancerad', label: APP_STRINGS.advancedOption },
          ])}
          
          {renderSelect('format', APP_STRINGS.formatLabel, params.format, [
            { value: WorkoutFormat.CLASSIC_ROUNDS, label: APP_STRINGS.classicRoundsOption },
            { value: WorkoutFormat.EMOM, label: APP_STRINGS.emomOption },
            { value: WorkoutFormat.AMRAP, label: APP_STRINGS.amrapOption },
            { value: WorkoutFormat.TIME_CAP, label: APP_STRINGS.timeCapOption },
          ])}

          <Button type="submit" className="w-full text-lg py-3.5 bg-pink-500 hover:bg-pink-600 border-pink-600 active:bg-pink-700 flex items-center justify-center"> {/* Thematic button color */}
            <SparklesIcon className="w-5 h-5 mr-2" />
            {APP_STRINGS.generateButton}
          </Button>
        </form>
      </div>
      {showBartenderSecretModal && (
        <SimpleModal
          isOpen={showBartenderSecretModal}
          onClose={() => setShowBartenderSecretModal(false)}
          title="Flexibel Bartenderns Hemliga Elixir:"
        >
          <div className="text-left space-y-2 text-gray-700">
            <p className="font-semibold">Ingredienser:</p>
            <ul className="list-disc list-inside pl-4">
              <li>1 del Morgonpiggelin</li>
              <li>2 stänk Svettpärlor</li>
              <li>En nypa Endorfin-eufori</li>
              <li>Toppas med Sommarsol</li>
            </ul>
            <p className="mt-3">Mixa med ett leende och servera omedelbart!</p>
            <p className="font-semibold text-pink-600 text-center mt-2">Skål för din superstyrka!</p>
          </div>
        </SimpleModal>
      )}
    </div>
  );
};
