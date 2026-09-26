import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-person",
  name: "Update Person",
  description: "Updates an existing person (contact) in Pipedrive. Only the fields you set are changed."
    + " Find the `Person ID` with **Search persons** or **List Persons**; look up a new owner with **List User ID Options** and a new organization with **List Organizations**."
    + " Example: `Person ID` `42`, `Phones` `[{\"value\": \"+15551234567\", \"primary\": true, \"label\": \"mobile\"}]`."
    + " Use **Get person details** to read the person's current values first."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson)",
  version: "0.0.18",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person to update, e.g. `42`. Use **Search persons** or **List Persons** to find it (the `id` field).",
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new full name of the person, e.g. `Daniel A. Okafor`.",
      optional: true,
    },
    ownerId: {
      label: "Owner ID",
      description: "The ID of the user to set as the new owner, e.g. `12345678`. If omitted, the owner is not changed. Use **List User ID Options** to find it (the `value` field).",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization to move the person to, e.g. `7`. Use **List Organizations** to find it (the `id` field).",
    },
    emails: {
      propDefinition: [
        pipedriveApp,
        "emails",
      ],
    },
    phones: {
      propDefinition: [
        pipedriveApp,
        "phones",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Who can see the person: `1` (owner & followers) or `3` (entire company), e.g. `3`. If omitted, visibility is not changed.",
    },
  },
  async run({ $ }) {
    const fields = [
      "name",
      "ownerId",
      "organizationId",
      "emails",
      "phones",
      "visibleTo",
    ];
    if (fields.every((field) => this[field] === undefined)) {
      throw new ConfigurationError("Set at least one field to update.");
    }

    try {
      const resp =
        await this.pipedriveApp.updatePerson({
          personId: this.personId,
          name: this.name,
          owner_id: this.ownerId,
          org_id: this.organizationId,
          emails: parseObject(this.emails),
          phones: parseObject(this.phones),
          visible_to: this.visibleTo,
        });

      $.export("$summary", `Successfully updated person with ID: ${this.personId}`);

      return resp;

    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
