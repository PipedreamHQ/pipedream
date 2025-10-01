import generatedPhotos from "../../generated_photos.app.mjs";

export default {
  key: "generated_photos-generate-similar-faces-by-url",
  name: "Generate Similar Faces by Image URL",
  description: "Generates faces similar to an image URL with the Generated Photos API. [See the documentation](https://generated.photos/account#apikey)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    generatedPhotos,
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "URL to an image with a face",
    },
    limit: {
      propDefinition: [
        generatedPhotos,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const { faces } = await this.generatedPhotos.generateSimilarFaces({
      params: {
        image_url: this.imageUrl,
        per_page: this.limit,
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
