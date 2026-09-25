import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-merge-persons",
  name: "Merge Persons",
  description: "Merges two duplicate person records into one. The person given as `Person ID` is merged into `Target Person ID`, whose data wins when the two conflict."
    + " Use **Search persons** (e.g. by email) to find duplicates and **Get person details** to compare them before merging. Example: `Person ID` `43`, `Target Person ID` `42`."
    + " The merge cannot be undone. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Persons#mergePersons)",
  version: "0.0.11",
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
      description: "The ID of the duplicate person to merge into the target, e.g. `43`. Use **Search persons** or **List Persons** to find it (the `id` field).",
      optional: false,
    },
    targetPersonId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      label: "Target Person ID",
      description: "The ID of the person to keep, e.g. `42`. Its data wins when the two persons conflict. Must differ from `Person ID`. Use **Search persons** or **List Persons** to find it (the `id` field).",
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
