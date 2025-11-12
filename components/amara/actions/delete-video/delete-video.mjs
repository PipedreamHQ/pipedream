import amara from "../../amara.app.mjs";

export default {
  key: "amara-delete-video",
  name: "Delete Video",
  description: "Delete a video. In order to delete a video, it must be part of a team that you're an admin of. [See the docs here](https://apidocs.amara.org/#delete-a-video)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    amara,
    team: {
      propDefinition: [
        amara,
        "team",
      ],
    },
    videoId: {
      propDefinition: [
        amara,
        "videoId",
        ({ team }) => ({
          team,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { videoId } = this;

    const response = await this.amara.deleteVideo({
      $,
      videoId,
    });

    if (!response) {
      $.export("$summary", "Successfully deleted video");

      return {
        id: videoId,
        success: true,
      };
    }

    return response;
  },
};
