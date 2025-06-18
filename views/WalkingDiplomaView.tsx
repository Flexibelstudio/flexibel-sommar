
import React from 'react';
import { View, WalkingDiplomaData } from '../types';
import { APP_STRINGS } from '../constants';
import { Button } from '../components/Button';
import { ShareIcon, FootstepsIcon, StarIcon, SparklesIcon, TrophyIcon, XCircleIcon } from '../components/Icons';
import { triggerHeartsAnimation } from '../utils/animations'; 

interface WalkingDiplomaViewProps {
  walkingDiplomaData: WalkingDiplomaData;
  onNavigate: (view: View, data?: any) => void;
  previousView: View;
}

const formatTimeFromDateOrTimestamp = (timestamp: number | undefined): string => {
  if (timestamp === undefined) return '';
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
};


export const WalkingDiplomaView: React.FC<WalkingDiplomaViewProps> = ({ walkingDiplomaData, onNavigate, previousView }) => {
  const { 
    userName, 
    challengeDayCompleted, 
    logTimestamp, 
    actualStartTimestamp, 
    walkingLevelNameAtCompletion, 
    totalWalkingDaysAtThisPoint, 
    walkingStreakAtThisPoint,
    didLevelUp,
    distance,
    steps,
    isNewDistanceRecord,
    previousBestDistance,
    isNewStepsRecord,
    previousBestSteps,
    durationMinutes,
    comment, // Added comment to destructure
  } = walkingDiplomaData;

  const dateFromLogTimestamp = new Date(logTimestamp);

  const formattedCompletionDate = dateFromLogTimestamp.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedStartTime = formatTimeFromDateOrTimestamp(actualStartTimestamp);
  const formattedEndTime = formatTimeFromDateOrTimestamp(logTimestamp); // Use logTimestamp as end time for display


  const handleShare = async () => {
    let shareText: string;
    
    if (walkingStreakAtThisPoint && walkingStreakAtThisPoint > 0) {
        shareText = APP_STRINGS.shareWalkingDiplomaText 
            .replace('{challengeDay}', challengeDayCompleted.toString())
            .replace('{date}', formattedCompletionDate)
            .replace('{time}', formattedEndTime) 
            .replace('{levelName}', walkingLevelNameAtCompletion)
            .replace('{streak}', walkingStreakAtThisPoint.toString())
            .replace('{hashtag}', APP_STRINGS.appHashtag)
            .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    } else {
        shareText = APP_STRINGS.shareWalkingDiplomaNoStreakText  
            .replace('{challengeDay}', challengeDayCompleted.toString())
            .replace('{date}', formattedCompletionDate)
            .replace('{time}', formattedEndTime) 
            .replace('{levelName}', walkingLevelNameAtCompletion)
            .replace('{hashtag}', APP_STRINGS.appHashtag)
            .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    }


    if (navigator.share) {
      try {
        await navigator.share({
          title: APP_STRINGS.walkingDiplomaViewTitle,
          text: shareText,
          url: window.location.origin + window.location.pathname, 
        });
        triggerHeartsAnimation();
      } catch (error: any) { 
        if (error.name === 'AbortError') {
          console.log('Share operation cancelled by the user.');
        } else {
          console.error('Error sharing walking diploma:', error);
          if (navigator.clipboard) {
              try {
                await navigator.clipboard.writeText(shareText);
                alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText}`);
                triggerHeartsAnimation();
              } catch (clipboardErr) {
                alert(shareText); 
              }
          } else {
              alert(shareText); 
          }
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText}`);
        triggerHeartsAnimation();
      } catch (err) {
        alert(shareText); 
      }
    } else {
        alert(shareText); 
    }
  };

  const nameToDisplay = userName || 'Du';
  const congratulationsText = APP_STRINGS.walkingDiplomaCongratulations.replace('{name}', nameToDisplay.toUpperCase());
  const headlineText = userName 
    ? APP_STRINGS.walkingDiplomaHeadlineUser.replace('{name}', nameToDisplay)
    : APP_STRINGS.walkingDiplomaHeadlineGeneric;

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gradient-to-br from-sky-100 to-sky-300 text-gray-800">
      <div className="flex items-center justify-center mt-2 mb-6 relative"> 
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center">
          <FootstepsIcon className="w-8 h-8 mr-3 text-sky-600" />
          {APP_STRINGS.walkingDiplomaViewTitle}
        </h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-lg mx-auto text-center border-4 border-sky-400 relative">
           <Button
            onClick={() => onNavigate(previousView)}
            variant="ghost"
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full"
            aria-label={APP_STRINGS.closeDiplomaButtonAriaLabel}
          >
            <XCircleIcon className="w-7 h-7" />
          </Button>
          <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-sky-500 rounded-tl-lg"></div>
          <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-sky-500 rounded-tr-lg"></div>
          <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-sky-500 rounded-bl-lg"></div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-sky-500 rounded-br-lg"></div>
          
          <FootstepsIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-3">{congratulationsText}</h2>
          <p className="text-lg text-gray-700 mb-2">{headlineText}</p>
          
          {didLevelUp && (
            <div className="flex items-center justify-center text-xl font-semibold text-yellow-700 mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded-md">
              <SparklesIcon className="w-6 h-6 mr-2 text-yellow-600" />
              {APP_STRINGS.diplomaNewLevelReachedText} {walkingLevelNameAtCompletion}!
            </div>
          )}
          
          <div className="border-y-2 border-dashed border-sky-300 py-6 my-6 space-y-3 text-left px-4">
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaChallengeDayLabel}</span>{' '}
              <span className="text-sky-600 font-medium">{challengeDayCompleted}</span>
            </p>
            {actualStartTimestamp && (
              <p className="text-md sm:text-lg">
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaStartTimeLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{formattedStartTime}</span>
              </p>
            )}
             <p className="text-md sm:text-lg">
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaEndTimeLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{formattedEndTime}</span>
              </p>
             {durationMinutes !== undefined && (
              <p className="text-md sm:text-lg">
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaDurationLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{durationMinutes} minuter</span>
              </p>
            )}
            {distance && (
              <div className="text-md sm:text-lg">
                {isNewDistanceRecord && (
                    <div className="flex items-center text-green-600 font-bold mb-1">
                        <TrophyIcon className="w-5 h-5 mr-1"/>
                        {APP_STRINGS.walkingDiplomaNewDistanceRecordText}
                    </div>
                )}
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaDistanceLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{distance} km</span>
                {isNewDistanceRecord && previousBestDistance && (
                    <span className="text-xs text-gray-500 ml-2">({APP_STRINGS.walkingDiplomaPreviousBestDistanceText} {previousBestDistance})</span>
                )}
              </div>
            )}
            {steps && (
              <div className="text-md sm:text-lg mt-2">
                 {isNewStepsRecord && (
                    <div className="flex items-center text-green-600 font-bold mb-1">
                        <TrophyIcon className="w-5 h-5 mr-1"/>
                        {APP_STRINGS.walkingDiplomaNewStepsRecordText}
                    </div>
                )}
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaStepsLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{steps} steg</span>
                 {isNewStepsRecord && previousBestSteps && (
                    <span className="text-xs text-gray-500 ml-2">({APP_STRINGS.walkingDiplomaPreviousBestStepsText} {previousBestSteps})</span>
                )}
              </div>
            )}
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaDateLabel}</span>{' '}
              <span className="text-sky-600 font-medium">{formattedCompletionDate}</span>
            </p>
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaLevelLabel}</span>{' '}
              <span className="text-sky-600 font-medium">{walkingLevelNameAtCompletion}</span>
            </p>
             <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaTotalDaysLabel}</span>{' '}
              <span className="text-sky-600 font-medium">{totalWalkingDaysAtThisPoint}</span>
            </p>
            {walkingStreakAtThisPoint !== undefined && walkingStreakAtThisPoint > 0 && (
              <p className="text-md sm:text-lg">
                <span className="font-semibold text-gray-800">{APP_STRINGS.walkingDiplomaStreakLabel}</span>{' '}
                <span className="text-sky-600 font-medium">{walkingStreakAtThisPoint} dagar</span>
              </p>
            )}
            {comment && (
              <div className="pt-3 border-t border-dashed border-sky-300 mt-3">
                <p className="font-semibold text-gray-800 text-md sm:text-lg">{APP_STRINGS.diplomaCommentLabel}</p>
                <blockquote className="text-gray-600 italic text-sm sm:text-base mt-1">"{comment}"</blockquote>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
            <StarIcon className="w-5 h-5 text-yellow-400 mr-1" solid />
            Fortsätt promenera och samla fler dagar!
          </p>
           <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">{APP_STRINGS.appMainCampaignTitle}</p>
          </div>
        </div>

        <Button 
          onClick={handleShare} 
          variant="primary" 
          className="mt-8 w-full max-w-xs text-lg py-3 flex items-center justify-center bg-sky-500 hover:bg-sky-600 border-sky-600 active:bg-sky-700"
        >
          <ShareIcon className="w-5 h-5 mr-2"/>
          {APP_STRINGS.shareWalkingDiplomaButton}
        </Button>
      </div>
    </div>
  );
};
