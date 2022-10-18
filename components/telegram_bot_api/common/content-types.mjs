const image = [
  {
    label: "Gif Images",
    value: "image/gif",
  },
  {
    label: "JPG Images",
    value: "image/jpeg",
  },
  {
    label: "PNG Images",
    value: "image/png",
  },
  {
    label: "Bitmap Images",
    value: "image/bmp",
  },
  {
    label: "Vector Images",
    value: "image/svg+xml",
  },
];

const video = [
  {
    label: "Video - MPEG",
    value: "video/mpeg",
  },
  {
    label: "Video - MP4",
    value: "video/mp4",
  },
  {
    label: "Video - WebM",
    value: "video/webm",
  },
  {
    label: "Video - OGG",
    value: "video/ogg",
  },
];

const audio = [
  {
    label: "Audio - MPEG",
    value: "audio/mpeg",
  },
  {
    label: "Audio - Midi",
    value: "audio/mid",
  },
  {
    label: "Audio - WebM",
    value: "audio/webm",
  },
  {
    label: "Audio - OGG",
    value: "audio/ogg",
  },
  {
    label: "Audio - Wave",
    value: "audio/vnd.wav",
  },
];

const voice = [
  ...audio,
  {
    label: "Video - MP4",
    value: "video/mp4",
  },
  {
    label: "Video - WebM",
    value: "video/webm",
  },
  {
    label: "Video - OGG",
    value: "video/ogg",
  },
];

const document = [
  {
    label: "Plain Text",
    value: "text/plain",
  },
  {
    label: "HTML Data",
    value: "text/html",
  },
  {
    label: "XML Files",
    value: "application/xml",
  },
  {
    label: "PDF Files",
    value: "application/pdf",
  },
];

const all = [
  ...document,
  ...image,
  ...video,
  ...audio,
];

export default {
  image,
  video,
  audio,
  voice,
  document,
  all,
};
