
import React, { useState, useEffect } from 'react';
import { View, Level, WorkoutLogEntry, DiplomaData, Workout, WalkingLogEntry, WalkingDiplomaData, AchievementDefinition, AchievementCategory, AchievementCheckData } from '../types';
import { APP_STRINGS, WORKOUTS, WALKING_CHALLENGE_TOTAL_DAYS, WALKING_LEVEL_DEFINITIONS, ACHIEVEMENT_DEFINITIONS } from '../constants';
import { ArrowLeftIcon, UserIcon, EditIcon, CertificateIcon, ShareIcon, StarIcon, FootstepsIcon, InformationCircleIcon, CheckCircleIcon, TrophyIcon } from '../components/Icons';
import * as localStorageService from '../services/localStorageService';
import { Button } from '../components/Button';
import { truncateText } from '../utils/textUtils';
import { getEarnedAchievementIds } from '../services/achievementService';


interface ProfileViewProps {
  onNavigate: (view: View, data?: any) => void;
  userName: string | null;
  onNameSave: (name: string) => void;
  totalWorkoutsCompleted: number; 
  currentWorkoutLevel: Level; 
  walkingChallengeCurrentDay: number;
  currentWalkingChallengeLevel: Level | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  userName,
  onNameSave,
  totalWorkoutsCompleted, 
  currentWorkoutLevel, 
  walkingChallengeCurrentDay,
  currentWalkingChallengeLevel,
}) => {
  const [newName, setNewName] = useState(userName || '');
  const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([]);
  const [walkingChallengeLog, setWalkingChallengeLog] = useState<WalkingLogEntry[]>([]);

  useEffect(() => {
    const loadProfileData = () => {
      setNewName(userName || '');
      const currentWorkoutLog = localStorageService.getWorkoutLog();
      const currentWalkingLog = localStorageService.getWalkingLog();
      const favoriteIds = localStorageService.getFavoriteWorkoutIds();
      
      setWorkoutLog(currentWorkoutLog);
      
      const favoritedGeneratedWorkouts = localStorageService.getFavoritedGeneratedWorkouts(); // Renamed from getFavoritedAIWorkouts
      const combinedFavoriteWorkouts = favoriteIds.map(id => {
        const predefinedWorkout = WORKOUTS.find(w => w.id === id);
        if (predefinedWorkout) {
          return predefinedWorkout;
        }
        if (id.startsWith('generated-')) {
          return favoritedGeneratedWorkouts.find(w => w.id === id);
        }
        return null;
      }).filter(Boolean) as Workout[];
      setFavoriteWorkouts(combinedFavoriteWorkouts);
      
      setWalkingChallengeLog(currentWalkingLog);

      if (!userName) { 
          setIsEditingName(false);
      }
    };
    loadProfileData();
  }, [userName, totalWorkoutsCompleted, currentWorkoutLevel, walkingChallengeCurrentDay, currentWalkingChallengeLevel]);

  const handleEditName = () => {
    setNewName(userName || ''); 
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setNewName(userName || ''); 
    setIsEditingName(false);
  };

  const handleSaveProfile = () => {
    if (newName.trim() && newName.trim() !== userName) {
      onNameSave(newName.trim());
    }
    setIsEditingName(false);
  };

  const handleViewWorkoutDiploma = (logEntry: WorkoutLogEntry) => {
    if (!logEntry.dateCompleted || !logEntry.timeCompleted) {
      console.error("Workout log entry is missing date or time", logEntry);
      return;
    }
    
    const dateParts = logEntry.dateCompleted.split('-').map(Number);
    const timeParts = logEntry.timeCompleted.split(':').map(Number);

    if (dateParts.length !== 3 || timeParts.length !== 2 || dateParts.some(isNaN) || timeParts.some(isNaN)) {
        console.error("Invalid date or time format in workout log entry", logEntry);
        return;
    }
    
    const [year, month, day] = dateParts;
    const [hours, minutes] = timeParts;
    const completionDateTime = new Date(year, month - 1, day, hours, minutes);

    const diplomaData: DiplomaData = {
      workoutTitle: logEntry.workoutTitle,
      userName: userName, 
      levelName: logEntry.levelNameAtCompletion,
      completionDateTime: completionDateTime,
      totalWorkoutsCompleted: totalWorkoutsCompleted,
      comment: logEntry.comment,
      didLevelUp: false, 
      score: logEntry.score,
      isNewRecord: false, 
      previousBestScore: undefined,
    };
    onNavigate(View.Diploma, diplomaData);
  };

  const handleViewWalkingDiploma = (logEntry: WalkingLogEntry) => {
    const diplomaData: WalkingDiplomaData = {
      userName: userName,
      challengeDayCompleted: logEntry.challengeDay,
      logTimestamp: logEntry.logTimestamp, // Use the log entry's timestamp
      actualStartTimestamp: logEntry.actualStartTime ? new Date(logEntry.actualStartTime).getTime() : undefined,
      walkingLevelNameAtCompletion: logEntry.levelNameAtCompletion,
      totalWalkingDaysAtThisPoint: logEntry.challengeDay, 
      walkingStreakAtThisPoint: logEntry.streakAtCompletion,
      didLevelUp: false, 
      distance: logEntry.distance,
      steps: logEntry.steps,
      isNewDistanceRecord: false,
      previousBestDistance: undefined,
      isNewStepsRecord: false,
      previousBestSteps: undefined,
      durationMinutes: logEntry.durationMinutes,
      comment: logEntry.comment,
    };
    onNavigate(View.WalkingDiploma, diplomaData);
  };
  
  const getNextWalkingLevelInfo = () => {
    if (!currentWalkingChallengeLevel) return null;
    const currentLvlIdx = WALKING_LEVEL_DEFINITIONS.findIndex(l => l.name === currentWalkingChallengeLevel.name);
    const nextLvlDef = (currentLvlIdx !== -1 && currentLvlIdx < WALKING_LEVEL_DEFINITIONS.length - 1)
      ? WALKING_LEVEL_DEFINITIONS[currentLvlIdx + 1]
      : null;

    if (nextLvlDef && nextLvlDef.minDays !== undefined && currentWalkingChallengeLevel.minDays !== undefined) {
        const daysNeededForNextSpan = nextLvlDef.minDays - currentWalkingChallengeLevel.minDays;
        const daysMadeInCurrentSpan = walkingChallengeCurrentDay - currentWalkingChallengeLevel.minDays;
        const percentage = daysNeededForNextSpan > 0 ? Math.max(0, Math.min(100,(daysMadeInCurrentSpan / daysNeededForNextSpan) * 100)) : (daysMadeInCurrentSpan >=0 ? 100 :0) ;
        return {
            nextLevelDef: nextLvlDef,
            daysToNextLevel: Math.max(0, nextLvlDef.minDays - walkingChallengeCurrentDay),
            percentageToNext: percentage
        };
    }
    return null;
  };
  const nextWalkingLevelDisplayInfo = getNextWalkingLevelInfo();


  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-800">
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
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#418484] flex items-center justify-center">
          <UserIcon className="w-8 h-8 mr-3 text-[#51A1A1]" />
          {APP_STRINGS.profileViewTitle}
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mb-8">
        <div className="mb-6 text-center">
          <UserIcon className="w-20 h-20 text-[#62BDBD] mx-auto mb-3" />
          {!isEditingName && (
            <div className="flex items-center justify-center">
              <p className="text-2xl font-semibold text-gray-700 mr-2">{userName || 'Användare'}</p>
              <button
                onClick={handleEditName}
                className="p-1 text-[#51A1A1] hover:text-[#316767] rounded-full hover:bg-gray-200 transition-colors"
                title={APP_STRINGS.editNameTooltip}
                aria-label={APP_STRINGS.editNameTooltip}
              >
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {isEditingName && (
          <div className="space-y-4 pt-4 mt-4 border-t border-gray-200">
            <div>
              <label htmlFor="profileNameInput" className="block text-sm font-medium text-gray-700 mb-1">
                {APP_STRINGS.changeNameLabelInProfile}
              </label>
              <input
                id="profileNameInput"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={APP_STRINGS.enterYourNameInputLabel} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#51A1A1] focus:border-[#51A1A1] text-lg bg-white text-gray-800 placeholder-gray-500"
                autoFocus
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleSaveProfile}
                className="w-full text-lg py-3"
                disabled={!newName.trim() || newName.trim() === userName}
              >
                {APP_STRINGS.saveProfileButton}
              </Button>
              <Button
                onClick={handleCancelEditName}
                variant="secondary"
                className="w-full text-lg py-3"
              >
                {APP_STRINGS.cancelButton}
              </Button>
            </div>
          </div>
        )}

        <div className={`mt-6 pt-6 border-t border-gray-200 ${isEditingName ? 'mt-4 pt-4' : ''}`}>
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2 text-sky-500"/>
                {APP_STRINGS.profileDataStorageInfoTitle}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
                {APP_STRINGS.profileDataStorageInfoText}
            </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold text-sky-700 mb-4 flex items-center">
          <FootstepsIcon className="w-6 h-6 mr-2 text-sky-500"/>
          {APP_STRINGS.profileWalkingChallengeTitle}
        </h2>
        {walkingChallengeCurrentDay > 0 ? (
          <>
            <p className="text-gray-700 mb-1">
              {APP_STRINGS.walkingChallengeDayDisplay
                .replace('{day}', walkingChallengeCurrentDay.toString())
                .replace('{totalDays}', WALKING_CHALLENGE_TOTAL_DAYS.toString())}
            </p>
            {currentWalkingChallengeLevel && (
              <p className="text-gray-700 mb-1">
                {APP_STRINGS.walkingChallengeCurrentLevelLabel}: <span className="font-semibold text-purple-600">{currentWalkingChallengeLevel ? truncateText(currentWalkingChallengeLevel.name, 10) : '-'}</span>
              </p>
            )}
            {nextWalkingLevelDisplayInfo && nextWalkingLevelDisplayInfo.nextLevelDef && nextWalkingLevelDisplayInfo.daysToNextLevel > 0 && walkingChallengeCurrentDay < WALKING_CHALLENGE_TOTAL_DAYS && (
              <div className="mt-2 mb-3">
                <p className="text-xs text-purple-600 mb-1">
                  {APP_STRINGS.daysToNextWalkingLevelText
                    .replace('{count}', nextWalkingLevelDisplayInfo.daysToNextLevel.toString())
                    .replace('{levelName}', truncateText(nextWalkingLevelDisplayInfo.nextLevelDef.name, 10))}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${nextWalkingLevelDisplayInfo.percentageToNext}%` }}
                    aria-label={`Framsteg till nästa gångnivå: ${nextWalkingLevelDisplayInfo.percentageToNext.toFixed(0)}%`}
                  ></div>
                </div>
              </div>
            )}
             {walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && (
                <p className="text-lg font-semibold text-green-600 flex items-center mt-2">
                    <StarIcon className="w-5 h-5 mr-2 text-yellow-400" solid/>
                    {APP_STRINGS.walkingChallengeAllDaysCompleted}
                </p>
            )}

            <h3 className="text-md font-semibold text-sky-600 mt-4 mb-2">{APP_STRINGS.profileWalkingChallengeLogTitle}</h3>
            {walkingChallengeLog.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 border-t pt-2">
                {walkingChallengeLog.map((entry, index) => (
                  <li key={`walk-log-${index}`} className="text-sm text-gray-600">
                    {APP_STRINGS.profileWalkingDayCompleted.replace('{day}', entry.challengeDay.toString())} - {new Date(entry.dateCompleted).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {entry.distance && <span className="ml-2 text-xs">({APP_STRINGS.profileWalkingLogDistanceLabel} {entry.distance} km)</span>}
                    {entry.steps && <span className="ml-2 text-xs">({APP_STRINGS.profileWalkingLogStepsLabel} {entry.steps} steg)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">{APP_STRINGS.profileNoWalkingLogEntries}</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">{APP_STRINGS.profileNoWalkingLogEntries} Starta utmaningen från hemskärmen!</p>
        )}
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold text-sky-700 mb-4 flex items-center">
          <CertificateIcon className="w-6 h-6 mr-2 text-sky-500"/>
          {APP_STRINGS.profileMinaPromenadDiplomTitle}
        </h2>
        {walkingChallengeLog.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {walkingChallengeLog.map((entry, index) => (
              <li key={`walk-diploma-${index}`} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sky-600">Promenaddag {entry.challengeDay}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.logTimestamp).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                     <p className="text-xs text-gray-500">Nivå då: {truncateText(entry.levelNameAtCompletion, 10)}</p>
                     {entry.streakAtCompletion > 0 && <p className="text-xs text-gray-500">Streak: {entry.streakAtCompletion} dagar</p>}
                     {entry.distance && <p className="text-xs text-gray-500">{APP_STRINGS.profileWalkingLogDistanceLabel} {entry.distance} km</p>}
                     {entry.steps && <p className="text-xs text-gray-500">{APP_STRINGS.profileWalkingLogStepsLabel} {entry.steps} steg</p>}
                  </div>
                  <Button
                    onClick={() => handleViewWalkingDiploma(entry)}
                    variant="ghost"
                    className="py-1 px-2 text-sm flex items-center text-sky-600 hover:text-sky-700"
                    title={APP_STRINGS.diplomaLogEntryButton}
                  >
                    <ShareIcon className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">{APP_STRINGS.diplomaLogEntryButton}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">{APP_STRINGS.profileNoPromenadDiplom}</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold text-[#316767] mb-4 flex items-center">
          <CertificateIcon className="w-6 h-6 mr-2 text-[#51A1A1]" />
          {APP_STRINGS.profileDiplomasTitle} (Träningspass)
        </h2>
        {workoutLog.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {workoutLog.map((entry, index) => (
              <li key={`workout-diploma-${index}`} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#418484]">{entry.workoutTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.completionTimestamp).toLocaleString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                     <p className="text-xs text-gray-500">Nivå då: {truncateText(entry.levelNameAtCompletion, 10)}</p>
                     {entry.score && <p className="text-xs text-gray-600 mt-1">Resultat: {entry.score}</p>}
                     {entry.comment && <p className="text-xs text-gray-600 mt-1 italic">"{entry.comment}"</p>}
                  </div>
                  <Button
                    onClick={() => handleViewWorkoutDiploma(entry)}
                    variant="ghost"
                    className="py-1 px-2 text-sm flex items-center"
                    title={APP_STRINGS.diplomaLogEntryButton}
                  >
                    <ShareIcon className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">{APP_STRINGS.diplomaLogEntryButton}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">{APP_STRINGS.profileNoDiplomas}</p>
        )}
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-[#316767] mb-4 flex items-center">
          <StarIcon className="w-6 h-6 mr-2 text-yellow-400" solid/>
          {APP_STRINGS.profileFavoriteWorkoutsTitle}
        </h2>
        {favoriteWorkouts.length > 0 ? (
          <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {favoriteWorkouts.map((favWorkout) => (
              <li key={favWorkout.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#418484]">{favWorkout.title}</p>
                    <p className="text-xs text-gray-500">{favWorkout.type === 'kettlebell' ? 'Kettlebell' : 'Kroppsvikt'} - {favWorkout.totalEstimatedTimeMinutes} min</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onNavigate(View.WorkoutDetail, favWorkout)}
                      variant="ghost"
                      className="py-1 px-2 text-sm"
                      title={APP_STRINGS.viewWorkoutButton}
                    >
                      {APP_STRINGS.viewWorkoutButton}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">{APP_STRINGS.profileNoFavoriteWorkouts}</p>
        )}
      </div>
    </div>
  );
};
