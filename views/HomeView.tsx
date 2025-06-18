
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Workout, View, Level, SummerStatusLevel } from '../types';
import { WORKOUTS, APP_STRINGS, DAILY_EXTRAS, WALKING_CHALLENGE_TOTAL_DAYS, SUMMER_STATUS_LEVELS, DAILY_PEP_MESSAGES, MAX_WORKOUT_CHALLENGE_POINTS, MAX_WALKING_CHALLENGE_POINTS, MYSTERY_ACHIEVEMENT_COUNT_DISPLAY, ACHIEVEMENT_DEFINITIONS, WALKING_CHALLENGE_DAILY_MINUTES } from '../constants';
import { Button } from '../components/Button';
import {
  getAppShareCount,
  hasFourthShareEasterEggBeenShown,
  setFourthShareEasterEggBeenShown,
  incrementAppShareCount,
  isTodayWalkCompleted as checkIsTodayWalkDone 
} from '../services/localStorageService';
import * as analyticsService from '../services/analyticsService';
import { FireIcon, TrophyIcon, AcademicCapIcon, UserIcon, SunIcon, KettlebellIcon, StickFigureIcon, LightbulbIcon, ChatBubbleOvalLeftEllipsisIcon, WaveIcon, DrinkIcon, StarIcon, FootstepsIcon, InformationCircleIcon, SparklesIcon, BookOpenIcon, ShareIcon, ArrowRightIcon, HeartIcon, PlusCircleIcon, ArrowSmRightIcon, XCircleIcon } from '../components/Icons';
import { triggerConfetti, triggerHeartsAnimation } from '../utils/animations';
import { truncateText } from '../utils/textUtils';
import { SimpleModal } from '../components/SimpleModal';
import { ProgressSparks } from '../components/ProgressSparks';

interface HomeViewProps {
  onNavigate: (view: View, data?: Workout | any) => void;
  userName: string | null;
  onNameSave: (name: string) => void;
  streakCount: number;
  totalWorkoutsCount: number;
  currentWorkoutLevel: Level | null;
  nextWorkoutLevelInfo: { nextLevelDef: Level | null; workoutsToNextLevel: number; percentageToNext: number; } | null;
  walkingChallengeCurrentDay: number;
  currentWalkingLevel: Level | null;
  walkingStreak: number;
  isTodayWalkDone: boolean;
  nextWalkingLevelInfo: { nextLevelDef: Level | null; daysToNextLevel: number; percentageToNext: number; } | null;
  currentTotalSummerScore: number;
  TOTAL_SUMMER_SCORE_MAX: number;
  currentSummerStatusLevelName: string;
  maxWorkoutPoints: number;
  maxWalkingPoints: number;
  maxAchievementPoints: number;
}

const getStreakLevel = (streak: number): number => {
  if (streak === 0) return 0;
  if (streak >= 1 && streak <= 3) return 1;
  if (streak >= 4 && streak <= 6) return 2;
  if (streak >= 7) return 3;
  return 0;
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

  const [canNativeShare, setCanNativeShare] = useState(false);
  const appUrl = window.location.origin + window.location.pathname;

  const [isSuperSharer, setIsSuperSharer] = useState(false);
  const [showShareSuperstarModal, setShowShareSuperstarModal] = useState(false);
  const [appShareCountForGreeting, setAppShareCountForGreeting] = useState(0);

  const [isSharingHomeApp, setIsSharingHomeApp] = useState(false); 


  const [workoutLevelSparkKey, setWorkoutLevelSparkKey] = useState(0);
  const [walkingLevelSparkKey, setWalkingLevelSparkKey] = useState(0);
  const [summerStatusSparkKey, setSummerStatusSparkKey] = useState(0);

  const prevWorkoutProgressRef = useRef<number>(0);
  const prevWalkingProgressRef = useRef<number>(0);
  const prevSummerScoreRef = useRef<number>(0);

  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setCanNativeShare(true);
    }
    setAppShareCountForGreeting(getAppShareCount());
  }, []);

  useEffect(() => {
    const currentAppShareCount = getAppShareCount();
    setAppShareCountForGreeting(currentAppShareCount);
    setIsSuperSharer(currentAppShareCount >= 4);
  }, [streakCount, totalWorkoutsCount]);


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

  useEffect(() => {
    const currentPercentage = nextWorkoutLevelInfo?.percentageToNext ?? 0;
    if (currentPercentage > prevWorkoutProgressRef.current && currentPercentage < 100) {
      setWorkoutLevelSparkKey(prev => prev + 1);
    }
    prevWorkoutProgressRef.current = currentPercentage;
  }, [nextWorkoutLevelInfo?.percentageToNext]);

  useEffect(() => {
    const currentPercentage = nextWalkingLevelInfoProp?.percentageToNext ?? 0;
    if (currentPercentage > prevWalkingProgressRef.current && currentPercentage < 100) {
      setWalkingLevelSparkKey(prev => prev + 1);
    }
    prevWalkingProgressRef.current = currentPercentage;
  }, [nextWalkingLevelInfoProp?.percentageToNext]);

  useEffect(() => {
    const currentPercentage = TOTAL_SUMMER_SCORE_MAX > 0 ? (currentTotalSummerScore / TOTAL_SUMMER_SCORE_MAX) * 100 : 0;
    if (currentPercentage > prevSummerScoreRef.current && currentPercentage < 100) {
      setSummerStatusSparkKey(prev => prev + 1);
    }
    prevSummerScoreRef.current = currentPercentage;
  }, [currentTotalSummerScore, TOTAL_SUMMER_SCORE_MAX]);

  useEffect(() => {
    if (appShareCountForGreeting >= 4) {
      setIsSuperSharer(true);
      if (!hasFourthShareEasterEggBeenShown()) {
        setShowShareSuperstarModal(true);
        setFourthShareEasterEggBeenShown();
      }
    }
  }, [appShareCountForGreeting]);

  const toggleFabMenu = () => {
    setIsFabMenuOpen(!isFabMenuOpen);
  };

  const handleFabMenuItemClick = (action: () => void) => {
    action();
    setIsFabMenuOpen(false);
  };


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

  const handleLogWalk = () => {
    if (walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && isTodayWalkDone) {
        alert(APP_STRINGS.walkingChallengeAllDaysCompleted);
        return;
    }
    if (isTodayWalkDone && walkingChallengeCurrentDay < WALKING_CHALLENGE_TOTAL_DAYS) {
        alert(APP_STRINGS.walkingChallengeCompletedToday);
        return;
    }
    analyticsService.trackEvent('start_walk', {
        event_category: 'walking_engagement',
        event_action: 'log_walk_intent',
        item_id: `walk_day_log_intent_${walkingChallengeCurrentDay + 1}`,
        walk_day_target: walkingChallengeCurrentDay + 1,
    });
    onNavigate(View.LogWalk);
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

  const copyToClipboardFallback = async (text: string, urlToShare: string) => {
    let shareMethod = 'clipboard_copy_fallback';
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(`${text} ${urlToShare}`);
            alert(`${APP_STRINGS.linkCopiedToClipboard}`);
            triggerHeartsAnimation();
            incrementAppShareCount();
            setAppShareCountForGreeting(getAppShareCount());
            shareMethod = 'clipboard_copy_success';
        } catch (err) {
            alert(`${text} ${urlToShare}`);
            shareMethod = 'clipboard_copy_error_alert_fallback';
        }
    } else {
        alert(`${text} ${urlToShare}`);
        shareMethod = 'no_clipboard_alert_fallback';
    }
    analyticsService.trackEvent('share', {
        event_category: 'user_engagement',
        event_action: 'share_content',
        method: shareMethod,
        content_type: 'app',
    });
  };

  const handleShareApp = async () => {
    if (isSharingHomeApp) return;
    setIsSharingHomeApp(true);

    const shareData = {
      title: APP_STRINGS.appName,
      text: `${APP_STRINGS.spreadLoveShareMotivationText} ${APP_STRINGS.appHashtag}`,
      url: appUrl,
    };
    let shareMethod = 'unknown';

    try {
      if (canNativeShare) {
        await navigator.share(shareData);
        triggerHeartsAnimation();
        incrementAppShareCount();
        setAppShareCountForGreeting(getAppShareCount());
        shareMethod = 'navigator_api';
      } else {
        await copyToClipboardFallback(shareData.text, shareData.url);
        return; 
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        shareMethod = 'cancelled';
      } else {
        console.error('Error sharing app from HomeView:', error);
        await copyToClipboardFallback(shareData.text, shareData.url);
        return; 
      }
    } finally {
      setIsSharingHomeApp(false);
    }

    if(shareMethod !== 'cancelled' && shareMethod !== 'unknown' && !shareMethod.startsWith('clipboard_') && !shareMethod.startsWith('no_clipboard_')) {
      analyticsService.trackEvent('share', {
          event_category: 'user_engagement',
          event_action: 'share_content',
          method: shareMethod,
          content_type: 'app',
      });
    }
  };

  const navigateToSection = (view: View, sectionName: string) => {
    analyticsService.trackEvent('view_app_section', {
        event_category: 'navigation',
        event_action: 'view_section',
        section_name: sectionName,
    });
    onNavigate(view);
  };


  if (!userName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-[#E4F0F0] to-[#C2DCDC] text-gray-800">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <img src="/logga.png" alt="Flexibel Friskvård Hälsa Logotyp" className="mx-auto mb-6 h-20 w-auto" />
          <div className="flex justify-center space-x-4 mb-6">
            <WaveIcon className="w-12 h-12 text-blue-400" />
            <SunIcon className="w-12 h-12 text-yellow-400" />
            <DrinkIcon className="w-12 h-12 text-pink-400" />
            <HeartIcon className="w-12 h-12 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#316767] mb-3">{APP_STRINGS.enterYourNamePrompt}</h1>
          <p className="text-gray-600 mb-6">{APP_STRINGS.enterYourNameEngagingSubtitle}</p>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder={APP_STRINGS.enterYourNameInputLabel}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#51A1A1] focus:border-[#51A1A1] text-lg bg-white text-gray-800 placeholder-gray-400 mb-4"
            aria-label={APP_STRINGS.enterYourNameInputLabel}
          />
          <Button onClick={handleSave} disabled={!inputName.trim()} className="w-full text-lg py-3">
            {APP_STRINGS.saveNameButton}
          </Button>
        </div>
      </div>
    );
  }

  let logWalkButtonText = APP_STRINGS.logWalkButton;
  let logWalkButtonDisabled = false;
  if (isTodayWalkDone && walkingChallengeCurrentDay < WALKING_CHALLENGE_TOTAL_DAYS) {
      logWalkButtonText = APP_STRINGS.walkingChallengeCompletedToday;
      logWalkButtonDisabled = true;
  } else if (walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS) {
      logWalkButtonText = APP_STRINGS.walkingChallengeAllDaysCompletedShort;
      logWalkButtonDisabled = true;
  }
  
  const fabMenuItems = [
    { 
      label: APP_STRINGS.warmUpButton, 
      action: handleWarmUp, 
      icon: <FireIcon className="w-5 h-5" streakLevel={1}/>, 
      disabled: availableWarmups.length === 0, 
      title: availableWarmups.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.warmUpButtonTitle,
      itemClass: "warmup-item"
    },
    { 
      label: APP_STRINGS.workoutOfTheDayKBButton, 
      action: handleWorkoutOfTheDayKB, 
      icon: <KettlebellIcon className="w-5 h-5"/>, 
      disabled: availableKBWorkouts.length === 0, 
      title: availableKBWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayKBButtonTitle,
      itemClass: "kb-item"
    },
    { 
      label: APP_STRINGS.workoutOfTheDayBWButton, 
      action: handleWorkoutOfTheDayBW, 
      icon: <StickFigureIcon className="w-5 h-5"/>, 
      disabled: availableBWWorkouts.length === 0, 
      title: availableBWWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayBWButtonTitle,
      itemClass: "bw-item"
    },
    { 
      label: APP_STRINGS.generateButton, 
      action: () => navigateToSection(View.GenerateWorkout, 'generate_workout'), 
      icon: <DrinkIcon className="w-5 h-5"/>, 
      disabled: false, 
      title: APP_STRINGS.generateButton,
      itemClass: "bartender-item"
    },
    { 
      label: logWalkButtonText, 
      action: handleLogWalk, 
      icon: <PlusCircleIcon className="w-5 h-5"/>, 
      disabled: logWalkButtonDisabled, 
      title: logWalkButtonDisabled ? logWalkButtonText : APP_STRINGS.logWalkButton,
      itemClass: "walk-item"
    },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-8">
      {isFabMenuOpen && <div className={`fab-overlay ${isFabMenuOpen ? 'open' : ''}`} onClick={toggleFabMenu}></div>}
      <div className="w-full text-center py-4">
        <img src="/logga.png" alt="Flexibel Friskvård Hälsa Logotyp" className="mx-auto mb-8 h-24 w-auto" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-500">
          Sommarutmaning 2025!
        </h1>
      </div>
      <div className="p-4 sm:p-6 flex-grow">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            {dynamicGreetingBase}
            {isSuperSharer && (
              <>
                <br className="sm:hidden" />
                <span className="text-2xl sm:text-3xl">
                  {APP_STRINGS.greetingSuperSharerSuffixPart1}
                  <span className="text-yellow-500 font-extrabold animate-pulse">{APP_STRINGS.greetingSuperSharerSuffixStar}</span>
                  {APP_STRINGS.greetingSuperSharerSuffixPart2}
                </span>
              </>
            )}
          </h1>
          {showStrongRemark && <p className="text-lg text-gray-600 mt-1">{APP_STRINGS.strongRemark}</p>}
        </div>

        <section className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 p-4 sm:p-6 rounded-xl shadow-lg relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-start"> 
              <TrophyIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-white" />
              {APP_STRINGS.homeSummerStatusTitle}
            </h2>
             <p className="text-2xl sm:text-3xl text-white font-extrabold text-center -mt-1"> 
              {currentSummerStatusLevelName}
            </p>
             <p className="text-sm text-white mt-1 text-center"> 
              {APP_STRINGS.homeSummerStatusScoreLabel} <span className="font-bold">{currentTotalSummerScore} / {TOTAL_SUMMER_SCORE_MAX}</span>
            </p>
            {TOTAL_SUMMER_SCORE_MAX > 0 && (
              <div className="w-full bg-white/30 rounded-full h-3 sm:h-4 mt-3 relative overflow-hidden">
                <div
                  className="bg-yellow-300 h-3 sm:h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentTotalSummerScore / TOTAL_SUMMER_SCORE_MAX) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={currentTotalSummerScore}
                  aria-valuemin={0}
                  aria-valuemax={TOTAL_SUMMER_SCORE_MAX}
                  aria-label="Total sommarstatus framsteg"
                ></div>
                 <ProgressSparks
                    key={summerStatusSparkKey}
                    percentage={(currentTotalSummerScore / TOTAL_SUMMER_SCORE_MAX) * 100}
                    sparkColor="bg-yellow-100"
                  />
              </div>
            )}
            <Button
                onClick={() => navigateToSection(View.Achievements, 'achievements_and_levels')}
                className="border-0 mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-yellow-400"
            >
                {APP_STRINGS.homeSummerViewAchievementsButton} <ArrowSmRightIcon className="w-5 h-5 ml-1.5" />
            </Button>
            <button
                onClick={() => setShowScoreInfoModal(true)}
                className="absolute top-2 right-2 p-1.5 text-white hover:text-yellow-100 transition-colors"
                title={APP_STRINGS.homeSummerScoreInfoButtonTooltip}
                aria-label={APP_STRINGS.homeSummerScoreInfoButtonTooltip}
            >
                <InformationCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-[#51A1A1]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#316767] flex items-center">
                <KettlebellIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-[#51A1A1]" />
                {APP_STRINGS.workoutChallengeInfoModalTitle}
              </h2>
               <button
                onClick={() => setShowWorkoutChallengeInfoModal(true)}
                className="p-1 text-gray-500 hover:text-[#51A1A1] transition-colors"
                title={APP_STRINGS.workoutChallengeInfoButtonTooltip}
                aria-label={APP_STRINGS.workoutChallengeInfoButtonTooltip}
              >
                <InformationCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4">
              <div>
                <FireIcon className="mx-auto" streakLevel={getStreakLevel(streakCount)} />
                <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.homeStreakLabel}</p>
                <p className="text-lg sm:text-xl font-bold text-[#51A1A1]">{streakCount} <span className="text-sm font-normal">{APP_STRINGS.homeStreakUnit}</span></p>
              </div>
              <div>
                <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.homeTotalWorkoutsLabel}</p>
                <p className="text-lg sm:text-xl font-bold text-[#51A1A1]">{totalWorkoutsCount} <span className="text-sm font-normal">{APP_STRINGS.homeTotalWorkoutsUnit}</span></p>
              </div>
              <div>
                <AcademicCapIcon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.homeCurrentLevelLabel}</p>
                <p className="text-lg sm:text-xl font-bold text-indigo-600 break-words">{currentWorkoutLevel ? truncateText(currentWorkoutLevel.name, 10) : '-'}</p>
              </div>
            </div>

            {nextWorkoutLevelInfo && nextWorkoutLevelInfo.nextLevelDef && nextWorkoutLevelInfo.workoutsToNextLevel > 0 && (
              <div className="mb-4">
                <p className="text-sm text-orange-600 text-center mb-1">
                  {APP_STRINGS.workoutsToNextLevelText
                    .replace('{count}', nextWorkoutLevelInfo.workoutsToNextLevel.toString())
                    .replace('{levelName}', truncateText(nextWorkoutLevelInfo.nextLevelDef.name, 10))}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${nextWorkoutLevelInfo.percentageToNext}%` }}
                    role="progressbar"
                    aria-valuenow={nextWorkoutLevelInfo.percentageToNext}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Framsteg till nästa träningsnivå"
                  ></div>
                   <ProgressSparks
                      key={workoutLevelSparkKey}
                      percentage={nextWorkoutLevelInfo.percentageToNext}
                      sparkColor="bg-indigo-300"
                    />
                </div>
              </div>
            )}
             {nextWorkoutLevelInfo === null && totalWorkoutsCount > 0 && (
                 <p className="text-sm font-semibold text-yellow-500 text-center mb-4 flex items-center justify-center">
                    <StarIcon className="w-5 h-5 inline mr-1" solid />
                    {APP_STRINGS.maxLevelReachedText}
                </p>
             )}
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <div className="bg-teal-50 p-4 sm:p-6 rounded-xl shadow-lg border border-teal-600">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-teal-700 flex items-center">
                <FootstepsIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-teal-500" />
                {APP_STRINGS.walkingChallengeHomeTitle}
              </h2>
               <button
                onClick={() => setShowWalkingChallengeInfoModal(true)}
                className="p-1 text-gray-500 hover:text-teal-500 transition-colors"
                title={APP_STRINGS.walkingChallengeInfoButtonTooltip}
                aria-label={APP_STRINGS.walkingChallengeInfoButtonTooltip}
               >
                <InformationCircleIcon className="w-6 h-6" />
              </button>
            </div>
             {walkingChallengeCurrentDay > 0 && (
                <p className="text-center text-gray-700 mb-2">
                    {APP_STRINGS.walkingChallengeDayDisplay
                        .replace('{day}', walkingChallengeCurrentDay.toString())
                        .replace('{totalDays}', WALKING_CHALLENGE_TOTAL_DAYS.toString())}
                </p>
             )}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4">
              <div>
                <FootstepsIcon className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Dagar</p>
                <p className="text-lg sm:text-xl font-bold text-teal-600">{walkingChallengeCurrentDay} / {WALKING_CHALLENGE_TOTAL_DAYS}</p>
              </div>
              <div>
                <FireIcon className="mx-auto" streakLevel={getStreakLevel(walkingStreak)} />
                <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.walkingChallengeStreakLabel}</p>
                <p className="text-lg sm:text-xl font-bold text-teal-600">{walkingStreak} <span className="text-sm font-normal">{APP_STRINGS.homeStreakUnit}</span></p>
              </div>
              <div>
                <AcademicCapIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.walkingChallengeCurrentLevelLabel}</p>
                <p className="text-lg sm:text-xl font-bold text-purple-600 break-words">{currentWalkingLevel ? truncateText(currentWalkingLevel.name, 10) : '-'}</p>
              </div>
            </div>

            {nextWalkingLevelInfoProp && nextWalkingLevelInfoProp.nextLevelDef && nextWalkingLevelInfoProp.daysToNextLevel > 0 && walkingChallengeCurrentDay < WALKING_CHALLENGE_TOTAL_DAYS && (
              <div className="mb-4">
                <p className="text-sm text-purple-600 text-center mb-1">
                  {APP_STRINGS.daysToNextWalkingLevelText
                    .replace('{count}', nextWalkingLevelInfoProp.daysToNextLevel.toString())
                    .replace('{levelName}', truncateText(nextWalkingLevelInfoProp.nextLevelDef.name, 10))}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${nextWalkingLevelInfoProp.percentageToNext}%` }}
                    role="progressbar"
                    aria-valuenow={nextWalkingLevelInfoProp.percentageToNext}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Framsteg till nästa gångnivå"
                  ></div>
                  <ProgressSparks
                      key={walkingLevelSparkKey}
                      percentage={nextWalkingLevelInfoProp.percentageToNext}
                      sparkColor="bg-purple-300"
                    />
                </div>
              </div>
            )}
            {walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && (
                 <p className="text-sm font-semibold text-yellow-500 text-center mb-4 flex items-center justify-center">
                    <StarIcon className="w-5 h-5 inline mr-1" solid />
                    {APP_STRINGS.walkingChallengeAllDaysCompleted}
                </p>
            )}
          </div>
        </section>
        
        <section className="mb-6 sm:mb-8">
            <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg border border-yellow-600">
              <h2 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-3 flex items-center justify-start"> 
                <LightbulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
                {APP_STRINGS.homeDailyExtraTitle}
              </h2>
              {dailyExtraContent && <p className="text-yellow-700 italic mb-4 text-center">{dailyExtraContent.text}</p>} 
              <Button onClick={handleShowPepMessage} className="w-full text-lg py-3 shadow-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900 focus:ring-yellow-300 border border-yellow-500 active:bg-yellow-600">
                {APP_STRINGS.homeDailyPepButtonText}
            </Button>
           </div>
        </section>

        <section className="mb-6 sm:mb-8">
            <div className="bg-pink-50 p-4 sm:p-6 rounded-xl shadow-lg border border-pink-400">
                <h2 className="text-xl sm:text-2xl font-bold text-pink-700 mb-3 flex items-center justify-start"> 
                    <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-pink-500" />
                    {APP_STRINGS.spreadLoveCardTitle}
                </h2>
                <p className="text-gray-800 mb-4 text-center">{APP_STRINGS.spreadLoveCardText}</p> 
                <Button
                    onClick={handleShareApp}
                    disabled={isSharingHomeApp}
                    variant="pink"
                    className="w-full text-lg py-3 shadow-md flex items-center justify-center"
                >
                    {isSharingHomeApp ? 'Delar...' : APP_STRINGS.spreadLoveCardButton } <HeartIcon className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </section>

        <nav className="space-y-3">
            <Button
                onClick={() => navigateToSection(View.Profile, 'profile')}
                className="w-full text-lg py-3.5 bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 flex items-center justify-center"
            >
                <UserIcon className="w-6 h-6 mr-3 text-gray-600" /> {APP_STRINGS.homeNavButtonDiplomasAndFavorites}
            </Button>
            <Button
                onClick={() => navigateToSection(View.SpreadLove, 'info_contact')}
                className="w-full text-lg py-3.5 bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 flex items-center justify-center"
            >
                <InformationCircleIcon className="w-6 h-6 mr-3 text-gray-600" /> {APP_STRINGS.homeNavButtonInfoAndContact}
            </Button>
            <Button
                onClick={() => navigateToSection(View.Tips, 'tips_inspiration')}
                className="w-full text-lg py-3.5 bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 flex items-center justify-center"
            >
                <LightbulbIcon className="w-6 h-6 mr-3 text-gray-600" /> {APP_STRINGS.homeNavButtonTipsAndInspiration}
            </Button>
        </nav>

      </div>
      
      <div className="fab-container">
        <div className={`fab-menu ${isFabMenuOpen ? 'open' : ''}`} role="menu" aria-orientation="vertical" aria-labelledby="fab-action-button">
          {fabMenuItems.map((item, index) => (
            <div 
              key={item.label} 
              className="fab-menu-item-wrapper"
              style={{ transitionDelay: `${isFabMenuOpen ? index * 0.07 : (fabMenuItems.length - 1 - index) * 0.05}s` }}
            >
              <button
                onClick={() => handleFabMenuItemClick(item.action)}
                disabled={item.disabled}
                title={item.title}
                className={`fab-menu-item ${item.itemClass}`}
                role="menuitem"
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
        <button
          id="fab-action-button"
          className={`fab-button ${isFabMenuOpen ? 'open' : ''}`}
          onClick={toggleFabMenu}
          aria-haspopup="true"
          aria-expanded={isFabMenuOpen}
          aria-controls={isFabMenuOpen ? "fab-menu-list" : undefined}
          aria-label={isFabMenuOpen ? "Stäng åtgärdsmeny" : "Öppna åtgärdsmeny"}
        >
          {isFabMenuOpen ? <XCircleIcon /> : <PlusCircleIcon />}
        </button>
      </div>


      <SimpleModal isOpen={showWalkingChallengeInfoModal} onClose={() => setShowWalkingChallengeInfoModal(false)} title={APP_STRINGS.walkingChallengeInfoModalTitle}>
        <div className="text-left space-y-3">
          <p><span className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalPurposeLabel}</span> {APP_STRINGS.walkingChallengeInfoModalPurposeText}</p>
          <p className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalHowItWorksLabel}</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>{APP_STRINGS.walkingChallengeInfoModalRule1ManualLog}</li>
            <li>{APP_STRINGS.walkingChallengeInfoModalRule2}</li>
            <li>{APP_STRINGS.walkingChallengeInfoModalRule3}</li>
            <li>{APP_STRINGS.walkingChallengeInfoModalRule4}</li>
            <li>{APP_STRINGS.walkingChallengeInfoModalRule5}</li>
          </ul>
          <p><span className="font-semibold">{APP_STRINGS.walkingChallengeInfoModalTipsLabel}</span> {APP_STRINGS.walkingChallengeInfoModalTipsText}</p>
        </div>
      </SimpleModal>

      <SimpleModal isOpen={showWorkoutChallengeInfoModal} onClose={() => setShowWorkoutChallengeInfoModal(false)} title={APP_STRINGS.workoutChallengeInfoModalTitle}>
        <div className="text-left space-y-3">
          <p><span className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalPurposeLabel}</span> {APP_STRINGS.workoutChallengeInfoModalPurposeText}</p>
          <p className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalHowItWorksLabel}</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>{APP_STRINGS.workoutChallengeInfoModalRule1}</li>
            <li>{APP_STRINGS.workoutChallengeInfoModalRule2}</li>
            <li>{APP_STRINGS.workoutChallengeInfoModalRuleGenerated}</li>
            <li>{APP_STRINGS.workoutChallengeInfoModalRule3}</li>
            <li>{APP_STRINGS.workoutChallengeInfoModalRule4}</li>
          </ul>
          <p><span className="font-semibold">{APP_STRINGS.workoutChallengeInfoModalTipsLabel}</span> {APP_STRINGS.workoutChallengeInfoModalTipsText}</p>
        </div>
      </SimpleModal>

       <SimpleModal isOpen={showPepModal} onClose={handleClosePepModal} title={APP_STRINGS.pepModalTitle} theme="pep">
        <p className="text-xl text-center font-medium">{currentPepMessage}</p>
      </SimpleModal>

      <SimpleModal isOpen={showScoreInfoModal} onClose={() => setShowScoreInfoModal(false)} title={APP_STRINGS.homeSummerScoreInfoModalTitle}>
        <div className="text-left space-y-3 text-gray-700">
          <p>{APP_STRINGS.homeSummerScoreInfoModalDesc1}</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>{APP_STRINGS.homeSummerScoreInfoModalWorkoutPoints.replace('{points}', maxWorkoutPoints.toString())}</li>
            <li>{APP_STRINGS.homeSummerScoreInfoModalWalkingPoints.replace('{points}', maxWalkingPoints.toString())}</li>
            <li>{APP_STRINGS.homeSummerScoreInfoModalAchievementPoints.replace('{points}', maxAchievementPoints.toString())}</li>
          </ul>
        </div>
      </SimpleModal>

       {showShareSuperstarModal && userName && (
        <SimpleModal
          isOpen={showShareSuperstarModal}
          onClose={() => setShowShareSuperstarModal(false)}
          title={APP_STRINGS.superSharerModalTitleEnhanced}
        >
          <p className="text-lg text-gray-700 text-center mb-3">
            {APP_STRINGS.superSharerModalMessage1Enhanced.replace('{name}', userName)}
          </p>
          <p className="text-md text-gray-700 text-center font-semibold mb-3">
            {APP_STRINGS.superSharerModalRewardDetails}
          </p>
          <p className="text-md text-gray-700 text-center mb-4">
            {APP_STRINGS.superSharerModalInstructionsAndCode}
          </p>
          <p className="text-xs text-gray-500 text-center">
            {APP_STRINGS.superSharerModalFinePrint}
          </p>
        </SimpleModal>
      )}

    </div>
  );
};
