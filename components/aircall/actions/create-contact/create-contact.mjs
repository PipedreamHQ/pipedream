import common from "../common/common-create-update.mjs";

export default {
  ...common,
  name: "Create Contact",
  description:
    "Create a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#create-a-contact)",
  key: "aircall-create-contact",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    emails: {
      type: "string[]",
      label: "Emails",
      description:
        "Array of email address objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value. For example, `{{ [{\"label\": \"Work\", \"value\": \"john.doe@test.com\"}] }}`, or `{{ [\"john.doe@test.com\"] }}`",
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description:
        "Array of phone number objects (max 20). Each should contain `label` and `value`. If a string is provided, it will be used as both the label and value. For example, `{{ [{\"label\": \"Work\", \"value\": \"+1 812-641-5139\"}] }}`, or `{{ [\"+1 812-641-5139\"] }}`",
    },
  },
  async run({ $ }) {
    const refinedPhoneNumbers = (this.phoneNumbers || []).map((item) => {
      if (typeof item === "object" && item !== null) {
        return item;
      }

      return {
        label: item,
        value: item,
      };
    });
    const refinedEmails = (this.emails || []).map((item) => {
      if (typeof item === "object" && item !== null) {
        return item;
      }

      return {
        label: item,
        value: item,
      };
    });

    const data = {
      ...this.getCommonData(),
      emails: refinedEmails,
      phone_numbers: refinedPhoneNumbers,
    };

    const response = await this.aircall.createContact({
      $,
      data,
    });

    $.export(
      "$summary",
      `Successfully created contact (ID: ${response?.contact?.id})`,
    );

    return response;
  },
};
