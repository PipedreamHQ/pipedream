import bannerbear from "../../bannerbear.app.mjs";

export default {
  key: "bannerbear-create-image",
  name: "Create an Image",
  description: "Create an image using template and modifications. [See the docs](https://developers.bannerbear.com/#post-v2-images)",
  version: "0.0.1",
  type: "action",
  props: {
    bannerbear,
    template: {
      propDefinition: [
        bannerbear,
        "template",
      ],
    },
    modifications: {
      type: "string",
      label: "Modifications",
      description: "A list of modifications in JSON string format, for example: \"[{\"name\": \"message\", \"text\": \"test message\"}]\". [See the docs](https://developers.bannerbear.com/#post-v2-images)",
    },
  },
  async run({ $ }) {
    const rawModification = this.modifications;
    let modifications;
    try {
      modifications = JSON.parse(rawModification);
    } catch (err) {
      throw new Error("Failed to parse `modifications` as JSON. Please fix your input and try again.");
    }

    const response = await this.bannerbear.createImage(
      $,
      this.template,
      modifications,
    );

    $.export("$summary", "Create image successfully.");

    return response;
  },
};
