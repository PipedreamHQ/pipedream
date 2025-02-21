import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const {
      useCase,
      id,
      channelId,
      hl,
      maxResults,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
    } = this;

    const mine = useCase === "mine" ?
      true :
      undefined;

    const { data: playlists } = await this.youtubeDataApi.listPlaylists({
      part: consts.LIST_PLAYLISTS_PART_OPTS,
      id,
      mine,
      channelId,
      hl,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
      maxResults,
    });
    $.export("$summary", `Successfully fetched ${playlists.items.length} playlist${playlists.items.length === 1
      ? ""
      : "s"}`);
    return playlists;
  },
};
