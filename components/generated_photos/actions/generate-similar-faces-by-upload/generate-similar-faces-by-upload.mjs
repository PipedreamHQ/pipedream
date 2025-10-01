import generatedPhotos from "../../generated_photos.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "generated_photos-generate-similar-faces-by-upload",
  name: "Generate Similar Faces to Uploaded Image",
  description: "Generates faces similar to an uploaded image with the Generated Photos API. [See the documentation](https://generated.photos/account#apikey)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    generatedPhotos,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide a file URL or a path to a file in the `/tmp` directory.",
    },
    limit: {
      propDefinition: [
        generatedPhotos,
        "limit",
      ],
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
      file,
      limit,
    } = this;

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);
    const formData = new FormData();
    formData.append("image_file", stream, {
      filename: metadata.name,
    });
    formData.append("per_page", limit);

    const { faces } = await this.generatedPhotos.generateSimilarFaces({
      data: formData,
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
      $,
    });

    if (faces?.length) {
      $.export("$summary", `Successfully generated ${faces.length} face${faces.length === 1
        ? ""
        : "s"}.`);
    }

    return faces;
  },
};
