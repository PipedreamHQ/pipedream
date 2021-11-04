import amara from "../../amara.app.mjs";

export default {
  key: "amara-delete-video",
  name: "Delete video",
  description: "Delete a video. In order to delete a video, it must be part of a team that you're an admin of. [See the docs here](https://apidocs.amara.org/#delete-a-video)",
  type: "action",
  version: "0.0.1",
  props: {
    amara,
    videoId: {
      propDefinition: [
        amara,
        "videoId",
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
      return {
        id: videoId,
        success: true,
      };
    }

    return response;
  },
};
