import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const params = {
      part: consts.UPDATE_PLAYLIST_PART,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel: this.onBehalfOfContentOwnerChannel,
      requestBody: {
        snippet: {
          title: this.title,
          description: this.description,
        },
        status: {
          privacyStatus: this.privacyStatus,
        },
      },
    };
    const { data } = await this.youtubeDataApi.createPlaylist(params);
    $.export("$summary", `Successfully created playlist with ID ${data.id}`);
    return data;
  },
};
