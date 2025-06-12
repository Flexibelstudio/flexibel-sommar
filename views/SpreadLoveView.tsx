
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { APP_STRINGS, BLOG_URL } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, HeartIcon, ShareIcon, BookOpenIcon, InformationCircleIcon } from '../components/Icons'; // Added InformationCircleIcon
import { triggerHeartsAnimation } from '../utils/animations';
import * as localStorageService from '../services/localStorageService'; 

interface SpreadLoveViewProps {
  onNavigate: (view: View) => void;
  previousView: View;
}

export const SpreadLoveView = ({ onNavigate, previousView }: SpreadLoveViewProps): JSX.Element | null => {
  // Removed canNativeShare and appUrl state/constants as general app share is moved
  const bookingUrl = "https://www.flexibelfriskvardhalsa.se/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`;

  // performShare and copyToClipboardFallback are now specific to booking link sharing
  const copyToClipboardFallbackForBooking = async (text: string, url: string) => {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(`${text} ${url}`);
            alert(`${APP_STRINGS.linkCopiedToClipboard}`);
            triggerHeartsAnimation();
            // No incrementAppShareCount here as it's specific to App share
        } catch (err) {
            alert(`${text} ${url}`);
        }
    } else {
        alert(`${text} ${url}`);
    }
  };
  
  const handleShareBookingLink = async () => {
    const shareText = APP_STRINGS.shareBookingMessageText
      .replace('{bookingUrl}', bookingUrl)
      .replace('{hashtag}', APP_STRINGS.appHashtag)
      .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    const shareData = {
        title: "Boka Introsamtal hos Flexibel Hälsostudio",
        text: shareText,
        url: bookingUrl,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerHeartsAnimation();
        // No incrementAppShareCount here
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Share operation cancelled by the user or no share targets available.');
        } else {
          console.error('Error sharing:', error);
          await copyToClipboardFallbackForBooking(shareData.text, shareData.url);
        }
      }
    } else {
      await copyToClipboardFallbackForBooking(shareData.text, shareData.url);
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
          <InformationCircleIcon className="w-8 h-8 mr-3 text-[#51A1A1]" /> {/* Updated Icon */}
          {APP_STRINGS.spreadLoveViewTitle} {/* Updated title from constants */}
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto space-y-8">
        
        {/* About Us Section */}
        <section>
          <h2 className="text-xl font-semibold text-[#316767] mb-3 text-center">
            {APP_STRINGS.aboutUsSectionTitle}
          </h2>
          <div className="text-left text-gray-700 space-y-3">
            <p>{APP_STRINGS.aboutUsParagraph1}</p>
            <p>{APP_STRINGS.aboutUsParagraph2}</p>
            <p className="font-medium text-[#418484]">{APP_STRINGS.aboutUsTagline}</p>
          </div>
        </section>
        
        {/* Contact & Locations Section */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center">
            Kontakt & Studioplatser
          </h2>
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-700">
                <span className="font-semibold">{APP_STRINGS.contactEmailLabel}</span>{' '}
                <a href={`mailto:${APP_STRINGS.contactEmailValue}`} className="text-[#51A1A1] hover:underline">
                    {APP_STRINGS.contactEmailValue}
                </a>
            </p>
            <p className="text-lg text-gray-700">
                <span className="font-semibold">{APP_STRINGS.contactPhoneNumberLabel}</span>{' '}
                <a href={`tel:${APP_STRINGS.contactPhoneNumberValue.replace(/\s/g, '')}`} className="text-[#51A1A1] hover:underline">
                    {APP_STRINGS.contactPhoneNumberValue}
                </a>
            </p>
            <p className="text-lg text-gray-700 mt-2">
              {APP_STRINGS.spreadLoveStudioLocationsInfo}
            </p>
          </div>
        </section>

        {/* Boka Introsamtal Sektion */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center">
            {APP_STRINGS.bookIntroTitle}
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-[#418484] hover:text-[#51A1A1] underline font-medium text-center"
            >
              {APP_STRINGS.bookIntroLinkText}
            </a>
            <div className="p-2 bg-white inline-block rounded-lg shadow">
                <img
                src={qrCodeUrl}
                alt={APP_STRINGS.qrCodeAltText}
                className="w-48 h-48 sm:w-52 sm:h-52" 
                />
            </div>
            <Button
              onClick={handleShareBookingLink}
              variant="secondary"
              className="w-full max-w-xs text-md py-2.5 flex items-center justify-center"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              {APP_STRINGS.shareBookingButtonText}
            </Button>
            <p className="text-sm text-gray-500 text-center mt-2">
              Scanna QR-koden med din mobilkamera eller klicka på länken ovan.
            </p>
          </div>
        </section>
      </div>
      <footer className="mt-12 text-center text-sm text-gray-500">
        {APP_STRINGS.homeViewFooterText}
      </footer>
    </div>
  );
};
