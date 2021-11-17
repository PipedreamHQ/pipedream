/**
 * @typedef {string} MediaType - a type of media as defined by
 * the [Telegram Bot API docs](https://bit.ly/3m7rjsc)
 */

/**
 * Represents a photo to be sent
 *
 * @type {MediaType}
 */
const TELEGRAM_BOT_API_MEDIA_PHOTO = "photo";

/**
  * Represents a video to be sent
  *
  * @type {MediaType}
  */
const TELEGRAM_BOT_API_MEDIA_VIDEO = "video";

/**
  * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent
  *
  * @type {MediaType}
  */
const TELEGRAM_BOT_API_MEDIA_ANIMATION = "animation";

/**
  * Represents an audio file to be treated as music to be sent
  *
  * @type {MediaType}
  */
const TELEGRAM_BOT_API_MEDIA_AUDIO = "audio";

/**
  * Represents a general file to be sent
  *
  * @type {MediaType}
  */
const TELEGRAM_BOT_API_MEDIA_DOCUMENT = "document";

/**
  * All the available Telegram Bot media types
  * @type {MediaType[]}
  */
const TELEGRAM_BOT_API_MEDIA_TYPES = [
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
  TELEGRAM_BOT_API_MEDIA_ANIMATION,
  TELEGRAM_BOT_API_MEDIA_AUDIO,
  TELEGRAM_BOT_API_MEDIA_DOCUMENT,
];

/**
 * @typedef {string} UIMediaType - a type of media shown to users as part of the UI
 */

/**
   * Represents a document or image
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT = "Document/Image";

/**
 * Represents a photo
 *
 * @type {UIMediaType}
 */
const TELEGRAM_BOT_API_UI_MEDIA_PHOTO = "Photo";

/**
   * Represents an audio file to be treated as music
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_AUDIO = "Audio";

/**
   * Represents a video
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_VIDEO = "Video";

/**
   * Represents a video note
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE = "Video Note";

/**
   * Represents a voice message
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_VOICE = "Voice";

/**
   * Represents a sticker
   *
   * @type {UIMediaType}
   */
const TELEGRAM_BOT_API_UI_MEDIA_STICKER = "Sticker";

/**
  * All the available Telegram Bot UI media types
  * @type {UIMediaType[]}
  */
const TELEGRAM_BOT_API_UI_MEDIA_TYPES = [
  TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT,
  TELEGRAM_BOT_API_UI_MEDIA_PHOTO,
  TELEGRAM_BOT_API_UI_MEDIA_AUDIO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE,
  TELEGRAM_BOT_API_UI_MEDIA_VOICE,
  TELEGRAM_BOT_API_UI_MEDIA_STICKER,
];

module.exports = {
  // Media types
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
  TELEGRAM_BOT_API_MEDIA_ANIMATION,
  TELEGRAM_BOT_API_MEDIA_AUDIO,
  TELEGRAM_BOT_API_MEDIA_DOCUMENT,
  // Array of media types
  TELEGRAM_BOT_API_MEDIA_TYPES,
  // UI media types
  TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT,
  TELEGRAM_BOT_API_UI_MEDIA_PHOTO,
  TELEGRAM_BOT_API_UI_MEDIA_AUDIO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE,
  TELEGRAM_BOT_API_UI_MEDIA_VOICE,
  TELEGRAM_BOT_API_UI_MEDIA_STICKER,
  // Array of UI media types
  TELEGRAM_BOT_API_UI_MEDIA_TYPES,
};
