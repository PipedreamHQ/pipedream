import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-person",
  name: "Add Person",
  description: "Creates a new person (contact) in Pipedrive. Only `Person Name` is required."
    + " Link the person to a company with an organization ID from **List Organizations**, and assign an owner with an ID from **List User ID Options**."
    + " Example: `Person Name` `Daniel Okafor`, `Emails` `[{\"value\": \"daniel.okafor@example.com\", \"primary\": true, \"label\": \"work\"}]`, `Organization ID` `7`."
    + " Pipedrive does not deduplicate people, so check **Search persons** first to avoid creating a duplicate; use **Merge Persons** if one slips through."
    + " Use **Update Person** to change the person later. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson)",
  version: "0.1.26",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Person Name",
      description: "The full name of the person, e.g. `Daniel Okafor`.",
    },
    ownerId: {
      label: "Owner ID",
      description: "The ID of the user to set as owner of the person, e.g. `12345678`. If omitted, the authorized user is used. Use **List User ID Options** to find it (the `value` field).",
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
      description: "The ID of the organization the person belongs to, e.g. `7`. Use **List Organizations** to find it (the `id` field), or **Add Organization** to create one.",
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
      description: "Who can see the person: `1` (owner & followers) or `3` (entire company), e.g. `3`. If omitted, the account's default visibility for people is used.",
    },
  },
  async run({ $ }) {
    try {
      const resp =
        await this.pipedriveApp.addPerson({
          name: this.name,
          owner_id: this.ownerId,
          org_id: this.organizationId,
          emails: parseObject(this.emails),
          phones: parseObject(this.phones),
          visible_to: this.visibleTo,
        });

      $.export("$summary", "Successfully added person");

      return resp;

    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
