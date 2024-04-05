import sendsms from "../../sendsms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendsms-add-contact",
  name: "Add Contact",
  description: "Add a new contact into a specified group in SendSMS. [See the documentation](https://www.sendsms.ro/api/)",
  version: "0.0.1",
  type: "action",
  props: {
    sendsms,
    groupId: sendsms.propDefinitions.groupId,
    contactDetails: sendsms.propDefinitions.contactDetails,
  },
  async run({ $ }) {
    const {
      groupId, contactDetails,
    } = this;
    const response = await this.sendsms.addContactToGroup({
      groupId,
      contactDetails,
    });
    $.export("$summary", `Added contact to group ID ${groupId} successfully`);
    return response;
  },
};
