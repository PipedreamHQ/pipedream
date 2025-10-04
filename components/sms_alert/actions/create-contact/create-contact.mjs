import smsAlert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within a specified group. [See the documentation](https://kb.smsalert.co.in/developers-api/#Create-Contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsAlert,
    groupName: {
      propDefinition: [
        smsAlert,
        "groupName",
      ],
    },
    contactName: {
      propDefinition: [
        smsAlert,
        "contactName",
      ],
    },
    mobileNumber: {
      propDefinition: [
        smsAlert,
        "mobileNumber",
      ],
      description: "The number of the contact.",
    },
  },
  async run({ $ }) {
    const response = await this.smsAlert.createContact({
      $,
      params: {
        grpname: this.groupName,
        name: this.contactName,
        number: this.mobileNumber,
      },
    });

    if (response.status === "error") {
      throw new Error(`API response: "${response?.description?.desc ?? JSON.stringify(response)}"`);
    }

    $.export("$summary", `Successfully created contact ${this.contactName ?? this.mobileNumber}`);
    return response;
  },
};
