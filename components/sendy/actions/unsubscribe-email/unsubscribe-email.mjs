import sendy from "../../sendy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendy-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Removes a subscriber from a specified list.",
  version: "0.0.1",
  type: "action",
  props: {
    sendy,
    listId: {
      propDefinition: [
        sendy,
        "listId",
      ],
    },
    email: {
      propDefinition: [
        sendy,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendy.removeSubscriber({
      listId: this.listId,
      email: this.email,
    });
    $.export("$summary", `Successfully unsubscribed email: ${this.email} from list: ${this.listId}`);
    return response;
  },
};
