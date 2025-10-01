import passslot from "../../passslot.app.mjs";

export default {
  key: "passslot-update-pass",
  name: "Update Pass",
  description: "Updates an existing pass with new information. [See the documentation](https://www.passslot.com/developer/api/resources/updatePassValues)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    passslot,
    passTypeIdentifier: {
      propDefinition: [
        passslot,
        "passTypeIdentifier",
      ],
    },
    passSerialNumber: {
      propDefinition: [
        passslot,
        "passSerialNumber",
        (c) => ({
          passTypeIdentifier: c.passTypeIdentifier,
        }),
      ],
    },
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
      // eslint-disable-next-line no-unused-vars
      templateId,
      passTypeIdentifier,
      passSerialNumber,
      ...placeholderProps
    } = this;

    const response = await passslot.updatePass({
      $,
      passTypeIdentifier,
      passSerialNumber,
      data: placeholderProps,
    });

    $.export("$summary", `Successfully updated pass with serial number: ${this.passSerialNumber}`);

    return response;
  },
};
