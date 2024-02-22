import yespo from "../../yespo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "yespo-add-update-contact",
  name: "Add or Update Contact",
  description: "Adds a new contact or updates an existing one. [See the documentation](https://docs.yespo.io/reference/addcontact-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    yespo,
    channels: yespo.propDefinitions.channels,
    segment: {
      ...yespo.propDefinitions.segment,
      optional: true,
    },
    eventtypekey: {
      ...yespo.propDefinitions.eventtypekey,
      optional: true,
    },
    recipientEmail: {
      ...yespo.propDefinitions.recipientEmail,
      optional: true,
    },
    messageSubject: {
      ...yespo.propDefinitions.messageSubject,
      optional: true,
    },
    messageBody: {
      ...yespo.propDefinitions.messageBody,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      channels: this.channels.map(JSON.parse),
    };

    if (this.segment) data.segment = this.segment;
    if (this.eventtypekey) data.eventtypekey = this.eventtypekey;
    if (this.recipientEmail) data.recipientEmail = this.recipientEmail;
    if (this.messageSubject) data.messageSubject = this.messageSubject;
    if (this.messageBody) data.messageBody = this.messageBody;

    const response = await this.yespo.addOrUpdateContact(data);
    $.export("$summary", "Successfully added or updated the contact");
    return response;
  },
};
