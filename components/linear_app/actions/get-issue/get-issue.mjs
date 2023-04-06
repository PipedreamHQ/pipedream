import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";
const getAdditionalIssueInformation = utils.getAdditionalIssueInformation;

export default {
  key: "linear_app-get-issue",
  name: "Get Issue",
  description: "Get an issue by ID (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.1.1",
  type: "action",
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The issue ID",
    },
  },
  methods: {
    getAdditionalIssueInformation,
  },
  async run({ $ }) {
    const issue = await this.linearApp.getIssue(this.issueId);
    $.export("$summary", `Found issue with ID ${this.issueId}`);
    return (await this.getAdditionalIssueInformation([
      issue,
    ]))[0];
  },
};
