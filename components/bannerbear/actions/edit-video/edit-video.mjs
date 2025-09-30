import bannerbear from "../../bannerbear.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bannerbear-edit-video",
  name: "Edit Video",
  description: "Update a video auto-transcription. [See the docs here](https://developers.bannerbear.com/#patch-v2-videos).",
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
    transcription: {
      propDefinition: [
        bannerbear,
        "transcription",
      ],
    },
    approved: {
      propDefinition: [
        bannerbear,
        "approved",
      ],
    },
  },
  async run({ $ }) {
    const {
      uid,
      approved,
    } = this;

    const transcription = utils.parse(this.transcription);

    const response = await this.bannerbear.updateVideo({
      $,
      data: {
        uid,
        transcription,
        approved,
      },
    });

    $.export("$summary", `Successfully updated video with UID ${uid}`);

    return response;
  },
};
