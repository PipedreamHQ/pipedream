// If unset, set `process.env.NTBA_FIX_319` to true to enable cancellation of
// Promises. See: https://github.com/yagop/node-telegram-bot-api/issues/319 for
// more information.
process.env.NTBA_FIX_319 = (process.env.NTBA_FIX_319 !== undefined)
  ? process.env.NTBA_FIX_319
  : true;
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const {
  TELEGRAM_BOT_API_UI_MEDIA_AUDIO,
  TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT,
  TELEGRAM_BOT_API_UI_MEDIA_PHOTO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE,
  TELEGRAM_BOT_API_UI_MEDIA_STICKER,
  TELEGRAM_BOT_API_UI_MEDIA_VOICE,
} = require("./constants");
const updateTypes = [
  {
    label: "Message",
    value: "message",
  },
  {
    label: "Edited Message",
    value: "edited_message",
  },
  {
    label: "Channel Post",
    value: "channel_post",
  },
  {
    label: "Edited Channel Post",
    value: "edited_channel_post",
  },
  {
    label: "Inline Query",
    value: "inline_query",
  },
  {
    label: "Chosen Inline Result",
    value: "chosen_inline_result",
  },
  {
    label: "Callback Query",
    value: "callback_query",
  },
  {
    label: "Shipping Query",
    value: "shipping_query",
  },
  {
    label: "Pre Checkout Query",
    value: "pre_checkout_query",
  },
  {
    label: "Poll",
    value: "poll",
  },
  {
    label: "Poll Answer",
    value: "poll_answer",
  },
];

module.exports = {
  type: "app",
  app: "telegram_bot_api",
  propDefinitions: {
    updateTypes: {
      type: "string[]",
      label: "Update Types",
      optional: true,
      description:
        "Only emit events for the selected update types.",
      options: updateTypes,
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "Enter the unique identifier for the target chat or username of the target channel (in the format `@channelusername` or `@supergroupusername`).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Enter or map the message text to send.",
      optional: true,
    },
    parse_mode: {
      type: "string",
      label: "Parse Mode",
      description: "Select [MarkdownV2-style](https://core.telegram.org/bots/api#markdownv2-style), [HTML-style](https://core.telegram.org/bots/api#html-style), or [Markdown-style](https://core.telegram.org/bots/api#markdown-style) of the text if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.",
      options: [
        "MarkdownV2",
        "HTML",
        "Markdown",
      ],
      optional: true,
    },
    disable_notification: {
      type: "boolean",
      label: "Disable Notifications",
      description: "Choose if to send the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.",
      optional: true,
    },
    disable_web_page_preview: {
      type: "boolean",
      label: "Disable Link Previews",
      description: "Choose if to disable link previews for links in this message.",
      optional: true,
    },
    reply_to_message_id: {
      type: "string",
      label: "Original Message ID",
      description: "Enter the ID of the original message.",
      optional: true,
    },
    reply_markup: {
      type: "string",
      label: "Reply Markup",
      description: "Enter additional interface options that are a JSON-serialized object including an inline keyboard, a custom reply keyboard, instructions to remove the reply keyboard or instructions to force a reply from the user, e.g. `{\"inline_keyboard\":[[{\"text\":\"Some button text 2\",\"url\":\"https://botpress.org\"}]]}` or `{\"keyboard\":[[\"Yes\",\"No\"],[\"Maybe\"]]}`. Note: keyboard cannot be used with channels.",
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Enter the message ID.",
    },
    fromChatId: {
      type: "string",
      label: "From Chat ID",
      description: "Enter the unique identifier for the chat where the original message was sent (or channel username in the format @channelusername).",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Enter the caption.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "Enter a filename.",
      optional: true,
    },
    media: {
      type: "string",
      label: "Media File Source",
      description: "File to send. Pass a file_id to send a file that exists on the Telegram servers, pass an HTTP URL for Telegram to get a file from the Internet, or pass the path to the file (e.g., `/tmp/myFile.ext`) to upload a new one using a file [downloaded to `/tmp`](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#download-a-file-to-tmp). File must meet Telegram's [requirements](https://core.telegram.org/bots/api#sending-files) for MIME type and size.",
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Enter duration of sent video in seconds.",
      optional: true,
    },
    performer: {
      type: "string",
      label: "Performer",
      description: "Enter a performer.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Enter a track name.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Select or enter the MIME type of data.",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Enter the video width.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Enter the video height.",
      optional: true,
    },
    length: {
      type: "integer",
      label: "Length",
      description: "Enter the video width and height.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Media Type",
      description: "Select the media type.",
      options: [
        "Photo",
        "Video",
      ],
    },
    offset: {
      type: "string",
      label: "Start offset (Update ID)",
      description: "Enter the update ID <1, last update ID> you want to list from. Note: you can use this field to set your pagination - map last update ID from the result and increase this value by one to get next page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limits the number of updates to be retrieved <1-100>.",
      optional: true,
    },
    autoPaging: {
      type: "boolean",
      label: "Confirm processed requests by increasing the offset in the Telegram server [auto-paging]",
      description: "Check if to increasing the offset for the next request automatically. Caution: updates listed with `auto-paging` can be listed only once.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Enter the unique identifier of the target user.",
      optional: true,
    },
    until_date: {
      type: "string",
      label: "Until Date",
      description: "Enter the date when the restrictions on the user will be lifted, in [unix time](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1567780450`).",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://api.telegram.org/bot${this.$auth.token}`;
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    /**
     * Returns an instance of the Telegram Bot SDK authenticated with the bot's
     * token
     *
     * @returns The Telegram Bot object
     */
    sdk() {
      return new TelegramBot(this.$auth.token, {
        polling: false,
      });
    },
    async createHook(url, allowedUpdates) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/setWebhook`,
        headers: this._getHeaders(),
        data: {
          url: `${url}/${this.$auth.token}`,
          allowed_updates: allowedUpdates,
        },
      };
      return await axios(config);
    },
    async deleteHook() {
      const config = {
        method: "GET",
        url: `${await this._getBaseUrl()}/deleteWebhook`,
        headers: await this._getHeaders(),
      };
      return await axios(config);
    },
    /**
     * Send a text message
     *
     * @param {String} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format `@channelusername`)
     * @param {String} text - Text of the message to be sent, 1-4096 characters
     * after entities parsing
     * @param {Object} [opts] - An object containing additional configuration
     * options for this method, as defined in [the API
     * docs](https://core.telegram.org/bots/api#sendmessage)
     * @returns The sent Message
     */
    async sendMessage(chatId, text, opts) {
      return await this.sdk().sendMessage(chatId, text, opts);
    },
    /**
     * Edit a text message
     *
     * One of chat_id, message_id, or inline_message_id must be provided in the
     * `opts` parameter
     *
     * @param {String} text - New text of the message
     * @param {Object} [opts] - An object containing additional configuration
     * options for this method
     * @param {Number|String} [opts.chatId] - Required if `inline_message_id` is
     * not specified. Unique identifier for the target chat or username of the
     * target channel (in the format @channelusername)
     * @param {Number|String} [opts.messageId] - Required if inline_message_id
     * is not specified. Identifier of the message to edit
     * @param {Number|String} [opts.inlineMessageId] - Required if chat_id and
     * message_id are not specified. Identifier of the inline message
     * @param {...*} [opts.extraOpts] - Additional Telegram query options to be
     * fed to the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#editmessagetext)
     * @returns The edited Message
     */
    async editMessageText(text, opts) {
      const {
        chatId,
        messageId,
        inlineMessageId,
        ...extraOpts
      } = opts;
      if (!(chatId && messageId) && !inlineMessageId) {
        throw new Error("chatId, messageId, or inlineMessageId is required");
      }
      return await this.sdk().editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        inline_message_id: inlineMessageId,
        ...extraOpts,
      });
    },
    /**
     * Forward a message of any kind
     *
     * @param {Number|String} chatId - Unique identifier for the message
     * recipient
     * @param {Number|String} fromChatId - Unique identifier for the chat where
     * the original message was sent
     * @param {Number|String} messageId - Unique message identifier
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#forwardmessage)
     * @return The sent message
     */
    async forwardMessage(chatId, fromChatId, messageId, opts) {
      return await this.sdk().forwardMessage(chatId, fromChatId, messageId, opts);
    },
    /**
     * Delete a message
     *
     * @param  {Number|String} chatId - Unique identifier of the target chat
     * @param  {Number} messageId - Unique identifier of the target message
     * @returns `True` on success
     */
    async deleteMessage(chatId, messageId) {
      return await this.sdk().deleteMessage(chatId, messageId);
    },
    /**
     * Use this method to add a message to the list of pinned messages in a
     * chat. If the chat is not a private chat, the bot must be an administrator
     * in the chat for this to work and must have the 'can_pin_messages' admin
     * right in a supergroup or 'can_edit_messages' admin right in a channel.
     *
     * @param {Number|String} chatId - Unique identifier for the message
     * recipient
     * @param {Number} messageId - Identifier of a message to pin
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#pinchatmessage)
     * @return `True` on success
     */
    async pinChatMessage(chatId, messageId, opts) {
      return await this.sdk().pinChatMessage(chatId, messageId, opts);
    },
    /**
     * Use this method to remove a message from the list of pinned messages in a
     * chat. If the chat is not a private chat, the bot must be an administrator
     * in the chat for this to work and must have the 'can_pin_messages' admin
     * right in a supergroup or 'can_edit_messages' admin right in a channel.
     *
     * @param {Number|String} chatId - Unique identifier for the message
     * recipient
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#unpinchatmessage)
     * @return `True` on success
     */
    async unpinChatMessage(chatId, messageId) {
      return await this.sdk().unpinChatMessage(chatId, {
        message_id: messageId,
      });
    },
    /**
     * @typedef {function} SendMediaFn
     * @param {string} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format @channelusername)
     * @param {String|stream.Stream|Buffer} media - A file path or a Stream. Can
     * also be a `file_id` previously uploaded
     * @param {Object} [opts] - An object containing additional configuration
     * options for this method
     * @param {Number|String} [opts.filename] - The name of the file to send
     * @param {Number|String} [opts.contentType] - The MIME type of the file to
     * send
     * @param {...*} [opts.extraOpts] - Additional Telegram query options to be
     * fed to the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api)
     * @returns {Promise<TelegramBot.Message>} The sent message
    */
    /**
     * Send a file (Document/Image, Photo, Audio, Video, Video Note, Voice,
     * Sticker)
     *
     * @param {SendMediaFn} sendFn - the function to use to send the media
     * @param {string} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format @channelusername)
     * @param  {String|stream.Stream|Buffer} media - A file path or a Stream. Can
     * also be a `file_id` previously uploaded
     * @param {Object} [opts] - An object containing additional configuration
     * options for this method
     * @param {Number|String} [opts.filename] - The name of the file to send
     * @param {Number|String} [opts.contentType] - The MIME type of the file to
     * send
     * @param {...*} [opts.extraOpts] - Additional Telegram query options to be
     * fed to the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api)
     * @returns {Promise<TelegramBot.Message>} The sent message
     */
    async sendMedia(sendFn, chatId, media, opts) {
      const {
        filename,
        contentType,
        ...extraOpts
      } = opts;
      return await sendFn(chatId, media, extraOpts, {
        filename,
        contentType,
      });
    },
    /**
     * @typedef {import("./constants.js").UIMediaType} UIMediaType
     *
     */
    /**
     * Send a file (Document/Image, Photo, Audio, Video, Video Note, Voice,
     * Sticker) as the media type specified by the `type` parameter
     *
     * @param {UIMediaType} type - The media type of the file
     * @param {string} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format @channelusername)
     * @param {String|stream.Stream|Buffer} media - A file path or a Stream. Can
     * also be a `file_id` previously uploaded
     * @param {Object} [opts] - An object containing additional configuration
     * options for this method
     * @param {Number|String} [opts.filename] - The name of the file to send
     * @param {Number|String} [opts.contentType] - The MIME type of the file to
     * send
     * @param {...*} [opts.extraOpts] - Additional Telegram query options to be
     * fed to the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api)
     * @returns {Promise<TelegramBot.Message>} The sent message
     */
    async sendMediaByType(type, chatId, media, opts) {
      const sdk = this.sdk();
      const typeToSendFn = {
        [TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT]: sdk.sendDocument,
        [TELEGRAM_BOT_API_UI_MEDIA_PHOTO]: sdk.sendPhoto,
        [TELEGRAM_BOT_API_UI_MEDIA_AUDIO]: sdk.sendAudio,
        [TELEGRAM_BOT_API_UI_MEDIA_VIDEO]: sdk.sendVideo,
        [TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE]: sdk.sendVideoNote,
        [TELEGRAM_BOT_API_UI_MEDIA_VOICE]: sdk.sendVoice,
        [TELEGRAM_BOT_API_UI_MEDIA_STICKER]: sdk.sendSticker,
      };
      const sendFn = typeToSendFn[type].bind(sdk);
      return this.sendMedia(sendFn, chatId, media, opts);
    },
    /**
     * @type {SendMediaFn}
     */
    async sendAudio(chatId, audio, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_AUDIO, chatId, audio, opts);
    },
    /**
     * @type {SendMediaFn}
     */
    async sendDocument(chatId, doc, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT, chatId, doc, opts);

    },
    async sendMediaGroup(chatId, media, opts) {
      return await this.sdk().sendMediaGroup(chatId, media, opts);
    },
    /**
     * @type {SendMediaFn}
     */
    async sendPhoto(chatId, photo, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_PHOTO, chatId, photo, opts);

    },
    /**
     * @type {SendMediaFn}
     */
    async sendSticker(chatId, sticker, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_STICKER, chatId, sticker, opts);
    },
    /**
     * @type {SendMediaFn}
     */
    async sendVideo(chatId, video, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_VIDEO, chatId, video, opts);
    },
    /**
     * @type {SendMediaFn}
     */
    async sendVideoNote(chatId, videoNote, opts) {
      return await this.sendMediaByType(
        TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE,
        chatId,
        videoNote,
        opts,
      );
    },
    /**
     * @type {SendMediaFn}
     */
    async sendVoice(chatId, voice, opts) {
      return await this.sendMediaByType(TELEGRAM_BOT_API_UI_MEDIA_VOICE, chatId, voice, opts);
    },
    /**
     * Use this method to edit audio, document, photo, or video messages. If a
     * message is a part of a message album, then it can be edited only to a
     * photo or a video. Otherwise, message type can be changed arbitrarily.
     * When inline message is edited, new file can't be uploaded. Use previously
     * uploaded file via its file_id or specify a URL.
     *
     * One of chat_id, message_id, or inline_message_id must be provided in the
     * `opts` object param.
     *
     * @param {Object} media - A JSON-serialized object for a new media content
     * of the message, as specified in [the API
     * docs](https://core.telegram.org/bots/api#editmessagemedia)
     * @param {Object} [opts] - Additional Telegram query options (one of
     * chat_id, message_id, or inline_message_is required)
     * @param {Number|String} [opts.chatId] - Required if `inline_message_id` is
     * not specified. Unique identifier for the target chat or username of the
     * target channel (in the format @channelusername)
     * @param {Number|String} [opts.messageId] - Required if inline_message_id
     * is not specified. Identifier of the message to edit
     * @param {Number|String} [opts.inlineMessageId] - Required if chat_id and
     * message_id are not specified. Identifier of the inline message
     * @param {...*} [opts.extraOpts] - Additional Telegram query options to be
     * fed to the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#editmessagemedia)
     * @returns The edited Message if the edited message is not an inline
     * message, otherwise `true`
     */
    async editMessageMedia(media, opts) {
      const {
        chatId,
        messageId,
        inlineMessageId,
        ...extraOpts
      } = opts;
      if (!(chatId && messageId) && !inlineMessageId) {
        throw new Error("chatId, messageId, or inlineMessageId is required");
      }
      return await this.sdk().editMessageMedia(media, {
        chat_id: chatId,
        message_id: messageId,
        inline_message_id: inlineMessageId,
        ...extraOpts,
      });
    },
    /**
     * Use this method to receive incoming updates using long polling
     *
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#getupdates)
     * @returns An Array of Update objects
     */
    async getUpdates(opts) {
      return await this.sdk().getUpdates(opts);
    },
    /**
     * Use this method to get a list of administrators in a chat
     *
     * @param {Number|String} chatId - Unique identifier for the target group or
     * username of the target supergroup
     * @returns An Array of `ChatMember` objects that contains information about
     * all chat administrators except other bots
     */
    async getChatAdministrators(chatId) {
      return await this.sdk().getChatAdministrators(chatId);
    },
    /**
     * Use this method to get the number of members in a chat
     *
     * @param {Number|String} chatId - Unique identifier for the target group or
     * username of the target supergroup
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#getchatmembercount)
     * @returns The number of members in the chat
     */
    async getChatMemberCount(chatId) {
      return await this.sdk().getChatMemberCount(chatId);
    },
    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In
     * the case of supergroups and channels, the user will not be able to return
     * to the chat on their own using invite links, etc., unless unbanned first.
     * The bot must be an administrator in the chat for this to work and must
     * have the appropriate admin rights.
     *
     * @param {Number|String} chatId - Unique identifier for the target group or
     * username of the target supergroup
     * @param {Number} userId - Unique identifier of the target user
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#banchatmember)
     * @returns `True` on success
     */
    async banChatMember(chatId, userId, opts) {
      return await this.sdk().banChatMember(chatId, userId, opts);
    },
    /**
     * Use this method to promote or demote a user in a supergroup or a channel.
     * The bot must be an administrator in the chat for this to work and must
     * have the appropriate admin rights. Pass False for all boolean parameters
     * in `opts` to demote a user.
     *
     * @param {Number|String} chatId - Unique identifier for the target chat or
     * username of the target supergroup
     * @param {Number} userId - Unique identifier of the target user
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#promotechatmember)
     * @returns `True` on success
     */
    async promoteChatMember(chatId, userId, opts) {
      return await this.sdk().promoteChatMember(chatId, userId, opts);
    },
    /**
     * Use this method to restrict a user in a supergroup. The bot must be an
     * administrator in the supergroup for this to work and must have the
     * appropriate admin rights. Pass True for all boolean parameters in `opts`
     * to lift restrictions from a user.
     *
     * @param {Number|String} chatId - Unique identifier for the target chat or
     * username of the target supergroup
     * @param {Number} userId - Unique identifier of the target user
     * @param {Object} [opts] - Additional Telegram query options to be fed to
     * the Telegram Bot API call, as defined in [the API
     * docs](https://core.telegram.org/bots/api#restrictchatmember)
     * @returns `True` on success
     */
    async restrictChatMember(chatId, userId, opts) {
      return await this.sdk().restrictChatMember(chatId, userId, opts);
    },
  },
};
