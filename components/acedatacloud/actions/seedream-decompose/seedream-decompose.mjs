import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredHttpUrl } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-seedream-decompose",
  name: "Decompose Seedream Image",
  description: "Extract editable layers from an image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/seedream-images)",
  path: "/seedream/images",
  props: {
    imageUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      description: "Public HTTP or HTTPS image to decompose, e.g. `https://example.com/poster.png`.",
    },
  },
  buildData: (step) => ({
    model: "doubao-seedream-5-0-pro-260628",
    image: requiredHttpUrl(step.imageUrl, "Image URL"),
    size: "auto",
    response_format: "url",
    layer_decomposition: true,
  }),
});
