// legacy_hash_id: a_0Mi7n5
import { axios } from "@pipedream/platform";

export default {
  key: "sendinblue-add-new-contact",
  name: "Add a new contact",
  description: "Add a new contact and list",
  version: "0.2.1",
  type: "action",
  props: {
    sendinblue: {
      type: "app",
      app: "sendinblue",
    },
    email: {
      type: "string",
    },
    name: {
      type: "string",
    },
    listID: {
      type: "any",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.sendinblue.com/v3/contacts",
      method: "post",
      headers: {
        "api-key": `${this.sendinblue.$auth.api_key}`,
        "content-type": "application/json",
      },
      data: {
        email: this.email,
        attributes: {
          "FIRSTNAME": `${this.name}`,
        },
        listIds: this.listID, //Find the List ID from https://my.sendinblue.com/users/list/id/{ListID}
      },
    });
  },
};
