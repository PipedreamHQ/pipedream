import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-update-deal-watchers",
  name: "Update Deal Watchers (Anility)",
  description: "Updates the watchers properties of a deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.0.17",
  type: "action",
  props: {
    pipedriveApp,
    dealId: {
      description: "ID of the deal",
      optional: false,
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    anilityIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "personCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    watcherFieldKeys: {
      type: "string",
      label: "Watcher field keys",
      description: "Watcher field keys in Pipedrive (comma separated)",
    },
    watchersPeople: {
      type: "string",
      label: "Watchers delimited information",
      description: "Watcher person in Pipedrive (JSON array string)",
    },
    label: {
      type: "string",
      label: "label",
      description: "Person label",
    },
  },
  methods: {
    async getOrAddPersonWatcher(
      anilityIdFieldKey,
      anilityIdFieldValue,
      organizationId,
      email,
      name,
      label,
    ) {
      const { data: stages } = await this.pipedriveApp.getPersonFields();
      const option = stages.find((stage) => stage.key === "label")
        .options.find((option) => option.label.toLowerCase() === label.toLowerCase());

      const labelValue = {};
      if (option) {
        labelValue["label"] = option.id;
      }

      const searchResp = await this.pipedriveApp.searchPersons({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        org_id: organizationId,
        start: 0,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        const customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        const resp = await this.pipedriveApp.addPerson({
          name,
          org_id: organizationId,
          email,
          ...customFieldValue,
          ...labelValue,
        });

        return resp.data.id;
      }
      else {
        return searchResp.data.items[0].item.id;
      }
    },
  },
  async run({ $ }) {
    const {
      dealId,
      organizationId,
      watcherFieldKeys,
      watchersPeople,
      getOrAddPersonWatcher,
      anilityIdFieldKey,
      label,
    } = this;

    try {
      const customField = {};

      const watcherFieldKeysArray = watcherFieldKeys.split(",");
      const watchersPeopleArray = JSON.parse(watchersPeople);
      for (let i = 0; i < watcherFieldKeysArray.length; i++) {
        var personId = null;
        if (i < watchersPeopleArray.length) {
          const anilityIdFieldValue = watchersPeopleArray[i].anilityId;
          const email = watchersPeopleArray[i].email;
          const name = watchersPeopleArray[i].name;

          personId = await getOrAddPersonWatcher(
            anilityIdFieldKey,
            anilityIdFieldValue,
            organizationId,
            email,
            name,
            label,
          );
        }
        customField[watcherFieldKeysArray[i]] = personId;
      }
      await this.pipedriveApp.updateDeal({
        dealId,
        ...customField,
      });

      $.export("$summary", customField);

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to update deal";
    }
  },
};
