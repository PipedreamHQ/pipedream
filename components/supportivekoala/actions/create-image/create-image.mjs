import app from "../../supportivekoala.app.mjs";

export default {
  key: "supportivekoala-create-image",
  name: "Create an Image",
  description: "Creates an image based on a template. [See the docs here](https://developers.supportivekoala.com/#create_image)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const template = await this.app.getTemplate({
      templateId: this.templateId,
    });
    const fields = template.pages[0].children.filter((child) => child.type === "text" && !child.locked);
    const props = fields.reduce((props, field) => ({
      ...props,
      [field.name]: {
        type: "string",
        label: field.name,
        default: field.text,
        optional: true,
      },
    }), {});
    return {
      preview: {
        type: "string",
        label: "Template Preview Link (no input required)",
        description: template.preview,
        optional: true,
      },
      ...props,
    };
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      templateId: template,
      ...fields
    } = this;

    const params = Object.entries(fields).map((field) => {
      const [
        name,
        value,
      ] = field;
      return {
        name,
        value,
      };
    });

    const response = await this.app.createImage({
      $,
      data: {
        template,
        params,
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", "Successfully created image");
    return response;
  },
};
