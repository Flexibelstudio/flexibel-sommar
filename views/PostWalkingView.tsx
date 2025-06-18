
import React, { useEffect, useState, useRef } from 'react';
import { View, Level, CurrentWalkingCompletionData, WalkingDiplomaData, WalkingLogEntry } from '../types';
import { APP_STRINGS, WALKING_LEVEL_DEFINITIONS, WALKING_CHALLENGE_TOTAL_DAYS, WALKING_CHALLENGE_DAILY_MINUTES } from '../constants';
import { Button } from '../components/Button';
import { FootstepsIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, StarIcon, AcademicCapIcon, FireIcon, ShareIcon, ArrowLeftIcon, CertificateIcon } from '../components/Icons'; // Added ArrowLeftIcon and CertificateIcon
import { triggerConfetti, triggerHeartsAnimation } from '../utils/animations';
import { truncateText } from '../utils/textUtils';
import * as localStorageService from '../services/localStorageService';
import * as analyticsService from '../services/analyticsService'; // Import analytics service
import { parseNumericValue } from '../utils/scoreUtils';
import { ProgressSparks } from '../components/ProgressSparks'; // Import ProgressSparks
import { LevelUpAnimation } from '../components/LevelUpAnimations'; // Import LevelUpAnimation

const formatDurationFromMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours} tim ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} tim`;
  } else {
    return `${minutes} min`;
  }
};


interface PostWalkingViewProps {
  onNavigate: (view: View, data?: any) => void;
  userName: string | null;
  completionData: CurrentWalkingCompletionData;
}

export const PostWalkingView = ({ onNavigate, userName, completionData }: PostWalkingViewProps): JSX.Element | null => {
  const [messages, setMessages] = useState<string[]>([]);
  const nameOrDefault = userName || "Du";
  const [distanceInput, setDistanceInput] = useState(completionData.distance || '');
  const [stepsInput, setStepsInput] = useState(completionData.steps || '');
  const [commentInput, setCommentInput] = useState(completionData.comment || '');
  const [showWalkingLevelUpAnim, setShowWalkingLevelUpAnim] = useState(false);

  const [nextLevelInfo, setNextLevelInfo] = useState<{
    nextLevel: Level | null;
    daysToNext: number;
    percentageToNextLevel: number;
  } | null>(null);
  
  const [sparkKey, setSparkKey] = useState(0);
  const prevProgressPercentageRef = useRef<number>(0);

  const challengeDayConsideredComplete = !completionData.abortedByUser; 

  useEffect(() => {
    if (!challengeDayConsideredComplete) {
      let abortedMessage = APP_STRINGS.postWalkingAbortedInfoShort; 
      if (completionData.completedDurationMinutes > 0) {
           abortedMessage = APP_STRINGS.postWalkingAbortedInfoLong
            .replace('{duration}', formatDurationFromMinutes(completionData.completedDurationMinutes))
            .replace('{min_duration}', WALKING_CHALLENGE_DAILY_MINUTES.toString());
      }
      setMessages([abortedMessage]);
      setNextLevelInfo(null);
      return;
    }

    if (challengeDayConsideredComplete) {
        triggerConfetti(completionData.didLevelUp); 
    }
    if (completionData.didLevelUp) {
        triggerHeartsAnimation();
        setShowWalkingLevelUpAnim(true);
    }

    const newMessages: string[] = [];    
    newMessages.push(
      APP_STRINGS.postWalkingSuccessMessage
        .replace('{name}', nameOrDefault)
        .replace('{dayNumber}', completionData.newChallengeDay.toString())
    );
    
    newMessages.push(APP_STRINGS.postWalkingDurationLogged.replace('{duration}', formatDurationFromMinutes(completionData.completedDurationMinutes)));
    
    if (completionData.currentStreak > 1) {
        newMessages.push(APP_STRINGS.postWalkingStreakMessage.replace('{streak}', completionData.currentStreak.toString()));
    }

    setMessages(newMessages);

    const currentLevelFromCompletion = completionData.level;
    const completedDays = completionData.newChallengeDay;

    const currentLevelIndex = WALKING_LEVEL_DEFINITIONS.findIndex(l => l.name === currentLevelFromCompletion.name);
    const nextLevelDefinition = (currentLevelIndex !== -1 && currentLevelIndex < WALKING_LEVEL_DEFINITIONS.length - 1) 
      ? WALKING_LEVEL_DEFINITIONS[currentLevelIndex + 1] 
      : null;

    let calculatedProgressPercentage = 0;
    if (nextLevelDefinition && nextLevelDefinition.minDays !== undefined && currentLevelFromCompletion.minDays !== undefined) {
      const daysNeededForNext = nextLevelDefinition.minDays - currentLevelFromCompletion.minDays;
      const daysMadeInCurrentLevel = completedDays - currentLevelFromCompletion.minDays;
      
        if (completedDays >= nextLevelDefinition.minDays) { 
            calculatedProgressPercentage = 100;
        } else if (daysNeededForNext > 0) {
             calculatedProgressPercentage = (daysMadeInCurrentLevel / daysNeededForNext) * 100;
        }
      setNextLevelInfo({
        nextLevel: nextLevelDefinition,
        daysToNext: Math.max(0, nextLevelDefinition.minDays - completedDays),
        percentageToNextLevel: Math.max(0, Math.min(100, calculatedProgressPercentage))
      });
    } else {
      setNextLevelInfo(null); 
    }

    if (calculatedProgressPercentage > prevProgressPercentageRef.current && calculatedProgressPercentage < 100) {
      setSparkKey(prev => prev + 1);
    }
    prevProgressPercentageRef.current = calculatedProgressPercentage;

  }, [completionData, nameOrDefault, challengeDayConsideredComplete]);


  const passDataToNavigateHome = () => {
    const navigationPayload = {
      logTimestampToUpdate: completionData.logTimestamp.getTime(), 
      distance: distanceInput.trim() || undefined,
      steps: stepsInput.trim() || undefined,
      comment: commentInput.trim() || undefined,
    };
    onNavigate(View.Home, navigationPayload);
  };


  const handleShowWalkingDiploma = () => {
    if (!challengeDayConsideredComplete) return;

    const currentDistanceNum = parseNumericValue(distanceInput);
    const currentStepsNum = parseNumericValue(stepsInput);

    let isNewDistRecord = false;
    let prevBestDistStr: string | undefined = undefined;
    let isNewStepsRec = false;
    let prevBestStepsStr: string | undefined = undefined;

    const walkingLogs = localStorageService.getWalkingLog();
    const historicalLogs = walkingLogs.filter(
      log => log.logTimestamp !== completionData.logTimestamp.getTime()
    );

    if (currentDistanceNum !== null) {
      let bestPrevDist = -1;
      historicalLogs.forEach(log => {
        if (log.distance) {
          const logDistNum = parseNumericValue(log.distance);
          if (logDistNum !== null && logDistNum > bestPrevDist) {
            bestPrevDist = logDistNum;
            prevBestDistStr = log.distance;
          }
        }
      });
      isNewDistRecord = currentDistanceNum > bestPrevDist;
      if (bestPrevDist === -1 && historicalLogs.every(log => !log.distance || parseNumericValue(log.distance) === null)) { 
        isNewDistRecord = true;
      }
    }
    
    if (currentStepsNum !== null) {
      let bestPrevSteps = -1;
      historicalLogs.forEach(log => {
        if (log.steps) {
          const logStepsNum = parseNumericValue(log.steps);
          if (logStepsNum !== null && logStepsNum > bestPrevSteps) {
            bestPrevSteps = logStepsNum;
            prevBestStepsStr = log.steps;
          }
        }
      });
      isNewStepsRec = currentStepsNum > bestPrevSteps;
      if (bestPrevSteps === -1 && historicalLogs.every(log => !log.steps || parseNumericValue(log.steps) === null)) { 
        isNewStepsRec = true;
      }
    }

    const diplomaDataToPass: WalkingDiplomaData = {
      userName: userName,
      challengeDayCompleted: completionData.newChallengeDay,
      logTimestamp: completionData.logTimestamp.getTime(), 
      actualStartTimestamp: completionData.actualStartTime ? completionData.actualStartTime.getTime() : undefined,
      walkingLevelNameAtCompletion: completionData.level.name,
      totalWalkingDaysAtThisPoint: completionData.newChallengeDay,
      walkingStreakAtThisPoint: completionData.currentStreak,
      didLevelUp: completionData.didLevelUp,
      distance: distanceInput.trim() || undefined,
      steps: stepsInput.trim() || undefined,
      isNewDistanceRecord: currentDistanceNum !== null ? isNewDistRecord : undefined,
      previousBestDistance: currentDistanceNum !== null && isNewDistRecord && prevBestDistStr ? prevBestDistStr : undefined,
      isNewStepsRecord: currentStepsNum !== null ? isNewStepsRec : undefined,
      previousBestSteps: currentStepsNum !== null && isNewStepsRec && prevBestStepsStr ? prevBestStepsStr : undefined,
      durationMinutes: completionData.completedDurationMinutes,
      comment: commentInput.trim() || undefined,
    };
    onNavigate(View.WalkingDiploma, diplomaDataToPass);
  };

  const handleShareAction = async (textTemplate: string, levelName?: string) => {
    let shareText = textTemplate.replace('{hashtag}', APP_STRINGS.appHashtag)
                                .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    if (levelName) {
      shareText = shareText.replace('{levelName}', levelName); 
    }
    if (textTemplate.includes('{totalDays}')) { 
        shareText = shareText.replace('{totalDays}', WALKING_CHALLENGE_TOTAL_DAYS.toString());
    }
    const shareUrl = window.location.origin + window.location.pathname;
    let shareMethod = 'unknown';

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Min Gå-Utmaning Prestation!",
          text: shareText,
          url: shareUrl,
        });
        triggerHeartsAnimation();
        shareMethod = 'navigator_api';
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText} ${shareUrl}`);
            triggerHeartsAnimation();
            shareMethod = 'clipboard_copy_after_error';
          } else {
            alert(`${shareText} ${shareUrl}`);
            shareMethod = 'alert_fallback';
          }
        } else {
            shareMethod = 'cancelled';
        }
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText} ${shareUrl}`);
      triggerHeartsAnimation();
      shareMethod = 'clipboard_copy';
    } else {
      alert(`${shareText} ${shareUrl}`);
      shareMethod = 'alert_fallback';
    }

    if (shareMethod !== 'cancelled') {
        let contentType = 'level_up_walking';
        let itemId = levelName || `Dag ${completionData.newChallengeDay}`;
        if (textTemplate === APP_STRINGS.shareWalkingChallengeCompletedText) {
            contentType = 'challenge_completed_walking';
            itemId = `challenge_walk_${WALKING_CHALLENGE_TOTAL_DAYS}_days`;
        }
        analyticsService.trackEvent('share', {
            event_category: 'user_engagement',
            event_action: 'share_content',
            method: shareMethod,
            content_type: contentType,
            item_id: itemId,
        });
    }
  };


  if (!challengeDayConsideredComplete) { 
    return (
      <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-red-50 text-gray-800">
        <div className="mt-2 mb-6 self-start">
          <Button
            onClick={() => passDataToNavigateHome()} 
            variant="ghost"
            className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
            aria-label={APP_STRINGS.backToHome}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{APP_STRINGS.backToHome}</span>
          </Button>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <XCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-red-700 mb-4">
            {APP_STRINGS.postWalkingAbortedTitle}
          </h2>
          {messages.map((msg, index) => (
            <p key={index} className="text-lg text-gray-700 mb-2 max-w-md break-words">{msg}</p>
          ))}
        </div>
      </div>
    );
  }
  
  const isChallengeFullyCompletedOver30Days = completionData.newChallengeDay >= WALKING_CHALLENGE_TOTAL_DAYS;
  const didLevelUpButNotCompleted = completionData.didLevelUp && !isChallengeFullyCompletedOver30Days;

  return (
    <div className="flex flex-col min-h-screen p-6 bg-sky-50 text-gray-800 relative">
      {showWalkingLevelUpAnim && (
        <LevelUpAnimation type="footstep" onAnimationEnd={() => setShowWalkingLevelUpAnim(false)} />
      )}
      <div className="mt-2 mb-6 self-start">
        <Button
          onClick={() => passDataToNavigateHome()} 
          variant="ghost"
          className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
          aria-label={APP_STRINGS.saveAndGoHomeButton}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{APP_STRINGS.saveAndGoHomeButton}</span>
        </Button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {isChallengeFullyCompletedOver30Days ? (
          <StarIcon className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-400 mb-6 animate-pulse" solid />
        ) : completionData.didLevelUp ? (
          <SparklesIcon className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-400 mb-6 animate-bounce" />
        ) : (
          <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-sky-500 mb-6" />
        )}
        
        <h2 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-2">
          {isChallengeFullyCompletedOver30Days ? APP_STRINGS.postWalkingChallengeFullyCompletedMessage.replace('{name}', nameOrDefault).replace('{totalDays}', WALKING_CHALLENGE_TOTAL_DAYS.toString()) : APP_STRINGS.postWalkingTitle} 
        </h2>

        {completionData.didLevelUp && !isChallengeFullyCompletedOver30Days && (
          <div className="my-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md w-full max-w-md">
            <p className="text-2xl font-bold text-yellow-700 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 mr-2 text-yellow-500" />
              {APP_STRINGS.postWalkingLevelUpMessage
                .replace('{name}', nameOrDefault)
                .replace('{levelName}', completionData.level.name)}
            </p>
          </div>
        )}

        <div className="my-4 space-y-2 max-w-md">
          {messages.map((msg, index) => (
            <p key={index} className={`text-gray-700 text-lg ${msg.includes("GRATTIS") || msg.includes("Utmaning Slutförd") ? 'font-semibold text-green-600' : ''} break-words`}>
              {msg}
            </p>
          ))}
        </div>

        <div className="my-6 p-4 bg-white border border-sky-200 rounded-lg shadow-sm w-full max-w-sm">
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex justify-around items-center">
                  {completionData.newChallengeDay > 0 && (
                    <div className="text-center">
                      <FootstepsIcon className="w-7 h-7 text-sky-500 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Avklarade Dagar</p>
                      <p className="text-xl font-bold text-sky-600">
                        {completionData.newChallengeDay} <span className="text-sm font-medium">/ {WALKING_CHALLENGE_TOTAL_DAYS}</span>
                      </p>
                    </div>
                  )}
                  {completionData.currentStreak > 0 && (
                    <div className="text-center">
                      <FireIcon className="w-7 h-7 text-orange-500 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.walkingChallengeStreakLabel}</p>
                      <p className="text-xl font-bold text-sky-600">
                        {completionData.currentStreak} <span className="text-sm font-medium">{APP_STRINGS.homeStreakUnit}</span>
                      </p>
                    </div>
                  )}
              </div>
              {completionData.level && (
                  <div className="text-center border-t pt-3 mt-3 border-sky-100">
                      <div className="flex items-center justify-center mb-1">
                          <AcademicCapIcon className="w-6 h-6 text-purple-500 mr-2" />
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{APP_STRINGS.walkingChallengeCurrentLevelLabel}</p>
                      </div>
                      <p className="text-lg font-bold text-purple-600">{truncateText(completionData.level.name, 10)}</p>
                      
                      {nextLevelInfo && nextLevelInfo.nextLevel && nextLevelInfo.daysToNext > 0 && !isChallengeFullyCompletedOver30Days && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            {APP_STRINGS.daysToNextWalkingLevelText
                              .replace('{count}', nextLevelInfo.daysToNext.toString())
                              .replace('{levelName}', nextLevelInfo.nextLevel.name)}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 relative overflow-hidden">
                            <div 
                              className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${nextLevelInfo.percentageToNextLevel}%` }}
                              aria-label="Framsteg till nästa gångnivå"
                            ></div>
                            <ProgressSparks
                              key={sparkKey}
                              percentage={nextLevelInfo.percentageToNextLevel}
                              sparkColor="bg-purple-300"
                            />
                          </div>
                        </div>
                      )}
                      {isChallengeFullyCompletedOver30Days && ( 
                        <p className="mt-3 text-sm font-semibold text-yellow-500 flex items-center justify-center">
                          <StarIcon className="w-5 h-5 inline mr-1" solid />
                          Alla nivåer uppnådda i Gå-Utmaningen!
                        </p>
                      )}
                  </div>
              )}
            </div>
          </div>
          
          {challengeDayConsideredComplete && ( 
              <div className="my-6 w-full max-w-sm space-y-4">
                  <div>
                      <label htmlFor="walkingDistance" className="block text-sm font-medium text-gray-700 mb-1">
                      {APP_STRINGS.postWalkingDistanceLabel}
                      </label>
                      <input
                      id="walkingDistance"
                      type="text" 
                      value={distanceInput}
                      onChange={(e) => setDistanceInput(e.target.value)}
                      placeholder={APP_STRINGS.postWalkingDistancePlaceholder}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
                      />
                  </div>
                  <div>
                      <label htmlFor="walkingSteps" className="block text-sm font-medium text-gray-700 mb-1">
                      {APP_STRINGS.postWalkingStepsLabel}
                      </label>
                      <input
                      id="walkingSteps"
                      type="text" 
                      value={stepsInput}
                      onChange={(e) => setStepsInput(e.target.value)}
                      placeholder={APP_STRINGS.postWalkingStepsPlaceholder}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
                      />
                  </div>
                  <div>
                      <label htmlFor="walkingComment" className="block text-sm font-medium text-gray-700 mb-1">
                        {APP_STRINGS.logWalkCommentLabel}
                      </label>
                      <textarea
                        id="walkingComment"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={APP_STRINGS.logWalkCommentPlaceholder}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
                      />
                  </div>
              </div>
          )}
        
        <div className="mt-6 space-y-4 w-full max-w-xs">
          {didLevelUpButNotCompleted && challengeDayConsideredComplete && (
              <Button
                  onClick={() => handleShareAction(APP_STRINGS.shareWalkingLevelUpText, completionData.level.name)}
                  variant="primary"
                  className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 border-yellow-600 active:bg-yellow-700"
              >
                  <ShareIcon className="w-5 h-5 mr-2" /> {APP_STRINGS.shareLevelUpButton}
              </Button>
          )}
          {isChallengeFullyCompletedOver30Days && challengeDayConsideredComplete && (
              <Button
                  onClick={() => handleShareAction(APP_STRINGS.shareWalkingChallengeCompletedText.replace('{name}', nameOrDefault))}
                  variant="primary"
                  className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 border-green-600 active:bg-green-700"
              >
                  <ShareIcon className="w-5 h-5 mr-2" /> {APP_STRINGS.shareChallengeCompletedButton}
              </Button>
          )}
          {challengeDayConsideredComplete && (
              <Button 
                  onClick={handleShowWalkingDiploma}
                  variant="secondary"
                  className="w-full flex items-center justify-center"
              >
                  <CertificateIcon className="w-5 h-5 mr-2" /> {APP_STRINGS.postWalkingShowDiplomaButton}
              </Button>
          )}
        </div>
      </div>
    </div>
  );
};