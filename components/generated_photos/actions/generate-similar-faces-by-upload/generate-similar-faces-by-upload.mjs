import generatedPhotos from "../../generated_photos.app.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "generated_photos-generate-similar-faces-by-upload",
  name: "Generate Similar Faces to Uploaded Image",
  description: "Generates faces similar to an uploaded image with the Generated Photos API. [See the documentation](https://generated.photos/account#apikey)",
  version: "0.0.1",
  type: "action",
  props: {
    generatedPhotos,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the image file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    limit: {
      propDefinition: [
        generatedPhotos,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const filePath = this.filePath.startsWith("/tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(filePath));
    formData.append("per_page", this.limit);

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
