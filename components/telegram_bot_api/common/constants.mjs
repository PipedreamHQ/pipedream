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

/**
 * @typedef {string} FormattingMode - a formatting mode used to parse entities in text, as defined
 * by the [Telegram Bot API docs](@see{@link https://core.telegram.org/bots/api#formatting-options})
 */

/**
 * Mode used to parse text using MarkdownV2 style
 *
 * @example
 * *bold \*text*
 * _italic \*text_
 * __underline__
 * ~strikethrough~
 * *bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*
 * [inline URL](http://www.example.com/)
 *
 * @type {FormattingMode}
 */
const TELEGRAM_BOT_API_MARKDOWNV2_STYLE = "MarkdownV2";

/**
 * Mode used to parse text using HTML style
 *
 * @example
 * <b>bold</b>, <strong>bold</strong> <i>italic</i>, <em>italic</em> <u>underline</u>,
 * <ins>underline</ins> <s>strikethrough</s>, <strike>strikethrough</strike>,
 * <del>strikethrough</del> <b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline
 * italic bold</u></i> bold</b>
 *
 * @type {FormattingMode}
 */
const TELEGRAM_BOT_API_HTML_STYLE = "HTML";

/**
 * Mode used to parse text using Markdown style
 *
 * @example
 * *bold text*
 * _italic text_
 * [inline URL](http://www.example.com/)
 * [inline mention of a user](tg://user?id=123456789)
 * `inline fixed-width code`
 *
 * @type {FormattingMode}
 */
const TELEGRAM_BOT_API_MARKDOWN_STYLE = "Markdown";

/**
  * All the available Telegram Bot formatting modes
  * @type {FormattingMode[]}
  */
const TELEGRAM_BOT_API_FORMATTING_MODES = [
  TELEGRAM_BOT_API_MARKDOWNV2_STYLE,
  TELEGRAM_BOT_API_HTML_STYLE,
  TELEGRAM_BOT_API_MARKDOWN_STYLE,
];

export {
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
  // Array of formatting modes
  TELEGRAM_BOT_API_FORMATTING_MODES,
};
