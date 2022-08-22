import "./common/env.mjs";
import TelegramBot from "node-telegram-bot-api";
import { axios } from "@pipedream/platform";
import {
  TELEGRAM_BOT_API_UI_MEDIA_AUDIO,
  TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT,
  TELEGRAM_BOT_API_UI_MEDIA_PHOTO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO,
  TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE,
  TELEGRAM_BOT_API_UI_MEDIA_STICKER,
  TELEGRAM_BOT_API_UI_MEDIA_VOICE,
  TELEGRAM_BOT_API_FORMATTING_MODES,
} from "./common/constants.mjs";
import updateTypes from "./common/update-types.mjs";
import { toSingleLineString } from "./common/utils.mjs";

export default {
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
      description: toSingleLineString(`
        Enter the unique identifier for the target chat (e.g. \`1035597319\`) or username of the
        target public chat (in the format \`@channelusername\` or \`@supergroupusername\`). For
        example, if the group's public link is \`t.me/mygroup\`, the username is \`@mygroup\`.
      `),
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
      description: toSingleLineString(`
        Select [MarkdownV2-style](https://core.telegram.org/bots/api#markdownv2-style),
        [HTML-style](https://core.telegram.org/bots/api#html-style), or
        [Markdown-style](https://core.telegram.org/bots/api#markdown-style) of the text if you want
        Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
      `),
      options: TELEGRAM_BOT_API_FORMATTING_MODES,
      optional: true,
    },
    disable_notification: {
      type: "boolean",
      label: "Disable Notifications",
      description: toSingleLineString(`
        Choose if to send the message silently. iOS users will not receive a notification, Android
        users will receive a notification with no sound.
      `),
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
      description: toSingleLineString(`
        Enter additional interface options that are a JSON-serialized object including an [inline
        keyboard](https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating), a
        [custom reply keyboard](https://core.telegram.org/bots#keyboards), instructions to remove
        the reply keyboard or instructions to force a reply from the user, e.g.
        \`{"inline_keyboard":[[{"text":"Some button text 2","url":"https://botpress.org"}]]}\` or
        \`{"keyboard":[["Yes","No"],["Maybe"]]}\`. Note: keyboard cannot be used with channels. [See
        the docs](https://core.telegram.org/bots/api#inlinekeyboardmarkup) for more information.
      `),
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
      description: toSingleLineString(`
        Enter the unique identifier for the chat where the original message was sent (or channel
        username in the format \`@channelusername\`).
      `),
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
      description: toSingleLineString(`
        File to send. Pass a file_id to send a file that exists on the Telegram servers, pass an
        HTTP URL for Telegram to get a file from the Internet, or pass the path to the file (e.g.,
        \`/tmp/myFile.ext\`) to upload a new one using a file [downloaded to
        \`/tmp\`](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#download-a-file-to-tmp).
        File must meet Telegram's [requirements](https://core.telegram.org/bots/api#sending-files)
        for MIME type and size.
      `),
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
      description: "Enter the video width and height, i.e. diameter of the video message, in pixels (px).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Media Type",
      description: "Select the media type.",
      options: [
        TELEGRAM_BOT_API_UI_MEDIA_PHOTO,
        TELEGRAM_BOT_API_UI_MEDIA_VIDEO,
      ],
    },
    offset: {
      type: "string",
      label: "Start offset (Update ID)",
      description: toSingleLineString(`
        Enter the update ID <1, last update ID> you want to list from. Note: you can use this field
        to set your pagination - map last update ID from the result and increase this value by one
        to get next page.
      `),
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
      description: toSingleLineString(`
        Check if to increasing the offset for the next request automatically. Caution: updates
        listed with \`auto-paging\` can be listed only once.
      `),
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
      description: toSingleLineString(`
        Enter the date when the restrictions on the user will be lifted, in [unix
        time](https://en.wikipedia.org/wiki/Unix_time) (e.g. \`1567780450\`).
      `),
      optional: true,
    },
    link_name: {
      type: "string",
      label: "Invite link name",
      description: toSingleLineString(`
        Invite link name; 0-32 characters
      `),
      optional: true,
    },
    expire_date: {
      type: "integer",
      label: "Invite link expire date",
      description: toSingleLineString(`
        Point in time (Unix timestamp) when the link will expire, in [unix
        time](https://en.wikipedia.org/wiki/Unix_time) (e.g. \`1567780450\`).
      `),
      optional: true,
    },
    member_limit: {
      type: "integer",
      label: "Maximum number of users",
      description: toSingleLineString(`
        Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999
      `),
      optional: true,
    },
    creates_join_request: {
      type: "boolean",
      label: "Creates join request",
      description: toSingleLineString(`
        True, if users joining the chat via the link need to be approved by chat administrators.
        If True, member_limit can't be specified
      `),
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
    async createHook(url, allowedUpdates, secret) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/setWebhook`,
        headers: this._getHeaders(),
        data: {
          url,
          allowed_updates: allowedUpdates,
          secret_token: secret,
        },
      };
      return axios(this, config);
    },
    async deleteHook() {
      const config = {
        method: "GET",
        url: `${await this._getBaseUrl()}/deleteWebhook`,
        headers: await this._getHeaders(),
      };
      return axios(this, config);
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
      return this.sdk().sendMessage(chatId, text, opts);
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
     * target channel (in the format `@channelusername`)
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
      const hasChatIdAndMessageId = chatId && messageId;
      if (!hasChatIdAndMessageId && !inlineMessageId) {
        throw new Error("chatId, messageId, or inlineMessageId is required");
      }
      return this.sdk().editMessageText(text, {
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
      return this.sdk().forwardMessage(chatId, fromChatId, messageId, opts);
    },
    /**
     * Delete a message
     *
     * @param  {Number|String} chatId - Unique identifier of the target chat
     * @param  {Number} messageId - Unique identifier of the target message
     * @returns `True` on success
     */
    async deleteMessage(chatId, messageId) {
      return this.sdk().deleteMessage(chatId, messageId);
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
      return this.sdk().pinChatMessage(chatId, messageId, opts);
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
      return this.sdk().unpinChatMessage(chatId, {
        message_id: messageId,
      });
    },
    /**
     * Use this method to set default chat permissions for all members.
     * The bot must be an administrator in the group or a supergroup for this
     * to work and must have the can_restrict_members administrator rights.
     * Returns True on success.
     *
     * @param {Number|String} chatId - Unique identifier for the message
     * recipient
     * @param {TelegramBot.ChatPermissions} [chatPermissions] -
     * A JSON-serialized object for new default chat permissions
     * [the API docs](https://core.telegram.org/bots/api#setchatpermissions)
     * @return `True` on success
     */
    async setChatPermissions(chatId, chatPermissions) {
      return this.sdk().setChatPermissions(chatId, chatPermissions);
    },
    /**
     * Send a file (Document/Image, Photo, Audio, Video, Video Note, Voice,
     * Sticker)
     *
     * @param {Function} sendFn - the function to use to send the media
     * @param {String} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format `@channelusername`)
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
      return sendFn(chatId, media, extraOpts, {
        filename,
        contentType,
      });
    },
    async sendAudio(chatId, audio, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendAudio.bind(sdk), chatId, audio, opts);
    },
    async sendDocument(chatId, doc, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendDocument.bind(sdk), chatId, doc, opts);
    },
    async sendPhoto(chatId, photo, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendPhoto.bind(sdk), chatId, photo, opts);
    },
    async sendSticker(chatId, sticker, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendSticker.bind(sdk), chatId, sticker, opts);
    },
    async sendVideo(chatId, video, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendVideo.bind(sdk), chatId, video, opts);
    },
    async sendVideoNote(chatId, videoNote, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendVideoNote.bind(sdk), chatId, videoNote, opts);
    },
    async sendVoice(chatId, voice, opts) {
      const sdk = this.sdk();
      return this.sendMedia(sdk.sendVoice.bind(sdk), chatId, voice, opts);
    },
    /**
     * Send a file (Document/Image, Photo, Audio, Video, Video Note, Voice,
     * Sticker) as the media type specified by the `type` parameter
     *
     * @typedef {import("./constants.js").UIMediaType} UIMediaType
     *
     * @param {UIMediaType} type - The media type of the file
     * @param {String} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format `@channelusername`)
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
      const typeToSendMediaFn = {
        [TELEGRAM_BOT_API_UI_MEDIA_DOCUMENT]: this.sendDocument,
        [TELEGRAM_BOT_API_UI_MEDIA_PHOTO]: this.sendPhoto,
        [TELEGRAM_BOT_API_UI_MEDIA_AUDIO]: this.sendAudio,
        [TELEGRAM_BOT_API_UI_MEDIA_VIDEO]: this.sendVideo,
        [TELEGRAM_BOT_API_UI_MEDIA_VIDEO_NOTE]: this.sendVideoNote,
        [TELEGRAM_BOT_API_UI_MEDIA_VOICE]: this.sendVoice,
        [TELEGRAM_BOT_API_UI_MEDIA_STICKER]: this.sendSticker,
      };
      if (!typeToSendMediaFn[type]) {
        throw new Error("type is not a valid file media type");
      }
      return typeToSendMediaFn[type](chatId, media, opts);
    },
    /**
     * Use this method to send a group of photos or videos as an album. On success, an array of the
     * sent [Messages](https://core.telegram.org/bots/api#message) is returned.
     *
     * @param {String} chatId - Unique identifier for the target chat or
     * username of the target channel (in the format `@channelusername`)
     * @param  {Array} media A JSON-serialized array describing photos and videos to be sent, must
     * include 2–10 items
     * @param  {Object} [options] Additional Telegram query options
     * @return {Promise}
     */
    async sendMediaGroup(chatId, media, opts) {
      return this.sdk().sendMediaGroup(chatId, media, opts);
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
     * target channel (in the format `@channelusername`)
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
      const hasChatIdAndMessageId = chatId && messageId;
      if (!hasChatIdAndMessageId && !inlineMessageId) {
        throw new Error("chatId, messageId, or inlineMessageId is required");
      }
      return this.sdk().editMessageMedia(media, {
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
      return this.sdk().getUpdates(opts);
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
      return this.sdk().getChatAdministrators(chatId);
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
      return this.sdk().getChatMemberCount(chatId);
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
      return this.sdk().banChatMember(chatId, userId, opts);
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
      return this.sdk().promoteChatMember(chatId, userId, opts);
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
      return this.sdk().restrictChatMember(chatId, userId, opts);
    },
    /**
    * Use this method to export an invite link to a supergroup or a channel.
    * The bot must be an administrator in the chat for this to work and must
    * have the appropriate admin rights. Returns exported invite link as
    * String on success.
    *
    * @param {Number|String} chatId - Unique identifier for the target chat or
    * username of the target supergroup
    * @returns the new invite link as String on success.
    */
    async exportChatInviteLink(chatId) {
      return this.sdk().exportChatInviteLink(chatId);
    },
    /**
    * Use this method to export an invite link to a supergroup or a channel.
    * The bot must be an administrator in the chat for this to work and must
    * have the appropriate admin rights. Returns exported invite link as
    * String on success.
    *
    * @param {Number|String} chatId - Unique identifier for the target chat or
    * username of the target supergroup
    * @param {Object} [opts] - Additional Telegram query options to be fed to
    * the Telegram Bot API call, as defined in [the API docs]
    * (https://core.telegram.org/bots/api#createchatinvitelink)
    * @returns the new invite link as ChatInviteLink object.
    */
    async createChatInviteLink(chatId, opts) {
      return this.sdk().createChatInviteLink(chatId, opts);
    },
  },
};
