
import React, { useState } from 'react';
import { View } from '../types';
import { APP_STRINGS, BLOG_URL, INSTAGRAM_URL, FACEBOOK_URL } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, LightbulbIcon, BookOpenIcon, InstagramIcon, FacebookIcon, StarIcon } from '../components/Icons'; // Added StarIcon
import { SimpleModal } from '../components/SimpleModal';
import * as audioService from '../services/audioService';


interface TipsViewProps {
  onNavigate: (view: View) => void;
  previousView: View;
}

export const TipsView: React.FC<TipsViewProps> = ({ onNavigate, previousView }) => {
  const [showHiddenStarModal, setShowHiddenStarModal] = useState(false);

  const handleHiddenStarClick = () => {
    audioService.playStarFindSound(); // Play a sound
    setShowHiddenStarModal(true);
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
          <LightbulbIcon className="w-8 h-8 mr-3 text-yellow-500" />
          {APP_STRINGS.tipsViewTitle} {/* Updated title from constants */}
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto space-y-8 hidden-star-icon-container"> {/* Added container class */}
        {/* Inspiration & Sommartips Sektion (Blog Link) */}
        <section>
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center flex items-center justify-center">
            <BookOpenIcon className="w-6 h-6 mr-2 text-orange-500" />
            {APP_STRINGS.summerReadingsTitle}
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 w-full max-w-xs"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              {APP_STRINGS.summerReadingsButton}
            </a>
            <p className="text-sm text-gray-600 text-center">
              Klicka på knappen för att besöka vår blogg och få mer inspiration!
            </p>
          </div>
        </section>

        {/* Instagram Link Section */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center flex items-center justify-center">
            <InstagramIcon className="w-6 h-6 mr-2 text-pink-600" />
            {APP_STRINGS.instagramSectionTitle}
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 w-full max-w-xs"
            >
              <InstagramIcon className="w-5 h-5 mr-2" />
              {APP_STRINGS.instagramButtonText}
            </a>
            <p className="text-sm text-gray-600 text-center">
              Följ oss på Instagram för daglig inspiration och studio-uppdateringar!
            </p>
          </div>
        </section>

        {/* Facebook Link Section */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-[#316767] mb-4 text-center flex items-center justify-center">
            <FacebookIcon className="w-6 h-6 mr-2 text-blue-600" />
            {APP_STRINGS.facebookSectionTitle}
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full max-w-xs"
            >
              <FacebookIcon className="w-5 h-5 mr-2" />
              {APP_STRINGS.facebookButtonText}
            </a>
            <p className="text-sm text-gray-600 text-center">
              Gilla och följ vår sida på Facebook för nyheter och community!
            </p>
             {/* Hidden Star Easter Egg */}
            <button
                onClick={handleHiddenStarClick}
                className="hidden-star-icon-button p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1"
                aria-label="Dold stjärna"
             >
                <StarIcon
                    className="hidden-star-icon w-4 h-4 text-yellow-300 hover:text-yellow-400 transition-colors"
                 />
            </button>
          </div>
        </section>

        {/* "Om Oss" and direct contact info removed from this view */}

      </div>
      {showHiddenStarModal && (
        <SimpleModal
          isOpen={showHiddenStarModal}
          onClose={() => setShowHiddenStarModal(false)}
          title="Flexibel-Stjärna Upptäckt!"
        >
          <p className="text-lg text-gray-700 text-center">
            Du hittade en Flexibel-stjärna! Strålande! ✨ 
            <br/><br/>
            Psst... de verkliga stjärnorna är våra coacher i studion. Kom och träffa dem!
          </p>
        </SimpleModal>
      )}
    </div>
  );
};
