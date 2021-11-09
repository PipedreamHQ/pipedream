import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  key: "amara-get-video-details",
  name: "Get video details",
  description: "Get video details. [See the docs here](https://apidocs.amara.org/#view-video-details)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    videoId: {
      propDefinition: [
        amara,
        "videoId",
      ],
    },
  },
  async run({ $ }) {
    return await this.amara.getVideo({
      $,
      videoId: this.videoId,
    });
  },
};
