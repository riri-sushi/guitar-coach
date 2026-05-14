export const SELECTED_SONG_KEY = "guitar-coach:selected-song:v1";

export function loadSelectedSongId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SELECTED_SONG_KEY);
  } catch {
    return null;
  }
}

export function saveSelectedSongId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id === null) {
      window.localStorage.removeItem(SELECTED_SONG_KEY);
    } else {
      window.localStorage.setItem(SELECTED_SONG_KEY, id);
    }
  } catch {
    // ignore
  }
}
