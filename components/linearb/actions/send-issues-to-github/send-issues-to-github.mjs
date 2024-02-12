import linearb from "../../linearb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "linearb-send-issues-to-github",
  name: "Send Issues to GitHub",
  description: "Send issues to GitHub using LinearB. [See the documentation](https://linearb.helpdocs.io/article/dp1xxqjsrv-draft-pull-requests)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linearb,
    issueData: {
      propDefinition: [
        linearb,
        "issueData",
      ],
    },
    githubRepo: {
      propDefinition: [
        linearb,
        "githubRepo",
      ],
    },
    githubToken: {
      propDefinition: [
        linearb,
        "githubToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linearb.sendIssueToGitHub({
      issueData: this.issueData,
      githubRepo: this.githubRepo,
      githubToken: this.githubToken,
    });

    $.export("$summary", `Successfully sent issue to GitHub repository ${this.githubRepo}`);
    return response;
  },
};
