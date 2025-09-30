import common from "../common/video-polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "heygen-create-talking-photo",
  name: "Create Talking Photo",
  description: "Creates a talking photo from a provided image. [See the documentation](https://docs.heygen.com/reference/create-an-avatar-video-v2)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    talkingPhotoId: {
      propDefinition: [
        common.props.heygen,
        "talkingPhotoId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text that the character will speak",
    },
    voiceId: {
      propDefinition: [
        common.props.heygen,
        "voiceId",
      ],
    },
    title: {
      propDefinition: [
        common.props.heygen,
        "title",
      ],
      optional: true,
    },
    test: {
      propDefinition: [
        common.props.heygen,
        "test",
      ],
      optional: true,
    },
    caption: {
      propDefinition: [
        common.props.heygen,
        "caption",
      ],
      optional: true,
    },
    scale: {
      type: "string",
      label: "Scale",
      description: "Talking Photo scale, value between 0 and 2.0. Default is 1.0.",
      optional: true,
    },
    talkingPhotoStyle: {
      type: "string",
      label: "Talking Photo Style",
      description: "Talking Photo crop style",
      options: constants.TALKING_PHOTO_STYLES,
      optional: true,
    },
    talkingStyle: {
      type: "string",
      label: "Talking Style",
      description: "Talking Photo talking style",
      options: constants.TALKING_STYLES,
      optional: true,
    },
    expression: {
      type: "string",
      label: "Expression",
      description: "Talking Photo expression style",
      options: constants.EXPRESSIONS,
      optional: true,
    },
    superResolution: {
      type: "boolean",
      label: "Super Resolution",
      description: "Whether to enhance this photar image",
      optional: true,
    },
    matting: {
      type: "boolean",
      label: "Matting",
      description: "Whether to do matting",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async processVideo($) {
      const { data } = await this.heygen.createTalkingPhoto({
        data: {
          title: this.title,
          test: this.test,
          caption: this.caption,
          video_inputs: [
            {
              character: {
                type: "talking_photo",
                talking_photo_id: this.talkingPhotoId,
                scale: this.scale,
                talking_photo_style: this.talkingPhotoStyle,
                talking_style: this.talkingStyle,
                expression: this.expression,
                super_resolution: this.superResolution,
                matting: this.matting,
              },
              voice: {
                type: "text",
                voice_id: this.voiceId,
                input_text: this.text,
              },
            },
          ],
        },
        $,
      });
      return data.video_id;
    },
  },
};
