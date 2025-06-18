
import React from 'react';
import { View, DiplomaData } from '../types';
import { APP_STRINGS } from '../constants';
import { Button } from '../components/Button';
import { ShareIcon, CertificateIcon, StarIcon, SparklesIcon, TrophyIcon, XCircleIcon } from '../components/Icons'; // Added XCircleIcon, removed ArrowLeftIcon
import { triggerHeartsAnimation } from '../utils/animations';

interface DiplomaViewProps {
  diplomaData: DiplomaData;
  onNavigate: (view: View, data?: any) => void;
  previousView: View;
}

const formatDuration = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const DiplomaView = ({ diplomaData, onNavigate, previousView }: DiplomaViewProps): JSX.Element | null => {
  const { 
    workoutTitle, 
    userName, 
    levelName, 
    completionDateTime, 
    workoutDurationSeconds,
    totalWorkoutsCompleted, 
    comment, 
    didLevelUp,
    score,
    isNewRecord,
    previousBestScore 
  } = diplomaData;

  const formattedDate = completionDateTime.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let displayTime: string;
  if (workoutDurationSeconds !== undefined && !isNaN(workoutDurationSeconds)) {
    displayTime = formatDuration(workoutDurationSeconds);
  } else {
    // Fallback to time of day if duration is not available
    displayTime = completionDateTime.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }


  const handleShare = async () => {
    const shareText = APP_STRINGS.shareWorkoutDiplomaText
      .replace('{workoutTitle}', workoutTitle)
      .replace('{date}', formattedDate)
      .replace('{time}', displayTime) // Use displayTime which now holds duration or fallback
      .replace('{levelName}', levelName)
      .replace('{hashtag}', APP_STRINGS.appHashtag)
      .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);

    if (navigator.share) {
      try {
        await navigator.share({
          title: APP_STRINGS.diplomaViewTitle,
          text: shareText,
          url: window.location.origin + window.location.pathname, 
        });
        triggerHeartsAnimation();
      } catch (error: any) { 
        if (error.name === 'AbortError') {
          console.log('Share operation cancelled by the user.');
        } else {
          console.error('Error sharing:', error);
          if (navigator.clipboard) {
              try {
                await navigator.clipboard.writeText(shareText);
                alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText}`);
                triggerHeartsAnimation();
              } catch (clipboardErr) {
                console.error('Error copying to clipboard after share error:', clipboardErr);
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
        console.error('Error copying to clipboard:', err);
        alert(shareText); 
      }
    } else {
        alert(shareText); 
    }
  };

  const nameToDisplay = userName || 'Du';
  const congratulationsText = APP_STRINGS.diplomaCongratulations.replace('{name}', nameToDisplay.toUpperCase());
  const headlineText = userName 
    ? APP_STRINGS.diplomaHeadlineUser.replace('{name}', nameToDisplay)
    : APP_STRINGS.diplomaHeadlineGeneric;

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gradient-to-br from-[#E4F0F0] to-[#C2DCDC] text-gray-800">
      <div className="flex items-center justify-center mt-2 mb-6 relative"> {/* Centered title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#418484] flex items-center">
          <CertificateIcon className="w-8 h-8 mr-3 text-[#51A1A1]" />
          {APP_STRINGS.diplomaViewTitle}
        </h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-lg mx-auto text-center border-4 border-[#A3D3D3] relative">
          <Button
            onClick={() => onNavigate(previousView)}
            variant="ghost"
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full"
            aria-label={APP_STRINGS.closeDiplomaButtonAriaLabel}
          >
            <XCircleIcon className="w-7 h-7" />
          </Button>
          <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-[#51A1A1] rounded-tl-lg"></div>
          <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-[#51A1A1] rounded-tr-lg"></div>
          <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-[#51A1A1] rounded-bl-lg"></div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-[#51A1A1] rounded-br-lg"></div>
          
          <CertificateIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#316767] mb-3">{congratulationsText}</h2>
          <p className="text-lg text-gray-700 mb-2">{headlineText}</p>
          
          {didLevelUp && (
            <div className="flex items-center justify-center text-xl font-semibold text-yellow-600 mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
              <SparklesIcon className="w-6 h-6 mr-2" />
              {APP_STRINGS.diplomaNewLevelReachedText} {levelName}!
            </div>
          )}
          
          <div className="border-y-2 border-dashed border-[#C2DCDC] py-6 my-6 space-y-3 text-left px-4">
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaWorkoutLabel}</span>{' '}
              <span className="text-[#51A1A1] font-medium">{workoutTitle}</span>
            </p>
            {score && (
              <div className="mt-2 text-md sm:text-lg">
                 {isNewRecord && (
                  <div className="flex items-center text-green-600 font-bold mb-1">
                    <TrophyIcon className="w-5 h-5 mr-1"/>
                    {APP_STRINGS.diplomaNewRecordText}
                  </div>
                )}
                <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaYourScoreLabel}</span>{' '}
                <span className="text-[#51A1A1] font-medium">{score}</span>
                {isNewRecord && previousBestScore && (
                  <span className="text-xs text-gray-500 ml-2">({APP_STRINGS.diplomaPreviousBestText} {previousBestScore})</span>
                )}
              </div>
            )}
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaDateLabel}</span>{' '}
              <span className="text-[#51A1A1] font-medium">{formattedDate}</span>
            </p>
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaTimeLabel}</span>{' '}
              <span className="text-[#51A1A1] font-medium">{displayTime}</span>
            </p>
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaLevelLabel}</span>{' '}
              <span className="text-[#51A1A1] font-medium">{levelName}</span>
            </p>
            <p className="text-md sm:text-lg">
              <span className="font-semibold text-gray-800">{APP_STRINGS.diplomaTotalWorkoutsLabel}</span>{' '}
              <span className="text-[#51A1A1] font-medium">{totalWorkoutsCompleted}</span>
            </p>
            {comment && (
              <div className="pt-3 border-t border-dashed border-[#C2DCDC] mt-3">
                <p className="font-semibold text-gray-800 text-md sm:text-lg">{APP_STRINGS.diplomaCommentLabel}</p>
                <blockquote className="text-gray-600 italic text-sm sm:text-base mt-1">"{comment}"</blockquote>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
            <StarIcon className="w-5 h-5 text-yellow-400 mr-1" solid />
            Fortsätt kämpa och samla fler diplom!
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">{APP_STRINGS.appMainCampaignTitle}</p>
          </div>
        </div>

        <Button 
          onClick={handleShare} 
          variant="primary" 
          className="mt-8 w-full max-w-xs text-lg py-3 flex items-center justify-center"
        >
          <ShareIcon className="w-5 h-5 mr-2"/>
          {APP_STRINGS.shareDiplomaButton}
        </Button>
      </div>
    </div>
  );
};
