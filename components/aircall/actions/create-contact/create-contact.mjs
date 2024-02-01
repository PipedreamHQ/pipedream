import common from "../common/common-create-update.mjs";

export default {
  ...common,
  name: "Create Contact",
  description: "Create a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#create-a-contact)",
  key: "aircall-create-contact",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Array of email address objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value.",
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of phone number objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value.",
    },
  },
  async run({ $ }) {
    const data = {
      ...this.getCommonData(),
      emails: this.emails,
      phone_numbers: this.phoneNumbers,
    };
    const response = await this.aircall.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact (ID: ${response?.contact?.id})`);

    return response;
  },
};
