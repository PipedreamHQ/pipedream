import passslot from "../../passslot.app.mjs";

export default {
  key: "passslot-create-pass",
  name: "Create Pass",
  description: "Creates a new pass using specified pass template. [See the documentation](https://www.passslot.com/developer/api/resources/createPassFromTemplate)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    passslot,
    templateId: {
      propDefinition: [
        passslot,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    const { placeholder } = await this.passslot.getTemplate({
      templateId: this.templateId,
    });
    if (!placeholder?.length) {
      return props;
    }
    for (const value of placeholder) {
      props[value] = {
        type: "string",
        label: `${value}`,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      passslot,
      templateId,
      ...placeholderProps
    } = this;

    const response = await passslot.createPass({
      $,
      templateId,
      data: placeholderProps,
    });

    $.export("$summary", `Successfully created pass with serial number: ${response.serialNumber}`);

    return response;
  },
};
