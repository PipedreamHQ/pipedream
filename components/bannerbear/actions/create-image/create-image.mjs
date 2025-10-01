import bannerbear from "../../bannerbear.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bannerbear-create-image",
  name: "Create an Image",
  description: "Create an image using template and modifications. [See the docs](https://developers.bannerbear.com/#post-v2-images)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bannerbear,
    template: {
      propDefinition: [
        bannerbear,
        "templateUid",
      ],
    },
    modifications: {
      propDefinition: [
        bannerbear,
        "modifications",
      ],
    },
  },
  async run({ $ }) {
    const { template } = this;

    const modifications = utils.parse(this.modifications);

    const response = await this.bannerbear.createImageSync({
      $,
      data: {
        template,
        modifications,
      },
    });

    console.log(response);

    $.export("$summary", `Successfully created image with UID ${response.uid}`);

    return response;
  },
};
