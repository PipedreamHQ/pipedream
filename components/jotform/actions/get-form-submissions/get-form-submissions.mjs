import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-form-submissions",
  name: "Get Form Submissions",
  description: "Gets a list of form responses [See the docs here](https://api.jotform.com/docs/#form-id-submissions)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.jotform,
        "formId",
      ],
    },
    max: {
      propDefinition: [
        common.props.jotform,
        "max",
      ],
    },
    http: "$.interface.http",
  },
  async run({ $ }) {
    const params = {
      $,
      max: this.max,
      formId: this.formId,
    };
    const submissions = await this.paginate(this.jotform.getFormSubmissions.bind(this), params);
    const results = [];
    for await (const submission of submissions) {
      results.push(submission);
    }
    $.export("$summary", "Successfully retrieved list of form submissions");
    return results;
  },
};
