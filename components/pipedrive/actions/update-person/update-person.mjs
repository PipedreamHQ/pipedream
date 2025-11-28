import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-person",
  name: "Update Person",
  description: "Updates an existing person in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person to update",
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name of the person",
      optional: true,
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this person. When omitted, the authorized user ID will be used.",
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
      description: "ID of the organization this person will belong to",
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
      description: "Visibility of the person. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
    },
  },
  async run({ $ }) {
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
