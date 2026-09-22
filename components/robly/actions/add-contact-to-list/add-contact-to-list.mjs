import { ConfigurationError } from "@pipedream/platform";
import robly from "../../robly.app.mjs";

export default {
  key: "robly-add-contact-to-list",
  name: "Add Contact To List",
  description: "Add a contact to one or more sub-lists. [See the documentation](https://docs.robly.com/docs/api-v1/bbf2cab090a93-add-contact-to-sub-list)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    robly,
    email: {
      propDefinition: [
        robly,
        "contactEmail",
      ],
    },
    subListId: {
      propDefinition: [
        robly,
        "listId",
      ],
      type: "integer",
      label: "Sub List",
      description: "The ID of the sub-list to add the contact to",
      withLabel: true,
    },
    includeAutomations: {
      type: "boolean",
      label: "Include Automations",
      description: "When true, the automations associated with the Sub List will be triggered",
    },
    includeAutoresponder: {
      type: "boolean",
      label: "Include Autoresponder",
      description: "When true, this flag will trigger sending the member the autoresponder message when they are subscribed to a list",
    },
  },
  async run({ $ }) {
    const response = await this.robly.addContactToList({
      $,
      params: {
        email: this.email,
        sub_list_id: this.subListId.value,
        include_automations: this.includeAutomations,
        include_autoresponder: this.includeAutoresponder,
      },
    });

    if (("successful" in response) && response.successful === false) {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully added contact "${this.email}" to **${this.subListId.label}** list`);

    return response;
  },
};

