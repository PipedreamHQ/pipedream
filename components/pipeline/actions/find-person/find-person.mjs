import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Find Person",
  key: "pipeline-find-person",
  description: "Find an existing person in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/People/paths/~1people/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipeline,
    personOwner: {
      propDefinition: [
        pipeline,
        "userId",
      ],
      label: "Person Owner ID",
      description: "Returns records owned by the User with this ID",
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Returns records that match a LIKE query on `first_name`, `last_name`, `email` or associated Company name",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      conditions: {
        person_owner: this.personOwner,
        person_simple_search: this.searchTerm,
      },
    };

    const { results: people } = await this.pipeline.paginate(this.pipeline.listPeople, {
      data,
      $,
    });

    $.export("$summary", `Found ${people.length} matching ${people.length === 1
      ? "person"
      : "people"}.`);

    return people;
  },
};
