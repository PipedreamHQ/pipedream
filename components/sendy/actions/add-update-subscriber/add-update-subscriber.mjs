import sendy from "../../sendy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendy-add-update-subscriber",
  name: "Add or Update a Subscriber",
  description: "Adds a new subscriber or updates existing subscriber's details for a specific list.",
  version: "0.0.1",
  type: "action",
  props: {
    sendy,
    listId: sendy.propDefinitions.listId,
    email: sendy.propDefinitions.email,
    name: {
      ...sendy.propDefinitions.name,
      optional: true,
    },
    country: {
      ...sendy.propDefinitions.country,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendy.addOrUpdateSubscriber({
      listId: this.listId,
      email: this.email,
      name: this.name,
      country: this.country,
    });

    $.export("$summary", `Successfully added or updated the subscriber with email ${this.email}`);
    return response;
  },
};
