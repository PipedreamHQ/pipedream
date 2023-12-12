import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-form-submissions",
  name: "Get Form Submissions",
  description: "Gets a list of form responses [See the docs here](https://api.jotform.com/docs/#form-id-submissions)",
  version: "0.1.0",
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
    encrypted: {
      propDefinition: [
        common.props.jotform,
        "encrypted",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.encrypted) {
      props.privateKey = common.props.jotform.propDefinitions.privateKey;
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      $,
      max: this.max,
      formId: this.formId,
    };
    const submissions = await this.paginate(this.jotform.getFormSubmissions.bind(this), params);
    const results = [];
    for await (let submission of submissions) {
      if (this.encrypted) {
        submission = this.jotform.decryptSubmission(submission, this.privateKey);
      }
      results.push(submission);
    }
    $.export("$summary", `Successfully retrieved ${results.length} form submission${results.length === 1
      ? "s"
      : ""}`);
    return results;
  },
};
