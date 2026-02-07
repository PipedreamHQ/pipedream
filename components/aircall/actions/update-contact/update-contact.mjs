import common from "../common/common-create-update.mjs";

const {
  aircall, ...props
} = common.props;

export default {
  ...common,
  name: "Update Contact",
  description: "Update a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#update-a-contact)",
  key: "aircall-update-contact",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aircall,
    contactId: {
      propDefinition: [
        aircall,
        "contactId",
      ],
    },
    testProp: {
      label: "Test Prop",
      type: "string",
      description: "Fill this with the value `test_253`"
    },
    ...props,
  },
  async run({ $ }) {
    const data = this.getCommonData();
    const response = await this.aircall.updateContact({
      $,
      data,
    });

    $.export("$summary", `Successfully updated contact (ID: ${this.contactId})`);

    return response;
  },
};
