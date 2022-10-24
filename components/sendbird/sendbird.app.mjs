import SendbirdPlatformSdk from "sendbird-platform-sdk";

export default {
  type: "app",
  app: "sendbird",
  propDefinitions: {
    channelType: {
      type: "string",
      label: "Channel Type",
      description: "Specifies the type of the channel. Acceptable values are •open_channels* and *group_channels*.",
      options: [
        "open_channels",
        "group_channels",
      ],
    },
  },
  methods: {
    _getApiToken() {
      return this.$auth.api_token;
    },
    async listChannels() {
      const apiInstance = new SendbirdPlatformSdk.OpenChannelApi();
      const appId = "BA0480F7-C300-48B8-B83F-55299A42E896";
      apiInstance.apiClient.basePath = `https://api-${appId}.sendbird.com`;
      const apiToken = this._getApiToken();
      return apiInstance.ocListChannels(apiToken);
    },
    async listMessages(channelType) {
      const apiInstance = new SendbirdPlatformSdk.MessageApi();
      const appId = "BA0480F7-C300-48B8-B83F-55299A42E896";
      apiInstance.apiClient.basePath = `https://api-${appId}.sendbird.com`;
      const apiToken = this._getApiToken();
      const channelUrl = "sendbird_open_channel_17486_a35ecb12b602bca6690a31311f73d0bb12c5a9e7";
      return apiInstance.listMessages(apiToken, channelType, channelUrl);
    },
  },
};
