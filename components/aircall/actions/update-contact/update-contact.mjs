import common from "../common/common-create-update.mjs";

const {
  aircall, ...props
} = common.props;

export default {
  ...common,
  name: "Update Contact",
  description: "Update a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#update-a-contact)",
  key: "aircall-update-contact",
  version: "0.0.3",
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
    ...props,
  },
  async run({ $ }) {
    const data = this.getCommonData();
    const response = await this.aircall.updateContact({
      $,
      contactId: this.contactId,
      data,
    });

    $.export("$summary", `Successfully updated contact (ID: ${this.contactId})`);

    return response;
  },
};
