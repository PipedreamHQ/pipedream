import { axios } from "@pipedream/platform";
import spiritme from "../../spiritme.app.mjs";

export default {
  key: "spiritme-generate-video",
  name: "Generate Video",
  description: "Generates a new video using specific voice and avatar props. [See the documentation](https://api.spiritme.tech/api/swagger/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    spiritme,
    voice: {
      propDefinition: [
        spiritme,
        "voice",
      ],
      required: true,
    },
    avatar: {
      propDefinition: [
        spiritme,
        "avatar",
      ],
      optional: true,
    },
    videoLength: {
      propDefinition: [
        spiritme,
        "videoLength",
      ],
      optional: true,
    },
    script: {
      propDefinition: [
        spiritme,
        "script",
      ],
      optional: true,
    },
    desiredAnimation: {
      propDefinition: [
        spiritme,
        "desiredAnimation",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.spiritme.generateVideo(
      this.voice,
      this.avatar,
      this.videoLength,
      this.script,
      this.desiredAnimation,
    );
    $.export("$summary", `Generated video with ID: ${response.video_id}`);
    return response;
  },
};
