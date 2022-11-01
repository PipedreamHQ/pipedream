import SendbirdPlatformSdk from "sendbird-platform-sdk";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "sendbird",
  propDefinitions: {
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "Specifies the type of the channel. Acceptable values are **open_channels** and **group_channels**.",
      options: constants.CHANNEL_TYPE_OPTS,
    },
    applicationId: {
      type: "string",
      label: "Application Id",
      description: "Specifies the unique ID of the Application, To find the application ID, sign in to [Sendbird Dashboard](https://dashboard.sendbird.com/auth/signin), go to **Settings > Application > General**, and then check Application ID.",
    },
    channelUrl: {
      type: "string",
      label: "Channel URL",
      description: "Specifies the url of the channel.",
      async options({ applicationId }) {
        if (!applicationId) {
          return [];
        }
        const { channels } = await this.listChannels(applicationId);
        return channels.map((channel) => ({
          label: channel.name,
          value: channel.channel_url,
        }));
      },
    },
    messageTs: {
      type: "integer",
      label: "Message Timestamp",
      description: "Specifies the timestamp to be the reference point of the query in [Unix milliseconds](https://en.wikipedia.org/wiki/Unix_time). Either this or the `Message Id` should be specified.",
      optional: true,
    },
    messageId: {
      type: "integer",
      label: "Message Id",
      description: "Specifies the unique ID of the message to be the reference point of the query. Either this or the `Message Timestamp` should be specified.",
      optional: true,
    },
    prevLimit: {
      type: "integer",
      label: "Prev Limit",
      max: 200,
      min: 0,
      description: "Specifies the number of previously sent messages to retrieve before `message_ts`. For example, if `message_ts=1484202848298`, then `prev_limit=50` returns 50 messages sent by 1484202848297 (message_ts - 1).",
      optional: true,
    },
    nextLimit: {
      type: "integer",
      label: "Next Limit",
      max: 200,
      min: 0,
      description: "Specifies the number of sent messages to retrieve after `message_ts`. For example, if `message_ts=1484202848298`, then `next_limit=50` returns 50 messages sent from 1484202848299 (message_ts + 1).",
      optional: true,
    },
    include: {
      type: "boolean",
      label: "Include",
      description: "Determines whether to include messages sent exactly on the specified `message_ts` in the results. (Default: **true**)",
      optional: true,
    },
    reverse: {
      type: "boolean",
      label: "Reverse",
      description: "Determines whether to sort the results in reverse chronological order. If set to **true**, messages appear in reverse chronological order where the newest comes first and the oldest last. (Default: **false**)",
      optional: true,
    },
    senderIds: {
      type: "string[]",
      label: "Sender Ids",
      description: "Restricts the search scope to only retrieve messages sent by one or more users.",
      async options({ applicationId }) {
        return this.listUserOpts(applicationId);
      },
      optional: true,
    },
    userId: {
      type: "string",
      label: "User Id",
      description: "Specifies the user ID of the sender.",
      async options({ applicationId }) {
        return this.listUserOpts(applicationId);
      },
    },
    operatorFilter: {
      type: "string",
      label: "Operator Filter",
      description: "Restricts the search scope to only retrieve messages sent by operators or non-operator users of the channel.",
      options: constants.OPERATOR_FILTER_OPTS,
      optional: true,
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "Specifies a message type to retrieve. If not specified, all messages are retrieved.",
      options: constants.MESSAGE_TYPE_OPTS,
      optional: true,
    },
    includingRemoved: {
      type: "boolean",
      label: "Including Removed",
      description: "Determines whether to include messages removed from the channel in the results.",
      optional: true,
    },
    withSortedMetaArray: {
      type: "boolean",
      label: "With Sorted Meta Array",
      description: "Determines whether to include the `sorted_metaarray` property in the response.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Specifies the content of the message.",
    },
    sendPush: {
      type: "boolean",
      label: "Send Push",
      description: "Determines whether to send a push notification for the message to the members of the channel (applicable to group channels only). Unlike text and file messages, a push notification for an admin message is not sent by default. (Default: true)",
      optional: true,
    },
    mentionType: {
      type: "string",
      label: "Mention Type",
      description: "Specifies the mentioning type which indicates the user scope who will get a notification for the message. Acceptable values are users and channel. If set to users, only the specified users with the mentioned_users property below will get notified. If set to channel, all users in the channel will get notified. (Default: users)",
      options: constants.MENTION_TYPE_OPTS,
      optional: true,
    },
    mentionedUserIds: {
      type: "string",
      label: "Mentioned User Ids",
      description: "Specifies an array of one or more IDs of the users who will get a notification for the message.",
      async options({ applicationId }) {
        return this.listUserOpts(applicationId);
      },
      optional: true,
    },
    isSilent: {
      type: "boolean",
      label: "Is Silent",
      description: "Determines whether to send a message without updating some of the channel properties. If a message is sent in a channel, with this property set to true, the channel's last_message is updated only for the sender while its unread_message_count remains unchanged for all channel members.",
      optional: true,
    },
    dedupId: {
      type: "string",
      label: "Dedup Id",
      description: "Specifies the unique message ID created by other system. In general, this property is used to prevent the same message data from getting inserted when migrating the messages of the other system to Sendbird server. If specified, the server performs a duplicate check using the property value.",
      optional: true,
    },
  },
  methods: {
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getBasePath(applicationId) {
      return `https://api-${applicationId}.sendbird.com`;
    },
    filterEmptyValues(obj) {
      if (!obj) {
        return obj;
      }
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    async listUserOpts(applicationId) {
      if (!applicationId) {
        return [];
      }
      const apiInstance = new SendbirdPlatformSdk.UserApi();
      apiInstance.apiClient.basePath = this._getBasePath(applicationId);
      const apiToken = this._getApiToken();
      const { users } = await apiInstance.listUsers(
        apiToken,
        {
          limit: 100,
        },
      );
      return users.map((user) => ({
        label: user.nickname,
        value: user.user_id,
      }));
    },
    async listChannels(applicationId) {
      const apiInstance = new SendbirdPlatformSdk.OpenChannelApi();
      apiInstance.apiClient.basePath = this._getBasePath(applicationId);
      const apiToken = this._getApiToken();
      return apiInstance.ocListChannels(apiToken);
    },
    async listMessages(applicationId, channelType, channelUrl, opts) {
      const apiInstance = new SendbirdPlatformSdk.MessageApi();
      apiInstance.apiClient.basePath = this._getBasePath(applicationId);
      const apiToken = this._getApiToken();
      return apiInstance.listMessages(
        apiToken,
        channelType,
        channelUrl,
        this.filterEmptyValues(opts),
      );
    },
    async sendMessage(applicationId, channelType, channelUrl, opts) {
      const apiInstance = new SendbirdPlatformSdk.MessageApi();
      apiInstance.apiClient.basePath = this._getBasePath(applicationId);
      const apiToken = this._getApiToken();
      const data = {
        sendMessageData: this.filterEmptyValues(opts),
      };
      return apiInstance.sendMessage(
        apiToken,
        channelType,
        channelUrl,
        data,
      );
    },
  },
};
