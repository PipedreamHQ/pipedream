import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import { writeImg } from "../../common/utils.mjs";
import common from "../common/images.mjs";

export default {
  ...common,
  key: "dreamstudio-upscale-image",
  name: "Upscale Image",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a higher resolution version of an input image. [See the documentation](https://platform.stability.ai/docs/api-reference#tag/v1generation/operation/upscaleImage)",
  type: "action",
  props: {
    ...common.props,
    image: {
      type: "string",
      label: "Image Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.png`)",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
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

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(image);
    formData.append("image", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
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

    const paths = await writeImg(response.artifacts);

    $.export("$summary", `The image was successfully upscaled and sent to ${paths.toString()}!`);
    return {
      ...response,
      tmpPaths: paths,
    };
  },
};
