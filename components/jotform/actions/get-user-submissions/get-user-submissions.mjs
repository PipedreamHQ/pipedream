import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-user-submissions",
  name: "Get User Submissions",
  description: "Gets a list of all submissions for all forms on the account",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  async run() {
    const submissions = await this.paginate(this.jotform.getUserSubmissions.bind(this));
    const results = [];
    for await (const submission of submissions) {
      results.push(submission);
    }
    return results;
  },
};
