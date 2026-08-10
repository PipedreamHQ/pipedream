import { ConfigurationError } from "@pipedream/platform";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

function doubleEncode(value) {
  if ((typeof value === "string") && (value.startsWith("/") || value.includes("//"))) {
    return encodeURIComponent(encodeURIComponent(value));
  }
  return value;
}

// Ordered preference used when the caller doesn't name a specific recording file.
// A single meeting usually yields 5+ files (speaker-view MP4, audio-only M4A, chat
// TXT, transcript VTT, timeline JSON); "the recording" almost always means the video.
const FILE_PREFERENCE = [
  (file) => file.file_type === "MP4" && file.recording_type === "shared_screen_with_speaker_view",
  (file) => file.file_type === "MP4",
  (file) => file.file_type === "M4A",
];

function selectRecordingFile(files = [], recordingFileId) {
  const completed = files.filter(({ status }) => status === "completed");

  if (recordingFileId) {
    return completed.find(({ id }) => id === recordingFileId);
  }

  for (const predicate of FILE_PREFERENCE) {
    const matches = completed.filter(predicate);
    if (matches.length) {
      return matches.sort((a, b) => (b.file_size ?? 0) - (a.file_size ?? 0))[0];
    }
  }
  return undefined;
}

function parseArray(value) {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`Could not parse as array: ${value}`);
    }
  }
  if (Array.isArray(value)) {
    return value;
  } else {
    throw new ConfigurationError(`Expected a string or array, got ${typeof value}`);
  }
}

export default {
  streamIterator,
  summaryEnd,
  doubleEncode,
  selectRecordingFile,
  parseArray,
};
