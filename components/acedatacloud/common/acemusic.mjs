import { requiredText } from "./utils.mjs";

export const models = ["acemusic-v1.1", "acemusic-v1"];

export function musicText(value, label) {
  const text = requiredText(value, label);
  if ([...text].length > 20000) throw new Error(label + " must be at most 20000 characters.");
  return text;
}

export function musicModel(value = models[0]) {
  if (!models.includes(value)) throw new Error("Choose a supported ACE Music model.");
  return value;
}

export function referenceUrl(value) {
  const url = new URL(musicText(value, "Public MP3 URL"));
  if (url.protocol !== "https:" || url.username || url.password || !url.hostname) {
    throw new Error("Provide a public HTTPS MP3 URL.");
  }
  return url.href;
}

export function influence(value = 60) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1 || value > 100) {
    throw new Error("Audio influence must be between 1 and 100.");
  }
  return value;
}

export function twoTracks(first, second) {
  const ids = [musicText(first, "First track ID"), musicText(second, "Second track ID")];
  if (ids[0] === ids[1]) throw new Error("Provide two distinct reference track IDs.");
  return ids;
}
