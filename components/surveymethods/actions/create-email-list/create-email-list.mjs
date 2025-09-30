import surveymethods from "../../surveymethods.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Email List",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "surveymethods-create-email-list",
  description: "Creates a email list. [See docs here in 8.2](https://app.surveymethods.com/t-help/api/surveymethodsapidocumentv1.pdf)",
  type: "action",
  props: {
    surveymethods,
    name: {
      label: "Name",
      description: "The email list name",
      type: "string",
    },
    emailListType: {
      label: "Email List Type",
      description: "The email list type",
      type: "string",
      options: constants.EMAIL_LIST_TYPES,
    },
    customFieldsLabels: {
      label: "Custom Fields Labels",
      description: "The email list custom fields labels. E.g. `FirstName,LastName,Company,Location,Representative ID`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveymethods.createEmailList({
      $,
      data: {
        email_list_type: "Advanced",
        email_list_name: this.name,
        custom_field_labels: this.customFieldsLabels ?? "",
      },
    });

    if (response) {
      $.export("$summary", `Successfully created email list with id ${response.email_list.code}`);
    }

    return response;
  },
};
