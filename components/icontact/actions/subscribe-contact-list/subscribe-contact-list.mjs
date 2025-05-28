import icontact from "../../icontact.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-subscribe-contact-list",
  name: "Subscribe Contact to List",
  description: "Adds a contact to a specific list within iContact. [See the documentation](https://help.icontact.com/customers/s/article/subscriptions-icontact-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    icontact,
    contactEmail: {
      propDefinition: [
        icontact,
        "contactEmail",
      ],
    },
    listId: {
      propDefinition: [
        icontact,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.icontact.subscribeContactToList({
      contactEmail: this.contactEmail,
      listId: this.listId,
    });

    $.export("$summary", `Successfully subscribed ${this.contactEmail} to list with ID ${this.listId}`);
    return response;
  },
};
