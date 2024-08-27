import adrapid from "../../adrapid.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "adrapid-create-banner",
  name: "Create Banner",
  description: "Generates a new banner using provided data. This action can create different types of banners, such as animated HTML5, image, or video banners. [See the documentation](https://docs.adrapid.com/api/overview)",
  version: "0.0.1",
  type: "action",
  props: {
    adrapid,
    templateId: {
      propDefinition: [
        adrapid,
        "templateId",
      ],
      reloadProps: true,
    },
    modes: {
      type: "string[]",
      label: "Modes",
      description: "Modes for the resulting banners, previously set on configuration block.",
      options: [
        "html5",
        "amp",
        "png",
        "jpeg",
        "pdf",
        "webp",
        "video",
        "gif",
      ],
      reloadProps: true,
      optional: true,
    },
    overrides: {
      type: "object",
      label: "Overrides",
      description: "With this parameter we override the default template content. We use the name of the item we want to override, valid properties are text, url (for external images) and css. [See the documentation](https://docs.adrapid.com/api/overview).",
      optional: true,
    },
    sync: {
      type: "boolean",
      label: "Sync",
      description: "Get banner url in the same response. Delay the response until the banner is ready. Usually in a few seconds with a maxtime of two minutes.",
      optional: true,
    },
    editable: {
      type: "boolean",
      label: "Editable",
      description: "Make banner editable, creating a template that is a copy of the banner.",
      optional: true,
    },
    excludeBaseSize: {
      type: "boolean",
      label: "Exclude Base Size",
      description: "Exclude base size from the banner. Only applies to multisize banners.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.templateId) {
      const { sizes } = await this.adrapid.getTemplate({
        templateId: this.templateId,
      });
      props.sizeIds = {
        type: "string[]",
        label: "Size Ids",
        description: "The template sizes. To use all of them you can set this parameter to 'all'. If you remove this parameter only the default size of the template will be used.",
        reloadProps: true,
        optional: true,
        options: sizes.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })),
      };
    }

    if (this.modes) {
      if (this.modes.includes("html5")) {
        props.html5Packed = {
          type: "boolean",
          label: "HTML5 Packed",
          description: "Set banner in a single file with embedded images.",
        };
        props.html5Flexible = {
          type: "boolean",
          label: "HTML5 Flexible",
          description: "Set a flexible banner that will adapt to his container.",
        };
      }
      if (this.modes.includes("video")) {
        props.videoFps = {
          type: "integer",
          label: "Video FPS",
          description: "Frame Per Second of resulting video.",
          default: 14,
          max: 60,
        };
        props.videoCrf = {
          type: "integer",
          label: "Video CRF",
          description: "Constant Rate Factor. Less is more quality.",
          default: 18,
          max: 60,
        };
        props.videoOffset = {
          type: "string",
          label: "Audio Offset",
          description: "Audio offset. Can be negative number.",
        };
        props.videoSrc = {
          type: "string",
          label: "Audio SRC",
          description: "URL of the audio file.",
        };
      }
      if (this.modes.includes("gif")) {
        props.gifFps = {
          type: "boolean",
          label: "GIF FPS",
          description: "Frame per second of resulting gif.",
        };
        props.gifFrames = {
          type: "integer[]",
          label: "GIF Frames",
          description: "Select specific seconds in the timeline to be used as frames.",
        };
      }
    }
    return props;
  },
  async run({ $ }) {

    const modes = {};

    if (this.modes) {
      this.modes.forEach((item) => {
        modes[item] = true;
      });

      if (this.modes.includes("html5")) {
        modes.html5 = {
          packed: this.html5Packed,
          flexibe: this.html5Flexible,
        };
      }
      if (this.modes.includes("video")) {
        modes.video = {
          fps: this.videoFps,
          crf: this.videoCrf,
          audio: {
            offset: parseInt(this.videoOffset),
            src: this.videoSrc,
          },
        };
      }
      if (this.modes.includes("gif")) {
        modes.html5 = {
          fps: this.gifFps,
          frames: this.gifFrames,
        };
      }
    }

    const response = await this.adrapid.createBanner({
      $,
      data: {
        sizeIds: this.sizeIds,
        templateId: this.templateId,
        modes,
        overrides: parseObject(this.overrides),
        sync: this.sync,
        editable: this.editable,
        excludeBaseSize: this.excludeBaseSize,
      },
    });

    $.export("$summary", `Banner created successfully with ID: ${response.id}`);
    return response;
  },
};
