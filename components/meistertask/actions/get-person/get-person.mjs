import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-get-person",
  name: "Get Person",
  description: "Retrieves information about a person. [See the docs](https://developers.meistertask.com/reference/get-person)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
      optional: true,
    },
    personId: {
      propDefinition: [
        meistertask,
        "personId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meistertask.getPerson({
      personId: this.personId,
      $,
    });
    if (response) {
      $.export("$summary", `Successfully retrieved person with ID ${this.personId}`);
    }
    return response;
  },
};
