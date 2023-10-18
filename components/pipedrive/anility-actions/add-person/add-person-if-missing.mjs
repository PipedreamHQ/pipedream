import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-add-person",
  name: "Add Person (Anility)",
  description: "Adds a new person if missing. See the Pipedrive API docs for People [here](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson)",
  version: "0.0.2",
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
    anilityIdFieldKey: {
      type: "string",
      label: "AnilityId field key",
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
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
      anilityIdFieldKey,
      anilityIdFieldValue,
    } = this;

    try {

      const searchResp = await this.pipedriveApp.searchPersons({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        org_id: organizationId,
        start: 0,
        limit: 1,
      });

      if (searchResp.data.items.length === 0) {
        var customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        const resp =
          await this.pipedriveApp.addPerson({
            name,
            owner_id: ownerId,
            org_id: organizationId,
            email,
            phone,
            visible_to: visibleTo,
            add_time: addTime,
            ...customFieldValue,
          });

        $.export("$summary", "Successfully added person");

        return resp;
      }
      else {
        $.export("$summary", "Person already exists");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add person";
    }
  },
};
