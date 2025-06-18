export function getLoggedAchievements(): string[] | null {
  const data = localStorage.getItem('loggedAchievements');
  return data ? JSON.parse(data) : [];
}

export function saveLoggedAchievements(achievements: string[]): void {
  localStorage.setItem('loggedAchievements', JSON.stringify(achievements));
}
