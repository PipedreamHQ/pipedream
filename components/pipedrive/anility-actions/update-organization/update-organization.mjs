import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-update-organization",
  name: "Update Organization (Anility)",
  description: "Update existing organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    customFieldKey: {
      propDefinition: [
        pipedriveApp,
        "orgCustomFieldKey",
      ],
      description: "Custom field in Pipedrive",
    },
    customFieldValue: {
      type: "string",
      label: "Custom field value",
      description: "Anility Id custom field value in Pipedrive",
    },
  },
  async run({ $ }) {
    const {
      anilityIdFieldValue,
      customFieldKey,
      customFieldValue,
    } = this;

    try {
      const searchResp = await this.pipedriveApp.searchOrganization({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        start: 0,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        $.export("$summary", "Organization does not exist");
        return searchResp;
      }
      else {
        let customFieldValueObject = {};
        customFieldValueObject[customFieldKey] = customFieldValue;
        await this.pipedriveApp.updateOrganization({
          organizationId: searchResp.data.items[0].item.id,
          ...customFieldValueObject,
        });
        $.export("$summary", "Successfully updated organization");
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
