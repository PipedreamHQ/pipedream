import bannerbear from "../../bannerbear.app.mjs";

export default {
  key: "bannerbear-approve-video",
  name: "Approve Video",
  description: "Approve a video to proceed with rendering. [See the docs here](https://developers.bannerbear.com/#patch-v2-videos).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bannerbear,
    uid: {
      propDefinition: [
        bannerbear,
        "videoUid",
      ],
    },
  },
  async run({ $ }) {
    const { uid } = this;

    const response = await this.bannerbear.updateVideo({
      $,
      data: {
        uid,
        approved: true,
      },
    });

    $.export("$summary", `Successfully approved video with UID ${response.uid}`);

    return response;
  },
};
