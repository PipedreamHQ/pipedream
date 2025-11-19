import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-merge-persons",
  name: "Merge Persons",
  description: "Merge two persons in Pipedrive. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#mergePersons)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
      description: "The ID of the person to merge",
      optional: false,
    },
    targetPersonId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      label: "Target Person ID",
      description: "The ID of the person that will not be overwritten. This person's data will be prioritized in case of conflict with the other person.",
      optional: false,
    },
  },
  methods: {
    mergePersons({
      id, ...opts
    }) {
      const personsApi = this.pipedriveApp.api("PersonsApi");
      return personsApi.mergePersons({
        id,
        MergePersonsRequest: opts,
      });
    },
  },
  async run({ $ }) {
    const { data } = await this.mergePersons({
      id: this.personId,
      merge_with_id: this.targetPersonId,
    });

    $.export("$summary", `Successfully merged persons with IDs ${this.personId} and ${this.targetPersonId}`);

    return data;
  },
};
