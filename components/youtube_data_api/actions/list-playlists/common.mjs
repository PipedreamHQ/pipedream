export default {
  async run({ $ }) {
    const {
      useCase,
      id,
      channelId,
      part,
      hl,
      maxResults,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
    } = this;

    const mine = useCase === "mine" ?
      true :
      undefined;

    const playlists = (await this.youtubeDataApi.listPlaylists({
      part,
      id,
      mine,
      channelId,
      hl,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
      maxResults,
    })).data;
    $.export("$summary", `Successfully fetched ${playlists.items.length} playlist(s)`);
    return playlists;
  },
};
