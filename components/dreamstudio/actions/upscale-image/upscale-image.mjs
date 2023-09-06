import FormData from "form-data";
import fs from "node:fs";
import common from "../common/images.mjs";

export default {
  ...common,
  key: "dreamstudio-upscale-image",
  name: "Upscale Image",
  version: "0.0.1",
  description: "Create a higher resolution version of an input image. [See the documentation](https://platform.stability.ai/docs/api-reference#tag/v1generation/operation/upscaleImage)",
  type: "action",
  props: {
    ...common.props,
    image: {
      type: "string",
      label: "Image",
      description: "Image used to upscale. It must be the path to the image file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [see docs here](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    height: {
      propDefinition: [
        common.props.dreamstudio,
        "height",
      ],
      optional: true,
    },
    width: {
      propDefinition: [
        common.props.dreamstudio,
        "width",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dreamstudio,
      organizationId,
      engineId,
      image,
      ...appendData
    } = this;

    const formData = new FormData();

    formData.append("image", fs.readFileSync(`/tmp/${image}`));
    for (const [
      label,
      value,
    ] of Object.entries(appendData)) {
      formData.append(label, value.toString());
    }

    const response = await dreamstudio.upscaleImage({
      $,
      engineId,
      headers: {
        organization: organizationId,
        ...formData.getHeaders(),
      },
      data: formData,
    });

    const paths = await this.writeImg(response.artifacts);

    $.export("$summary", `The image was successfully uposcaled and sent to ${paths.toString()}!`);
    return response;
  },
};
