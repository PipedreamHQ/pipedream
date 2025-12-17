import app from "../../supportivekoala.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "supportivekoala-create-image",
  name: "Create an Image",
  description: "Creates an image based on a template. [See the docs here](https://developers.supportivekoala.com/#create_image)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      preview,
      pages: [
        page,
      ] = [],
    } = await this.app.getTemplate({
      templateId: this.templateId,
    });

    const fields = page?.children?.filter((child) =>
      constants.ALLOWED_FIELD_TYPES.includes(child.type) && !child.locked);
    const props = fields?.reduce((props, field) => ({
      ...props,
      [field.name + "templateId:" + this.templateId]: {
        type: "string",
        label: field.name,
        default: field.text || field.src,
        optional: true,
      },
    }), {});
    return {
      preview: {
        type: "string",
        label: "Template Preview Link (no input required)",
        description: preview,
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
      let [
        name,
        value,
      ] = field;
      name = name.split("templateId")[0];
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
