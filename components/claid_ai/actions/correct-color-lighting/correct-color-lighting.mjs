import FormData from "form-data";
import fs from "fs";
import urlExists from "url-exist";
import claidAi from "../../claid_ai.app.mjs";
import { checkTmp } from "../../common/utils.mjs";

export default {
  key: "claid_ai-correct-color-lighting",
  name: "Correct Color & Lighting",
  description: "Automatically adjusts the color and lighting of an image by applying HDR. The result is an enhancement of the dynamic range in dark or overexposed images.",
  version: "0.0.1",
  type: "action",
  props: {
    claidAi,
    image: {
      propDefinition: [
        claidAi,
        "image",
      ],
    },
    isAutomated: {
      type: "boolean",
      label: "Is Automated",
      description: "Whether you want the automated adjustment or manual for fine-tuning.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isAutomated) {
      props.is360 = {
        type: "boolean",
        label: "Is 360",
        description: "Whether the image is a 360 image or not",
        reloadProps: true,
        default: false,
      };
      props.hdr = {
        type: "integer",
        label: "HDR",
        description: "The intensity of the adjustment.",
      };
      if (this.is360) {
        props.hdr.label = "Intensity";
        props.stitching = {
          type: "boolean",
          label: "Stitching",
          description: "whether the image will be stitched or not.",
        };
      }
    } else {
      props.exposure = {
        type: "string",
        label: "Exposure",
        description: "Decrease (-100) or increase (100) exposure.",
      };
      props.saturation = {
        type: "string",
        label: "Saturation",
        description: "Decrease (-100) or increase (100) saturation.",
      };
      props.contrast = {
        type: "string",
        label: "Contrast",
        description: "Decrease (-100) or increase (100) contrast.",
      };
      props.sharpness = {
        type: "integer",
        label: "Sharpness",
        description: "Increase sharpness.",
        min: 0,
        max: 100,
      };
    }
    return props;
  },
  async run({ $ }) {
    let imageUrl = this.image;
    let response = "";

    const operations = {
      adjustments: {
        exposure: parseInt(this.exposure),
        saturation: parseInt(this.saturation),
        contrast: parseInt(this.contrast),
        sharpness: this.sharpness,
      },
    };

    if (this.isAutomated) {
      operations.adjustments = {
        "hdr": this.hdr,
      };
      if (this.is360) {
        operations.adjustments.hdr = {
          "intensity": this.hdr,
          "stitching": this.stitching,
        };
      }
    }

    if (!await urlExists(this.image)) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(checkTmp(this.image)));
      formData.append("data", JSON.stringify({
        operations,
      }));

      response = await this.claidAi.uploadImage({
        $,
        data: formData,
        headers: formData.getHeaders(),
      });
    } else {
      response = await this.claidAi.editImage({
        $,
        data: {
          input: imageUrl,
          operations,
        },
      });
    }

    $.export("$summary", "Successfully adjusted color and lighting");
    return response;
  },
};
