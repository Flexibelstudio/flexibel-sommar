import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { APP_STRINGS, BLOG_URL } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, HeartIcon, ShareIcon, BookOpenIcon, InformationCircleIcon, CalendarDaysIcon } from '../components/Icons'; // Added CalendarDaysIcon
import { triggerHeartsAnimation } from '../utils/animations';
import * as localStorageService from '../services/localStorageService';
import * as analyticsService from '../services/analyticsService'; // Import analytics service

interface SpreadLoveViewProps {
  onNavigate: (view: View) => void;
  previousView: View;
}

export const SpreadLoveView = ({ onNavigate, previousView }: SpreadLoveViewProps): JSX.Element | null => {
  const bookingUrl = "https://www.flexibelfriskvardhalsa.se/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`;
  const appUrl = window.location.origin + window.location.pathname;

  const [isSharingApp, setIsSharingApp] = useState(false);
  const [isSharingBooking, setIsSharingBooking] = useState(false);

  const copyToClipboardFallback = async (text: string, urlToShare: string, contentType: 'app' | 'booking_link') => {
    let shareMethod = contentType === 'app' ? 'clipboard_copy_fallback_app' : 'clipboard_copy_fallback_booking';
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(`${text} ${urlToShare}`);
            alert(`${APP_STRINGS.linkCopiedToClipboard}`);
            triggerHeartsAnimation(); // Keep hearts for successful copy
            if (contentType === 'app') localStorageService.incrementAppShareCount();
            shareMethod = contentType === 'app' ? 'clipboard_copy_success_app' : 'clipboard_copy_success_booking';
        } catch (err) {
            alert(`${text} ${urlToShare}`); // Fallback to alert if clipboard fails
            shareMethod = contentType === 'app' ? 'clipboard_copy_error_alert_fallback_app' : 'clipboard_copy_error_alert_fallback_booking';
        }
    } else {
        alert(`${text} ${urlToShare}`); // Fallback for browsers without clipboard API
        shareMethod = contentType === 'app' ? 'no_clipboard_alert_fallback_app' : 'no_clipboard_alert_fallback_booking';
    }
    analyticsService.trackEvent('share', {
        event_category: 'user_engagement',
        event_action: 'share_content',
        method: shareMethod,
        content_type: contentType,
    });
  };


  const handleShareApp = async () => {
    if (isSharingApp) return;
    setIsSharingApp(true);
    const shareData = {
      title: APP_STRINGS.appName,
      text: `${APP_STRINGS.spreadLoveShareMotivationText} ${APP_STRINGS.appHashtag}`,
      url: appUrl,
    };
    let shareMethod = 'unknown';

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        triggerHeartsAnimation();
        localStorageService.incrementAppShareCount();
        shareMethod = 'navigator_api';
      } else {
        await copyToClipboardFallback(shareData.text, shareData.url, 'app');
        setIsSharingApp(false);
        return; // copyToClipboardFallback handles its own analytics for app type
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        shareMethod = 'cancelled';
      } else {
        console.error('Error sharing app:', error);
        await copyToClipboardFallback(shareData.text, shareData.url, 'app');
        setIsSharingApp(false);
        return; // copyToClipboardFallback handles its own analytics for app type
      }
    } finally {
      setIsSharingApp(false);
    }
    
    if (shareMethod !== 'cancelled' && shareMethod !== 'unknown' && !shareMethod.startsWith('clipboard_') && !shareMethod.startsWith('no_clipboard_')) {
        analyticsService.trackEvent('share', {
            event_category: 'user_engagement',
            event_action: 'share_content',
            method: shareMethod,
            content_type: 'app',
        });
    }
  };

  const handleShareBookingLink = async () => {
    if (isSharingBooking) return;
    setIsSharingBooking(true);
    const shareText = APP_STRINGS.shareBookingMessageText
      .replace('{bookingUrl}', bookingUrl)
      .replace('{hashtag}', APP_STRINGS.appHashtag)
      .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    const shareData = {
      title: APP_STRINGS.bookIntroTitle,
      text: shareText,
      url: bookingUrl,
    };
    let shareMethod = 'unknown';
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        triggerHeartsAnimation();
        shareMethod = 'navigator_api';
      } else {
        await copyToClipboardFallback(shareData.text, shareData.url, 'booking_link');
        setIsSharingBooking(false);
        return; // copyToClipboardFallback handles its own analytics for booking_link type
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        shareMethod = 'cancelled';
      } else {
        console.error('Error sharing booking link:', error);
        await copyToClipboardFallback(shareData.text, shareData.url, 'booking_link');
        setIsSharingBooking(false);
        return; // copyToClipboardFallback handles its own analytics for booking_link type
      }
    } finally {
      setIsSharingBooking(false);
    }
    if (shareMethod !== 'cancelled' && shareMethod !== 'unknown' && !shareMethod.startsWith('clipboard_') && !shareMethod.startsWith('no_clipboard_')) {
         analyticsService.trackEvent('share', {
            event_category: 'user_engagement',
            event_action: 'share_content',
            method: shareMethod,
            content_type: 'booking_link',
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-800">
      <div className="w-full flex justify-start mt-2 mb-3">
        <Button
          onClick={() => onNavigate(previousView)}
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
          <InformationCircleIcon className="w-8 h-8 mr-3 text-[#51A1A1]" />
          {APP_STRINGS.spreadLoveViewTitle}
        </h1>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg mx-auto space-y-8">
        
        {/* Sprid Kärleken Kort */}
        <section className="bg-pink-50 p-6 rounded-xl shadow-lg border border-pink-400">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-700 mb-3 flex items-center justify-center">
                <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-pink-500" />
                {APP_STRINGS.spreadLoveCardTitle}
            </h2>
            <p className="text-gray-800 mb-4 text-center">{APP_STRINGS.spreadLoveCardText}</p>
            <Button
                onClick={handleShareApp}
                disabled={isSharingApp}
                variant="pink"
                className="w-full text-lg py-3 shadow-md flex items-center justify-center"
            >
                {isSharingApp ? 'Delar...' : APP_STRINGS.spreadLoveCardButton } <HeartIcon className="w-5 h-5 ml-2" />
            </Button>
        </section>


        {/* Om Oss Sektion */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-3 text-center">{APP_STRINGS.aboutUsSectionTitle}</h2>
          <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed">{APP_STRINGS.aboutUsParagraph1}</p>
          <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed">{APP_STRINGS.aboutUsParagraph2}</p>
          <p className="text-gray-700 font-semibold text-center text-md sm:text-lg">{APP_STRINGS.aboutUsTagline}</p>
        </section>

        {/* Kontaktinformation Sektion */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center">Kontaktinformation</h2>
          <div className="space-y-3 text-sm sm:text-base text-center">
            <p className="text-gray-700">
              <span className="font-medium">{APP_STRINGS.contactEmailLabel}</span>{' '}
              <a href={`mailto:${APP_STRINGS.contactEmailValue}`} className="text-[#51A1A1] hover:underline">
                {APP_STRINGS.contactEmailValue}
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">{APP_STRINGS.contactPhoneNumberLabel}</span>{' '}
              <a href={`tel:${APP_STRINGS.contactPhoneNumberValue.replace(/\s/g, '')}`} className="text-[#51A1A1] hover:underline">
                {APP_STRINGS.contactPhoneNumberValue}
              </a>
            </p>
            <p className="text-gray-600">{APP_STRINGS.spreadLoveStudioLocationsInfo}</p>
          </div>
        </section>

        {/* Boka Introsamtal Sektion */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center">{APP_STRINGS.bookIntroTitle}</h2>
          <div className="flex flex-col items-center space-y-4">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-[#51A1A1] hover:bg-[#418484] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#62BDBD] border border-[#418484] active:bg-[#316767] w-full max-w-xs"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              {APP_STRINGS.bookIntroLinkText}
            </a>
            <img 
              src={qrCodeUrl} 
              alt={APP_STRINGS.qrCodeAltText} 
              className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-pink-300 rounded-lg shadow-md" // Thematic pink border
            />
            <Button
              onClick={handleShareBookingLink}
              disabled={isSharingBooking}
              variant="pink" // Changed to pink variant
              className="w-full max-w-xs text-lg py-3 flex items-center justify-center" // Ensured consistent styling with other pink buttons
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              {isSharingBooking ? 'Delar...' : APP_STRINGS.shareBookingButtonText}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
