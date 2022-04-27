import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-person",
  name: "Add Person",
  description: "Adds a new person. See the Pipedrive API docs for People [here](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson)",
  version: "0.1.2",
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
    email: {
      type: "any",
      label: "Email",
      description: "Email addresses (one or more) associated with the person, presented in the same manner as received by GET request of a person.",
      optional: true,
    },
    phone: {
      type: "any",
      label: "Phone",
      description: "Phone numbers (one or more) associated with the person, presented in the same manner as received by GET request of a person.",
      optional: true,
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Visibility of the person. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
      description: "Optional creation date & time of the person in UTC. Requires admin user API token. Format: `YYYY-MM-DD HH:MM:SS`",
    },
  },
  async run({ $ }) {
    const {
      name,
      ownerId,
      organizationId,
      email,
      phone,
      visibleTo,
      addTime,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.addPerson({
          name,
          owner_id: ownerId,
          org_id: organizationId,
          email,
          phone,
          visible_to: visibleTo,
          add_time: addTime,
        });

      $.export("$summary", "Successfully added person");

      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add person";
    }
  },
};
