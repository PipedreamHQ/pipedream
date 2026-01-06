import { ConfigurationError } from "@pipedream/platform";
import robly from "../../robly.app.mjs";

export default {
  key: "robly-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Remove a contact from one or more sub-lists. [See the documentation](https://docs.robly.com/docs/api-v1/8a9e116c7ab26-unsubscribe-contact)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    robly,
    removeFromList: {
      propDefinition: [
        robly,
        "listId",
      ],
      label: "List ID",
      description: "The ID of the sub-list to remove the contact from",
      withLabel: true,
    },
    contactEmail: {
      propDefinition: [
        robly,
        "contactEmail",
        ({ removeFromList }) => ({
          listId: removeFromList.value,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.robly.removeContactFromList({
      $,
      params: {
        email: this.contactEmail,
        sub_list_id: this.removeFromList.value,
      },
    });

    if (("successful" in response) && response.successful === false) {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully removed contact "${this.contactEmail}" from **${this.removeFromList.label}** list`);

    return response;
  },
};

