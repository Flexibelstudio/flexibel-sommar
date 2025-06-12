// Utility functions for triggering animations
import { playConfettiSound } from '../services/audioService'; // Added import

const festiveColors = [
  '#FFD700', // Gold
  '#FF69B4', // HotPink
  '#00CED1', // DarkTurquoise
  '#7FFF00', // Chartreuse
  '#FF4500', // OrangeRed
  '#9370DB', // MediumPurple
  '#32CD32', // LimeGreen
  '#51A1A1', // Flexibel Turquoise
  '#FFA07A', // LightSalmon
  '#ADD8E6', // LightBlue
];

const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;

export const triggerConfetti = (isLevelUp: boolean = false): void => {
  playConfettiSound(); 
  const container = document.getElementById('animation-container');
  if (!container) return;

  const confettiCount = isLevelUp ? 150 : 100; // More confetti for level up
  const fragment = document.createDocumentFragment();
  console.log("Triggering confetti, isLevelUp:", isLevelUp, "Count:", confettiCount);

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const size = getRandom(5, isLevelUp ? 15 : 12); // Slightly larger confetti for level up
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = festiveColors[Math.floor(Math.random() * festiveColors.length)];
    confetti.style.position = 'absolute';
    confetti.style.left = `${getRandom(0, 100)}vw`;
    confetti.style.top = `${getRandom(-200, -20)}px`; 
    confetti.style.opacity = '1';
    confetti.style.borderRadius = `${getRandom(0, 50)}%`; 

    const duration = isLevelUp ? getRandom(4, 8) : getRandom(3, 7); // Longer duration for level up
    const delay = getRandom(0, isLevelUp ? 0.8 : 0.5); 

    confetti.style.animation = `fall ${duration}s linear ${delay}s forwards`;
    fragment.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, (duration + delay + 0.5) * 1000); 
  }
  container.appendChild(fragment);
};

export const triggerHeartsAnimation = (): void => {
  const container = document.getElementById('animation-container');
  if (!container) return;

  const heartCount = 7;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️'; 
    const size = getRandom(20, 40);
    heart.style.fontSize = `${size}px`;
    heart.style.position = 'absolute';
    
    heart.style.left = `${getRandom(40, 60)}vw`; 
    heart.style.bottom = `${getRandom(10, 30)}vh`; 
    heart.style.opacity = '1';

    const duration = getRandom(1.5, 3); 
    const delay = getRandom(0, 0.8);   

    heart.style.animation = `floatUpAndFade ${duration}s ease-out ${delay}s forwards`;
    fragment.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, (duration + delay + 0.5) * 1000);
  }
  container.appendChild(fragment);
};