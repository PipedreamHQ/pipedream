import { ConfigurationError } from "@pipedream/platform";

export default {
  async run({ $ }) {
    if (!this.description && !this.defaultLanguage && !this.keywords?.length) {
      throw new ConfigurationError("At least one of `description`, `defaultLanguage`, or `keywords` must be entered.");
    }

    const part = [
      "id",
      "brandingSettings",
    ];
    const { data } = await this.youtubeDataApi.listChannels({
      part,
      id: this.channelId,
    });
    const [
      channel,
    ] = data.items;

    const description = this.description || channel.brandingSettings.channel.description;
    const defaultLanguage = this.defaultLanguage
      || channel.brandingSettings.channel.defaultLanguage;
    const keywords = this.keywords?.join() || channel.brandingSettings.channel.keywords;

    const params = {
      part,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      requestBody: {
        id: this.channelId,
        brandingSettings: {
          channel: {},
        },
      },
    };
    if (description) {
      params.requestBody.brandingSettings.channel.description = description;
    }
    if (defaultLanguage) {
      params.requestBody.brandingSettings.channel.defaultLanguage = defaultLanguage;
    }
    if (keywords) {
      params.requestBody.brandingSettings.channel.keywords = keywords;
    }

    const { data: response } = await this.youtubeDataApi.updateChannel(params);
    $.export("$summary", `Successfully updated channel with ID ${this.channelId}`);
    return response;
  },
};
