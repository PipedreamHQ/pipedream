import common from "../common/common.mjs";

export default {
  ...common,
  key: "jotform-list-forms",
  name: "List Forms",
  description: "List all forms in Jotform. [See the documentation](https://api.jotform.com/docs/#forms)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.jotform,
        "teamId",
      ],
    },
    max: {
      propDefinition: [
        common.props.jotform,
        "max",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      $,
      max: this.max,
      teamId: this.teamId,
    };
    const forms = await this.paginate(this.jotform.getForms.bind(this), params);
    const results = [];
    for await (const form of forms) {
      results.push(form);
    }
    $.export("$summary", `Successfully retrieved ${results.length} form${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
