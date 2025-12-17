import userlist from "../../userlist.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "userlist-create-event",
  name: "Create Event",
  description: "Generates a new event in Userlist. [See the documentation](https://userlist.com/docs/getting-started/integration-guide/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    userlist,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event",
    },
    user: {
      propDefinition: [
        userlist,
        "user",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        userlist,
        "company",
      ],
      optional: true,
    },
    properties: {
      type: "object",
      label: "Relationship Properties",
      description: "Custom relationship properties. Example: `{{ { \"product\": \"Flowers\", \"price\": \"$12.99\" } }}`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.user && !this.company) {
      throw new ConfigurationError("At least one of User or Company must be provided.");
    }

    const response = await this.userlist.generateNewEvent({
      data: {
        name: this.name,
        user: this.user,
        company: this.company,
        properties: this.properties,
      },
      $,
    });
    $.export("$summary", `Successfully created event: ${this.name}`);
    return response;
  },
};
