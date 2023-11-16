import sms_alert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within a specified group. [See the documentation](https://kb.smsalert.co.in/developers-api/#contact-post-create-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    sms_alert,
    groupId: {
      propDefinition: [
        sms_alert,
        "groupId",
      ],
    },
    contactName: {
      propDefinition: [
        sms_alert,
        "contactName",
      ],
    },
    mobileNumber: {
      propDefinition: [
        sms_alert,
        "mobileNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sms_alert.createContact({
      groupName: this.groupId,
      contactName: this.contactName,
      mobileNumber: this.mobileNumber,
    });

    $.export("$summary", `Successfully created contact ${this.contactName}`);
    return response;
  },
};
