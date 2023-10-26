import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-add-organization-if-missing",
  name: "Add Organization (Anility)",
  description: "Adds a new organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.0.10",
  type: "action",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Organization name",
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Visibility of the organization. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
      description: "Optional creation date & time of the organization in UTC. Requires admin user API token. Format: `YYYY-MM-DD HH:MM:SS`",
    },
    anilityIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "orgCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    label: {
      type: "string",
      label: "label",
      description: "Organization label",
    },
  },
  async run({ $ }) {
    const {
      name,
      ownerId,
      visibleTo,
      addTime,
      anilityIdFieldKey,
      anilityIdFieldValue,
      label,
    } = this;

    try {
      const { data: stages } = await this.pipedriveApp.getOrganizationFields();
      var option = stages.find((stage) => stage.key === "label")
        .options.find((option) => option.label === label);

      var labelValue = {};
      if (option) {
        labelValue["label"] = option.id;
      }

      const searchResp = await this.pipedriveApp.searchOrganization({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        start: 0,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        var customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        const resp = await this.pipedriveApp.addOrganization({
          name,
          owner_id: ownerId,
          visible_to: visibleTo,
          add_time: addTime,
          ...customFieldValue,
          ...labelValue,
        });
        $.export("$summary", "Successfully added organization");
        return resp;
      }
      else {
        $.export("$summary", "Organization already exists");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add organization";
    }
  },
};
