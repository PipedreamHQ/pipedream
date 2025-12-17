import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-form-submissions",
  name: "Get Form Submissions",
  description: "Gets a list of form responses [See the docs here](https://api.jotform.com/docs/#form-id-submissions)",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.jotform,
        "teamId",
      ],
    },
    formId: {
      propDefinition: [
        common.props.jotform,
        "formId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    max: {
      propDefinition: [
        common.props.jotform,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      $,
      max: this.max,
      formId: this.formId,
      teamId: this.teamId,
    };
    const submissions = await this.paginate(this.jotform.getFormSubmissions.bind(this), params);
    const results = [];
    for await (const submission of submissions) {
      results.push(submission);
    }
    $.export("$summary", `Successfully retrieved ${results.length} form submission${results.length === 1
      ? "s"
      : ""}`);
    return results;
  },
};
