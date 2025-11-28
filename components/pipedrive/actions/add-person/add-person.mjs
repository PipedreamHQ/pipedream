import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-person",
  name: "Add Person",
  description: "Adds a new person. See the Pipedrive API docs for People [here](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson)",
  version: "0.1.19",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Person name",
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
      description: "ID of the organization this person will belong to.",
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
