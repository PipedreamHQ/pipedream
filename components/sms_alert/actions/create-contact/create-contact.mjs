import smsAlert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within a specified group. [See the documentation](https://kb.smsalert.co.in/developers-api/#Create-Contact)",
  version: "0.0.1",
  type: "action",
  props: {
    smsAlert,
    groupId: {
      propDefinition: [
        smsAlert,
        "groupId",
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
    },
  },
  async run({ $ }) {
    const response = await this.smsAlert.createContact({
      $,
      params: {
        grpname: this.groupId,
        name: this.contactName,
        mobileNumber: this.mobileNumber,
      },
    });

    $.export("$summary", `Successfully created contact ${this.contactName}`);
    return response;
  },
};
