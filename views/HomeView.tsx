
import React, { useState, useEffect, useRef } from 'react';
import { Workout, View, Level, SummerStatusLevel } from '../types';
import { WORKOUTS, APP_STRINGS, DAILY_EXTRAS, WALKING_CHALLENGE_TOTAL_DAYS, SUMMER_STATUS_LEVELS, DAILY_PEP_MESSAGES, MAX_WORKOUT_CHALLENGE_POINTS, MAX_WALKING_CHALLENGE_POINTS, MAX_ACHIEVEMENT_POINTS, MYSTERY_ACHIEVEMENT_COUNT_DISPLAY } from '../constants'; // Added MYSTERY_ACHIEVEMENT_COUNT_DISPLAY
import { Button } from '../components/Button';
// import { Logo } from '../components/Logo'; // Logo component is removed
import * as localStorageService from '../services/localStorageService';
import { FireIcon, TrophyIcon, AcademicCapIcon, UserIcon, SunIcon, KettlebellIcon, StickFigureIcon, LightbulbIcon, ChatBubbleOvalLeftEllipsisIcon, WaveIcon, DrinkIcon, StarIcon, FootstepsIcon, InformationCircleIcon, SparklesIcon, BookOpenIcon, ShareIcon, ArrowRightIcon, HeartIcon } from '../components/Icons'; // Ensured DrinkIcon and ArrowRightIcon are imported, Added HeartIcon
import { triggerConfetti, triggerHeartsAnimation } from '../utils/animations';
import { truncateText } from '../utils/textUtils'; 
import { SimpleModal } from '../components/SimpleModal'; 
import { ProgressSparks } from '../components/ProgressSparks'; // Import ProgressSparks

interface HomeViewProps {
  onNavigate: (view: View, data?: Workout | any) => void;
  userName: string | null;
  onNameSave: (name: string) => void;
  // Stats passed from App.tsx
  streakCount: number;
  totalWorkoutsCount: number;
  currentWorkoutLevel: Level | null;
  nextWorkoutLevelInfo: { nextLevelDef: Level | null; workoutsToNextLevel: number; percentageToNext: number; } | null;
  walkingChallengeCurrentDay: number;
  currentWalkingLevel: Level | null;
  walkingStreak: number;
  isTodayWalkDone: boolean;
  nextWalkingLevelInfo: { nextLevelDef: Level | null; daysToNextLevel: number; percentageToNext: number; } | null;
  // New props for Total Summer Status
  currentTotalSummerScore: number;
  TOTAL_SUMMER_SCORE_MAX: number;
  currentSummerStatusLevelName: string;
  // Max points for explanation modal
  maxWorkoutPoints: number;
  maxWalkingPoints: number;
  maxAchievementPoints: number; // This will be MYSTERY_ACHIEVEMENT_COUNT_DISPLAY
}

// Helper function to determine streak level for FireIcon
const getStreakLevel = (streak: number): number => {
  if (streak === 0) return 0;
  if (streak >= 1 && streak <= 3) return 1;
  if (streak >= 4 && streak <= 6) return 2;
  if (streak >= 7) return 3;
  return 0; // Default if somehow out of expected range
};


export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  userName, 
  onNameSave,
  streakCount,
  totalWorkoutsCount,
  currentWorkoutLevel,
  nextWorkoutLevelInfo,
  walkingChallengeCurrentDay,
  currentWalkingLevel,
  walkingStreak,
  isTodayWalkDone,
  nextWalkingLevelInfo: nextWalkingLevelInfoProp, 
  currentTotalSummerScore,
  TOTAL_SUMMER_SCORE_MAX,
  currentSummerStatusLevelName,
  maxWorkoutPoints,
  maxWalkingPoints,
  maxAchievementPoints,
}) => {
  const [inputName, setInputName] = useState('');
  const [dynamicGreetingBase, setDynamicGreetingBase] = useState('');
  const [showStrongRemark, setShowStrongRemark] = useState(false);
  const [dailyExtraContent, setDailyExtraContent] = useState<{ text: string; iconType: 'tip' | 'quote' } | null>(null);
  
  const [availableKBWorkouts, setAvailableKBWorkouts] = useState<Workout[]>([]);
  const [availableBWWorkouts, setAvailableBWWorkouts] = useState<Workout[]>([]);
  const [availableWarmups, setAvailableWarmups] = useState<Workout[]>([]);

  const [showWalkingChallengeInfoModal, setShowWalkingChallengeInfoModal] = useState(false);
  const [showWorkoutChallengeInfoModal, setShowWorkoutChallengeInfoModal] = useState(false);
  const [showScoreInfoModal, setShowScoreInfoModal] = useState(false); 

  const [showPepModal, setShowPepModal] = useState(false);
  const [currentPepMessage, setCurrentPepMessage] = useState('');

  // State for "Share App" functionality
  const [canNativeShare, setCanNativeShare] = useState(false);
  const appUrl = window.location.origin + window.location.pathname;

  // Super Sharer Easter Egg State
  const [isSuperSharer, setIsSuperSharer] = useState(false);
  const [showShareSuperstarModal, setShowShareSuperstarModal] = useState(false);
  const [appShareCountForGreeting, setAppShareCountForGreeting] = useState(0);


  // Spark trigger keys
  const [workoutLevelSparkKey, setWorkoutLevelSparkKey] = useState(0);
  const [walkingLevelSparkKey, setWalkingLevelSparkKey] = useState(0);
  const [summerStatusSparkKey, setSummerStatusSparkKey] = useState(0);

  // Refs to store previous percentages for spark triggering
  const prevWorkoutProgressRef = useRef<number>(0);
  const prevWalkingProgressRef = useRef<number>(0);
  const prevSummerScoreRef = useRef<number>(0);

  useEffect(() => {
    if (navigator.share) {
      setCanNativeShare(true);
    }
    setAppShareCountForGreeting(localStorageService.getAppShareCount());
  }, []);

  useEffect(() => {
    const currentAppShareCount = localStorageService.getAppShareCount();
    setAppShareCountForGreeting(currentAppShareCount); // Update for greeting
    setIsSuperSharer(currentAppShareCount >= 4);
  }, [streakCount, totalWorkoutsCount]); // Re-check on stat changes if needed, or handle share action more directly


  useEffect(() => {
    if (userName) {
      setInputName(userName);
      const currentHour = new Date().getHours();
      let greetingBase = APP_STRINGS.greetingDay;
      if (currentHour < 12) greetingBase = APP_STRINGS.greetingMorning;
      else if (currentHour >= 18) greetingBase = APP_STRINGS.greetingEvening;
      setDynamicGreetingBase(greetingBase.replace('{name}', userName));
      setShowStrongRemark(Math.random() < 0.25);
      setDailyExtraContent(DAILY_EXTRAS[new Date().getDay() % DAILY_EXTRAS.length]); 
    } else {
      setInputName('');
      setDynamicGreetingBase('');
      setShowStrongRemark(false);
      setDailyExtraContent(null);
    }

    const kbFiltered = WORKOUTS.filter(w => w.type === 'kettlebell' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15);
    setAvailableKBWorkouts(kbFiltered);
    const bwFiltered = WORKOUTS.filter(w => w.type === 'bodyweight' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15 && !w.id.startsWith('warmup-'));
    setAvailableBWWorkouts(bwFiltered);
    const warmupsFiltered = WORKOUTS.filter(w => w.id.startsWith('warmup-'));
    setAvailableWarmups(warmupsFiltered);

  }, [userName]);

  // Effect for workout level sparks
  useEffect(() => {
    const currentPercentage = nextWorkoutLevelInfo?.percentageToNext ?? 0;
    if (currentPercentage > prevWorkoutProgressRef.current && currentPercentage < 100) {
      setWorkoutLevelSparkKey(prev => prev + 1);
    }
    prevWorkoutProgressRef.current = currentPercentage;
  }, [nextWorkoutLevelInfo?.percentageToNext]);

  // Effect for walking level sparks
  useEffect(() => {
    const currentPercentage = nextWalkingLevelInfoProp?.percentageToNext ?? 0;
    if (currentPercentage > prevWalkingProgressRef.current && currentPercentage < 100) {
      setWalkingLevelSparkKey(prev => prev + 1);
    }
    prevWalkingProgressRef.current = currentPercentage;
  }, [nextWalkingLevelInfoProp?.percentageToNext]);

  // Effect for summer status sparks
  useEffect(() => {
    const currentPercentage = TOTAL_SUMMER_SCORE_MAX > 0 ? (currentTotalSummerScore / TOTAL_SUMMER_SCORE_MAX) * 100 : 0;
    if (currentPercentage > prevSummerScoreRef.current && currentPercentage < 100) {
      setSummerStatusSparkKey(prev => prev + 1);
    }
    prevSummerScoreRef.current = currentPercentage;
  }, [currentTotalSummerScore, TOTAL_SUMMER_SCORE_MAX]);

  // Easter Egg: 4th Share Modal
  useEffect(() => {
    if (appShareCountForGreeting >= 4) {
      setIsSuperSharer(true); // Ensure this is set for the greeting
      if (!localStorageService.hasFourthShareEasterEggBeenShown()) {
        setShowShareSuperstarModal(true);
        localStorageService.setFourthShareEasterEggShown();
      }
    }
  }, [appShareCountForGreeting]);


  const handleSave = () => {
    const trimmedName = inputName.trim();
    if (userName === null && trimmedName) {
        triggerConfetti();
    }
    onNameSave(trimmedName);
  };
  
  const handleWarmUp = () => {
    if (availableWarmups.length > 0) onNavigate(View.WorkoutDetail, availableWarmups[Math.floor(Math.random() * availableWarmups.length)]);
    else alert(APP_STRINGS.noWorkoutsAvailable);
  };
  
  const handleWorkoutOfTheDayKB = () => {
    if (availableKBWorkouts.length > 0) {
      const randomWorkout = availableKBWorkouts[Math.floor(Math.random() * availableKBWorkouts.length)];
      onNavigate(View.WorkoutDetail, randomWorkout);
    } else {
      alert(APP_STRINGS.noWorkoutsAvailable);
    }
  };

  const handleWorkoutOfTheDayBW = () => {
     if (availableBWWorkouts.length > 0) {
      const randomWorkout = availableBWWorkouts[Math.floor(Math.random() * availableBWWorkouts.length)];
      onNavigate(View.WorkoutDetail, randomWorkout);
    } else {
      alert(APP_STRINGS.noWorkoutsAvailable);
    }
  };
  
  const handleStartWalkingChallenge = () => {
    if (walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && isTodayWalkDone) { 
        alert(APP_STRINGS.walkingChallengeAllDaysCompleted);
        return;
    }
    if (isTodayWalkDone) {
        alert(APP_STRINGS.walkingChallengeCompletedToday);
        return;
    }
    onNavigate(View.ActiveWalking);
  };

  const handleShowPepMessage = () => {
    if (DAILY_PEP_MESSAGES.length > 0) {
      const randomIndex = Math.floor(Math.random() * DAILY_PEP_MESSAGES.length);
      setCurrentPepMessage(DAILY_PEP_MESSAGES[randomIndex]);
      setShowPepModal(true);
    }
  };

  const handleClosePepModal = () => {
    setShowPepModal(false);
  };

  // Share App Logic
  const copyToClipboardFallback = async (text: string, urlToShare: string) => {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(`${text} ${urlToShare}`);
            alert(`${APP_STRINGS.linkCopiedToClipboard}`);
            triggerHeartsAnimation();
            localStorageService.incrementAppShareCount();
            setAppShareCountForGreeting(localStorageService.getAppShareCount()); // Update local state
        } catch (err) {
            alert(`${text} ${urlToShare}`); 
        }
    } else {
        alert(`${text} ${urlToShare}`); 
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: APP_STRINGS.logoText,
      text: `Kolla in den här träningsappen från ${APP_STRINGS.logoText}! Perfekt för ${APP_STRINGS.appMainCampaignTitle}! ${APP_STRINGS.appHashtag}`,
      url: appUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerHeartsAnimation();
        localStorageService.incrementAppShareCount();
        setAppShareCountForGreeting(localStorageService.getAppShareCount()); // Update local state
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Share operation cancelled by the user or no share targets available.');
        } else {
          console.error('Error sharing:', error);
          await copyToClipboardFallback(shareData.text, shareData.url);
        }
      }
    } else {
      await copyToClipboardFallback(shareData.text, shareData.url);
    }
  };


  if (!userName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white text-gray-800">
       
        {/* LOGO */}
    <img
      src="/logga.png"
      alt="Flexibel Hälsostudio Logo"
      className="w-48 h-auto mx-auto mb-6"
    />

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mt-12 mb-6">{APP_STRINGS.appMainCampaignTitle}</h1>
        <div className="flex space-x-4 my-6">
          <SunIcon className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400" />
          <WaveIcon className="w-12 h-12 sm:w-16 sm:h-16 text-sky-400" />
          <DrinkIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400" />
          <HeartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400" /> 
        </div>
        <h2 className="text-3xl font-bold text-[#418484] mb-3">{APP_STRINGS.enterYourNamePrompt}</h2>
        <p className="text-gray-600 mb-8 max-w-md text-lg">{APP_STRINGS.enterYourNameEngagingSubtitle}</p>
        <input
          type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}
          placeholder={APP_STRINGS.enterYourNameInputLabel}
          className="w-full max-w-sm p-3 border border-gray-300 rounded-lg mb-6 focus:ring-[#51A1A1] focus:border-[#51A1A1] text-lg bg-white placeholder-gray-400 text-gray-800"
          aria-label={APP_STRINGS.enterYourNameInputLabel}
        />
        <Button onClick={handleSave} className="w-full max-w-sm text-xl py-4" disabled={!inputName.trim()}>
          {APP_STRINGS.saveNameButton}
        </Button>
      </div>
    );
  }

  const totalSummerProgressPercentage = TOTAL_SUMMER_SCORE_MAX > 0 ? (currentTotalSummerScore / TOTAL_SUMMER_SCORE_MAX) * 100 : 0;
  const CurrentSummerStatusIcon = SUMMER_STATUS_LEVELS.find(l => l.name === currentSummerStatusLevelName)?.icon || StarIcon;

  const workoutStreakLevel = getStreakLevel(streakCount);
  const currentWalkingStreakLevel = getStreakLevel(walkingStreak);

  const nameToDisplay = userName || "Användare";


  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-50">
      
       {/* LOGO */}
    <img
      src="/logga.png"
      alt="Flexibel Hälsostudio Logo"
      className="w-48 h-auto mx-auto mb-4"
    />

      {/* Main title, styled like the old Logo */}
      <h1 className="text-4xl sm:text-5xl font-bold text-[#51A1A1] text-center my-8" role="banner" aria-label={APP_STRINGS.appMainCampaignTitle}>
        {APP_STRINGS.appMainCampaignTitle}
      </h1>
      {/* Greeting Section */}
      <div className="text-center mb-6"> 
        <h2 className="text-4xl font-semibold text-gray-700">
          {dynamicGreetingBase}
          {isSuperSharer && (
            <span className="block sm:inline text-yellow-500 text-xl mt-1 sm:mt-0 sm:ml-2">
              {APP_STRINGS.greetingSuperSharerSuffixPart1}
              <strong className="font-bold">{APP_STRINGS.greetingSuperSharerSuffixStar}</strong>
              {APP_STRINGS.greetingSuperSharerSuffixPart2}
              <StarIcon className="w-6 h-6 inline-block ml-1.5 text-yellow-400" solid />
            </span>
          )}
        </h2>
        {showStrongRemark && <p className="text-lg text-[#418484] mt-1">{APP_STRINGS.strongRemark}</p>}
      </div>

       {/* Super Sharer Modal */}
      {showShareSuperstarModal && userName && (
        <SimpleModal
          isOpen={showShareSuperstarModal}
          onClose={() => setShowShareSuperstarModal(false)}
          title={APP_STRINGS.superSharerModalTitleEnhanced}
        >
          <div className="text-left space-y-3 text-lg">
            <p>{APP_STRINGS.superSharerModalMessage1Enhanced.replace('{name}', userName)}</p>
            <p className="font-semibold text-pink-600">{APP_STRINGS.superSharerModalRewardDetails}</p>
            <p>
              {APP_STRINGS.superSharerModalInstructionsAndCode.split('**')[0]} 
              <strong className="text-pink-600">**{APP_STRINGS.superSharerModalInstructionsAndCode.split('**')[1]}**</strong>
              {APP_STRINGS.superSharerModalInstructionsAndCode.split('**')[2]}
            </p>
            <p className="text-sm text-gray-500 mt-2">{APP_STRINGS.superSharerModalFinePrint}</p>
          </div>
        </SimpleModal>
      )}

      {/* Total Summer Status Section */}
      <section className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl rounded-2xl max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <CurrentSummerStatusIcon className="w-8 h-8 mr-2" solid />
              {APP_STRINGS.homeSummerStatusTitle}
            </h3>
            <button
              onClick={() => setShowScoreInfoModal(true)}
              className="text-white hover:text-yellow-200 transition-colors"
              title={APP_STRINGS.homeSummerScoreInfoButtonTooltip}
              aria-label={APP_STRINGS.homeSummerScoreInfoButtonTooltip}
            >
              <InformationCircleIcon className="w-7 h-7" />
            </button>
        </div>
        
        <div className="text-center mb-2">
          <p className="text-xl font-semibold">
            {APP_STRINGS.homeSummerStatusLevelLabel} <span className="text-2xl font-bold">{currentSummerStatusLevelName}</span>
          </p>
        </div>
        <div className="text-center mb-3">
          <p className="text-lg">
            {APP_STRINGS.homeSummerStatusScoreLabel} <span className="font-bold">{currentTotalSummerScore} / {TOTAL_SUMMER_SCORE_MAX}</span>
          </p>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-4 mb-4 relative overflow-hidden"> 
          <div 
            className="bg-white h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${totalSummerProgressPercentage}%` }}
            role="progressbar"
            aria-valuenow={totalSummerProgressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Total SommarPepp framsteg: ${totalSummerProgressPercentage.toFixed(0)}%`}
          ></div>
          <ProgressSparks 
            key={`summer-${summerStatusSparkKey}`}
            percentage={totalSummerProgressPercentage} 
            sparkColor="bg-yellow-200" 
          />
        </div>
        <Button
          onClick={() => onNavigate(View.Achievements)}
          variant="ghost"
          className="w-full text-sm font-semibold text-white bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          {APP_STRINGS.viewAchievementsButtonLabel}
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </section>

      {/* Score Info Modal */}
      {showScoreInfoModal && (
        <SimpleModal
          isOpen={showScoreInfoModal}
          onClose={() => setShowScoreInfoModal(false)}
          title={APP_STRINGS.homeSummerScoreInfoModalTitle}
        >
          <div className="text-left space-y-3 text-lg text-gray-700">
            <p>{APP_STRINGS.homeSummerScoreInfoModalDesc1}</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>{APP_STRINGS.homeSummerScoreInfoModalWorkoutPoints.replace('{points}', maxWorkoutPoints.toString())}</li>
              <li>{APP_STRINGS.homeSummerScoreInfoModalWalkingPoints.replace('{points}', maxWalkingPoints.toString())}</li>
              <li>{APP_STRINGS.homeSummerScoreInfoModalAchievementPoints.replace('{points}', maxAchievementPoints.toString())}</li>
            </ul>
          </div>
        </SimpleModal>
      )}

      {/* Combined Daily Extra & Pep Light Card */}
      {dailyExtraContent && (
        <section className="mb-8 p-6 bg-yellow-50 shadow-xl rounded-2xl border border-yellow-200 max-w-2xl mx-auto w-full">
          <div className="mb-6"> 
            <h3 className="text-xl font-semibold text-yellow-700 mb-3 flex items-center">
              {dailyExtraContent.iconType === 'tip' ? 
                <LightbulbIcon className="w-7 h-7 mr-2 text-yellow-600"/> : 
                <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 mr-2 text-yellow-600"/>}
              {APP_STRINGS.homeDailyExtraTitle}
            </h3>
            <p className="text-gray-700 text-lg italic">
              {dailyExtraContent.iconType === 'quote'
                ? dailyExtraContent.text 
                : `"${dailyExtraContent.text}"`
              }
            </p>
          </div>
          
          <Button
            onClick={handleShowPepMessage}
            variant="primary" 
            className="w-full text-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500 active:bg-yellow-600 focus:ring-yellow-300 flex items-center justify-center py-3"
          >
            <LightbulbIcon className="w-6 h-6 mr-2 text-yellow-800" /> 
            <span className="font-semibold">{APP_STRINGS.homeDailyPepButtonText}</span>
          </Button>
        </section>
      )}

      {showPepModal && (
        <SimpleModal
          isOpen={showPepModal}
          onClose={handleClosePepModal}
          title={APP_STRINGS.pepModalTitle}
        >
          <p className="text-lg text-gray-700 text-center">{currentPepMessage}</p>
        </SimpleModal>
      )}


      <section className="mb-8 p-4 sm:p-6 bg-[#E4F0F0] shadow-xl rounded-2xl border-2 border-[#A3D3D3] max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#51A1A1] flex items-center">
            <KettlebellIcon className="w-7 h-7 mr-2 text-[#51A1A1]" /> 
            {APP_STRINGS.workoutChallengesMainTitle}
          </h3>
          <button 
            onClick={() => setShowWorkoutChallengeInfoModal(true)} 
            className="text-[#51A1A1] hover:text-[#418484]"
            title={APP_STRINGS.workoutChallengeInfoButtonTooltip}
            aria-label={APP_STRINGS.workoutChallengeInfoButtonTooltip}
          >
            <InformationCircleIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg shadow-inner border border-[#C2DCDC]">
          <div className="grid grid-cols-3 gap-x-2 sm:gap-x-4 text-center mb-3">
            <div>
              <FireIcon className="mx-auto" streakLevel={workoutStreakLevel} />
              <p className="text-lg text-gray-500 mt-1">{APP_STRINGS.homeStreakLabel}</p>
              <p className="text-3xl sm:text-4xl font-bold text-[#418484]">{streakCount} <span className="text-lg sm:text-xl font-medium">{APP_STRINGS.homeStreakUnit}</span></p>
            </div>
            <div>
              <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto" />
              <p className="text-lg text-gray-500 mt-1">{APP_STRINGS.homeTotalWorkoutsLabel}</p>
              <p className="text-3xl sm:text-4xl font-bold text-[#418484]">{totalWorkoutsCount} <span className="text-lg sm:text-xl font-medium">{APP_STRINGS.homeTotalWorkoutsUnit}</span></p>
            </div>
            <div>
              <AcademicCapIcon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 mx-auto" />
              <p className="text-lg text-gray-500 mt-1">{APP_STRINGS.homeCurrentLevelLabel}</p>
              <p className="text-lg sm:text-xl font-bold text-indigo-600 break-words">
                {currentWorkoutLevel ? currentWorkoutLevel.name : '-'}
              </p>
            </div>
          </div>
          {nextWorkoutLevelInfo && nextWorkoutLevelInfo.nextLevelDef && nextWorkoutLevelInfo.workoutsToNextLevel > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 text-center">
                {APP_STRINGS.workoutsToNextLevelText.replace('{count}', nextWorkoutLevelInfo.workoutsToNextLevel.toString()).replace('{levelName}', nextWorkoutLevelInfo.nextLevelDef.name)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 relative overflow-hidden"> 
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${nextWorkoutLevelInfo.percentageToNext}%` }}
                  aria-label="Framsteg till nästa träningsnivå"
                ></div>
                <ProgressSparks 
                  key={`workout-${workoutLevelSparkKey}`}
                  percentage={nextWorkoutLevelInfo.percentageToNext} 
                  sparkColor="bg-indigo-300"
                />
              </div>
            </div>
          )}
          {nextWorkoutLevelInfo === null && currentWorkoutLevel && (
            <p className="mt-3 text-sm font-semibold text-yellow-500 text-center flex items-center justify-center">
              <StarIcon className="w-5 h-5 inline mr-1" solid />
              {APP_STRINGS.maxLevelReachedText}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={() => onNavigate(View.LevelSystem)} variant="secondary" className="text-base">
            {APP_STRINGS.viewLevelsButton}
          </Button>
          <Button onClick={handleWarmUp} variant="warmup" className="text-base" disabled={availableWarmups.length === 0} title={availableWarmups.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.warmUpButtonTitle}>
            {APP_STRINGS.warmUpButton}
          </Button>
          <Button 
              onClick={handleWorkoutOfTheDayKB} 
              variant="primary" 
              className="text-base sm:col-span-1 flex items-center justify-center"
              disabled={availableKBWorkouts.length === 0} 
              title={availableKBWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayKBButtonTitle}
            >
              <KettlebellIcon className="w-6 h-6 mr-2"/>
              {APP_STRINGS.workoutOfTheDayKBButton}
            </Button>
            <Button 
              onClick={handleWorkoutOfTheDayBW} 
              variant="primary" 
              className="text-base sm:col-span-1 flex items-center justify-center"
              disabled={availableBWWorkouts.length === 0} 
              title={availableBWWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayBWButtonTitle}
            >
              <StickFigureIcon className="w-6 h-6 mr-2"/>
              {APP_STRINGS.workoutOfTheDayBWButton}
            </Button>
            <Button 
              onClick={() => onNavigate(View.GenerateWorkout)} 
              variant="primary" 
              className="text-base sm:col-span-2 flex items-center justify-center bg-purple-600 hover:bg-purple-700 border-purple-700 active:bg-purple-800"
              title="Skapa ett anpassat träningspass med AI"
            >
              <DrinkIcon className="w-6 h-6 mr-2 text-white"/> 
              {APP_STRINGS.generateWorkoutButton}
            </Button>
        </div>
      </section>

      <section className="mb-8 p-4 sm:p-6 bg-[#E4F0F0] shadow-xl rounded-2xl border-2 border-[#A3D3D3] max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#51A1A1] flex items-center">
            <FootstepsIcon className="w-7 h-7 mr-2 text-[#51A1A1]" /> 
            {APP_STRINGS.walkingChallengeHomeTitle}
          </h3>
           <button 
            onClick={() => setShowWalkingChallengeInfoModal(true)} 
            className="text-[#51A1A1] hover:text-[#418484]"
            title={APP_STRINGS.walkingChallengeInfoButtonTooltip}
            aria-label={APP_STRINGS.walkingChallengeInfoButtonTooltip}
          >
            <InformationCircleIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg shadow-inner border border-[#C2DCDC]">
           <div className="grid grid-cols-3 gap-x-2 sm:gap-x-4 text-center mb-3">
            <div>
              <FootstepsIcon className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 mx-auto" /> 
              <p className="text-lg text-gray-500 mt-1">Dagar</p>
              <p className="text-3xl sm:text-4xl font-bold text-[#418484]">{walkingChallengeCurrentDay} <span className="text-lg sm:text-xl font-medium">/ {WALKING_CHALLENGE_TOTAL_DAYS}</span></p>
            </div>
            <div>
              <FireIcon className="mx-auto" streakLevel={currentWalkingStreakLevel} />
              <p className="text-lg text-gray-500 mt-1">{APP_STRINGS.walkingChallengeStreakLabel}</p>
              <p className="text-3xl sm:text-4xl font-bold text-[#418484]">{walkingStreak} <span className="text-lg sm:text-xl font-medium">{APP_STRINGS.homeStreakUnit}</span></p>
            </div>
            <div>
              <AcademicCapIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mx-auto" /> 
              <p className="text-lg text-gray-500 mt-1">{APP_STRINGS.walkingChallengeCurrentLevelLabel}</p>
              <p className="text-lg sm:text-xl font-bold text-purple-600 break-words">
                  {currentWalkingLevel ? currentWalkingLevel.name : '-'}
              </p>
            </div>
          </div>
          {nextWalkingLevelInfoProp && nextWalkingLevelInfoProp.nextLevelDef && nextWalkingLevelInfoProp.daysToNextLevel > 0 && walkingChallengeCurrentDay < WALKING_CHALLENGE_TOTAL_DAYS && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 text-center">
                {APP_STRINGS.daysToNextWalkingLevelText.replace('{count}', nextWalkingLevelInfoProp.daysToNextLevel.toString()).replace('{levelName}', nextWalkingLevelInfoProp.nextLevelDef.name)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 relative overflow-hidden"> 
                <div 
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"  
                  style={{ width: `${nextWalkingLevelInfoProp.percentageToNext}%` }}
                  aria-label="Framsteg till nästa gångnivå"
                ></div>
                <ProgressSparks 
                  key={`walking-${walkingLevelSparkKey}`}
                  percentage={nextWalkingLevelInfoProp.percentageToNext} 
                  sparkColor="bg-purple-300"
                />
              </div>
            </div>
          )}
          {walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && (
             <p className="mt-3 text-sm font-semibold text-yellow-500 text-center flex items-center justify-center">
                <StarIcon className="w-5 h-5 inline mr-1" solid />
                {APP_STRINGS.walkingChallengeAllDaysCompleted}
             </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={() => onNavigate(View.WalkingLevelSystem)} variant="secondary" className="text-base">
                {APP_STRINGS.viewWalkingLevelsButton}
            </Button>
            <Button 
                onClick={handleStartWalkingChallenge} 
                variant="primary" 
                className="text-base"
                disabled={isTodayWalkDone && walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS}
            >
                {isTodayWalkDone ? (walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS ? APP_STRINGS.walkingChallengeAllDaysCompleted : APP_STRINGS.walkingChallengeCompletedToday) : APP_STRINGS.startWalkingChallengeButton}
            </Button>
        </div>
      </section>
      
      <section className="mb-8 p-4 sm:p-6 bg-pink-50 shadow-xl rounded-2xl border-2 border-pink-200 max-w-2xl mx-auto w-full relative">
        <HeartIcon className="absolute top-3 left-3 w-8 h-8 text-pink-400 opacity-70 transform -rotate-12" />
        <HeartIcon className="absolute bottom-3 right-3 w-10 h-10 text-pink-300 opacity-60 transform rotate-6" />
        <h3 className="text-2xl font-bold text-pink-600 flex items-center justify-center mb-3">
          <ShareIcon className="w-7 h-7 mr-2 text-pink-500" />
          {APP_STRINGS.shareAppTitle}
        </h3>
        <p className="text-gray-700 text-center mb-4">{APP_STRINGS.spreadLoveShareMotivationText}</p>
        {canNativeShare ? (
            <Button
              onClick={handleShareApp}
              variant="primary"
              className="w-full text-lg py-3 bg-pink-500 hover:bg-pink-600 border-pink-600 focus:ring-pink-400 active:bg-pink-700"
            >
              {APP_STRINGS.shareAppButton}
            </Button>
          ) : (
            <div>
              <Button
                onClick={handleShareApp} 
                variant="primary"
                className="w-full text-lg py-3 mb-2 bg-pink-500 hover:bg-pink-600 border-pink-600 focus:ring-pink-400 active:bg-pink-700"
              >
                Kopiera Länk till Appen
              </Button>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                {APP_STRINGS.shareAppFallbackText} <br />
                Länk: <strong className="break-all">{appUrl}</strong>
              </p>
            </div>
          )}
      </section>


       {/* Info Modals */}
      {showWorkoutChallengeInfoModal && (
        <SimpleModal
          isOpen={showWorkoutChallengeInfoModal}
          onClose={() => setShowWorkoutChallengeInfoModal(false)}
          title={APP_STRINGS.workoutChallengeInfoModalTitle}
        >
          <div className="text-left space-y-4 text-lg text-gray-700">
            <div>
              <h4 className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalPurposeLabel}</h4>
              <p>{APP_STRINGS.workoutChallengeInfoModalPurposeText}</p>
            </div>
            <div>
              <h4 className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalHowItWorksLabel}</h4>
              <ul className="list-decimal list-inside pl-4 space-y-1">
                <li>{APP_STRINGS.workoutChallengeInfoModalRule1}</li>
                <li>{APP_STRINGS.workoutChallengeInfoModalRule2}</li>
                <li>{APP_STRINGS.workoutChallengeInfoModalRuleAI}</li>
                <li>{APP_STRINGS.workoutChallengeInfoModalRule3}</li>
                <li>{APP_STRINGS.workoutChallengeInfoModalRule4}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalTipsLabel}</h4>
              <p>{APP_STRINGS.workoutChallengeInfoModalTipsText}</p>
            </div>
          </div>
        </SimpleModal>
      )}
      {showWalkingChallengeInfoModal && (
        <SimpleModal
          isOpen={showWalkingChallengeInfoModal}
          onClose={() => setShowWalkingChallengeInfoModal(false)}
          title={APP_STRINGS.walkingChallengeInfoModalTitle}
        >
          <div className="text-left space-y-4 text-lg text-gray-700">
            <div>
              <h4 className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalPurposeLabel}</h4>
              <p>{APP_STRINGS.walkingChallengeInfoModalPurposeText}</p>
            </div>
            <div>
              <h4 className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalHowItWorksLabel}</h4>
              <ul className="list-decimal list-inside pl-4 space-y-1">
                <li>{APP_STRINGS.walkingChallengeInfoModalRule1}</li>
                <li>{APP_STRINGS.walkingChallengeInfoModalRule2}</li>
                <li>{APP_STRINGS.walkingChallengeInfoModalRule3}</li>
                <li>{APP_STRINGS.walkingChallengeInfoModalRule4}</li>
                <li>{APP_STRINGS.walkingChallengeInfoModalRule5}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalTipsLabel}</h4>
              <p>{APP_STRINGS.walkingChallengeInfoModalTipsText}</p>
            </div>
          </div>
        </SimpleModal>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-around items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6 mb-4 max-w-2xl mx-auto w-full">
        <Button 
          onClick={() => onNavigate(View.Profile)} 
          variant="secondary" 
          className="w-full sm:w-auto text-lg flex items-center justify-center py-4"
        >
          <UserIcon className="w-6 h-6 mr-2" />
          {APP_STRINGS.profileButtonLabel}
        </Button>
        <Button 
          onClick={() => onNavigate(View.SpreadLove)} 
          variant="secondary" 
          className="w-full sm:w-auto text-lg flex items-center justify-center py-4"
        >
          <InformationCircleIcon className="w-6 h-6 mr-2" /> 
          {APP_STRINGS.contactAndShareButtonLabel} 
        </Button>
        <Button 
          onClick={() => onNavigate(View.Tips)} 
          variant="secondary" 
          className="w-full sm:w-auto text-lg flex items-center justify-center py-4"
        >
          <LightbulbIcon className="w-6 h-6 mr-2" /> 
          {APP_STRINGS.tipsButtonLabel} 
        </Button>
      </div>

    </div>
  );
};
