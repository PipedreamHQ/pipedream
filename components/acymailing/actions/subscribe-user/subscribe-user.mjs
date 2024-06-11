import acymailing from "../../acymailing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acymailing-subscribe-user",
  name: "Subscribe User to Lists",
  description: "Subscribes a user to one or more specified lists in AcyMailing. Adds user to database if they do not exist.",
  version: "0.0.1",
  type: "action",
  props: {
    acymailing,
    userEmail: {
      propDefinition: [
        acymailing,
        "userEmail",
      ],
    },
    listIds: {
      propDefinition: [
        acymailing,
        "listIds",
      ],
    },
  },
  async run({ $ }) {
    // Check if the user already exists and add them to the database if not
    const userData = {
      email: this.userEmail,
    };
    const userResponse = await this.acymailing.createUserOrUpdate(userData);
    if (userResponse.status !== 200) {
      throw new Error(`Error creating or updating user: ${userResponse.data.message}`);
    }

    // Subscribe the user to the specified lists
    const subscribeResponse = await this.acymailing.subscribeUserToLists(this.userEmail, this.listIds);
    if (subscribeResponse.status !== 200) {
      throw new Error(`Error subscribing user to lists: ${subscribeResponse.data.message}`);
    }

    $.export("$summary", `Successfully subscribed ${this.userEmail} to lists ${this.listIds.join(", ")}`);
    return subscribeResponse.data;
  },
};
