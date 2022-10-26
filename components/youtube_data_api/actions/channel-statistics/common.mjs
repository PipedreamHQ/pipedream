import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const {
      id,
      onBehalfOfContentOwner,
      maxResults,
      hl,
    } = this;
    const part = consts.LIST_CHANNEL_STATISTICS_PART;
    const mine = this.useCase === "mine" ?
      true :
      undefined;
    const managedByMe = this.useCase === "managedByMe" ?
      true :
      undefined;
    const channels = (await this.youtubeDataApi.listChannels({
      id,
      mine,
      managedByMe,
      part,
      onBehalfOfContentOwner,
      maxResults,
      hl,
    })).data;
    $.export("$summary", `Successfully fetched ${channels.items.length} channel(s)`);
    return channels;
  },
};
