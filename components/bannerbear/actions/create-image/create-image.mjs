import bannerbear from '../../bannerbear.app.mjs'

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
      type: 'object',
      description: 'A list of modifications you want to make. [See the docs](https://developers.bannerbear.com/#post-v2-images)'
    }
  },
  async run({ $ }) {
    const res = await this.bannerbear.createImage(
      $,
      this.template,
      this.modifications,
    );

    $.export("$summary", "Create image successfully.");

    return res;
  },
};
