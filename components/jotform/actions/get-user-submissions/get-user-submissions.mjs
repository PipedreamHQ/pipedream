import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-user-submissions",
  name: "Get User Submissions",
  description: "Gets a list of all submissions for all forms on the account [See the docs here](https://api.jotform.com/docs/#user-submissions)",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    max: {
      propDefinition: [
        common.props.jotform,
        "max",
      ],
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
    };
    const submissions = await this.paginate(this.jotform.getUserSubmissions.bind(this), params);
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
