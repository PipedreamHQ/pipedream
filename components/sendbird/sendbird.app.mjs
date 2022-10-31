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
      description: "Restricts the search scope to only retrieve messages sent by one or more users with the specified IDs listed in a comma-separated string.",
      async options({ applicationId }) {
        const { users } = await this.listUsers(applicationId);
        return users.map((user) => ({
          label: user.nickname,
          value: user.user_id,
        }));
      },
      optional: true,
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
    async listUsers(applicationId) {
      const apiInstance = new SendbirdPlatformSdk.UserApi();
      apiInstance.apiClient.basePath = this._getBasePath(applicationId);
      const apiToken = this._getApiToken();
      return apiInstance.listUsers(
        apiToken,
        {
          limit: 100,
        },
      );
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
  },
};
