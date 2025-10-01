import campayn from "../../campayn.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "campayn-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "Unsubscribes a contact from a list. [See the docs](https://github.com/nebojsac/Campayn-API/blob/master/endpoints/lists.md#unsubscribe-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    campayn,
    listId: {
      propDefinition: [
        campayn,
        "listId",
      ],
    },
    contactId: {
      propDefinition: [
        campayn,
        "contactId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact to unsubscribe",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.email) {
      throw new ConfigurationError("Either `contactId` or `email` must be provided.");
    }

    const data = this.contactId
      ? {
        id: this.contactId,
      }
      : {
        email: this.email,
      };

    const response = await this.campayn.unsubscribeContact(this.listId, {
      data,
      $,
    });

    $.export("$summary", `Successfully unsubscribed contact ${this.contactId || this.email } from list ${this.listId}`);

    return response;
  },
};
