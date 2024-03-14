import easysendy from "../../easysendy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easysendy-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to an EasySendy list. [See the documentation](https://developers.easysendyapp.com/easysendypro/)",
  version: "0.0.1",
  type: "action",
  props: {
    easysendy,
    email: easysendy.propDefinitions.email,
    listId: easysendy.propDefinitions.listId,
    name: {
      ...easysendy.propDefinitions.name,
      optional: true,
    },
    customFields: {
      ...easysendy.propDefinitions.customFields,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.easysendy.addSubscriber({
      listId: this.listId,
      email: this.email,
      name: this.name,
      customFields: this.customFields,
    });

    $.export("$summary", `Successfully added subscriber ${this.email} to list ${this.listId}`);
    return response;
  },
};
