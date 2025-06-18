// analytics.js

export function trackUsernameEntered(username) {
  window.gtag('event', 'username_entered', {
    event_category: 'User',
    event_label: username
  });
}

export function trackChallengeStarted(challengeName) {
  window.gtag('event', 'challenge_started', {
    event_category: 'Challenge',
    event_label: challengeName
  });
}

export function trackChallengeCompleted(challengeName) {
  window.gtag('event', 'challenge_completed', {
    event_category: 'Challenge',
    event_label: challengeName
  });
}

export function trackLevelUp(levelName) {
  window.gtag('event', 'level_up', {
    event_category: 'Progression',
    event_label: levelName
  });
}

export function trackAwardReceived(awardName) {
  window.gtag('event', 'award_received', {
    event_category: 'Achievements',
    event_label: awardName
  });
}
