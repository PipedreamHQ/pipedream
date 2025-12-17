import github from "../../github.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-star-repo",
  name: "Star Repo",
  description: "Star a repository. [See the docs](https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#star-a-repository-for-the-authenticated-user) for more info.",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      type: "string",
      label: "Repository",
      description: "The name of the repository (not case sensitive). The format should be `owner/repo` (for example, `PipedreamHQ/pipedream`).",
    },
  },
  async run({ $ }) {
    const { repoFullname } = this;

    // Verify repo exists
    let repo;
    try {
      repo = await this.github.getRepo({
        repoFullname,
      });
    } catch (err) {
      throw new ConfigurationError(`Couldn't find the **${repoFullname}** repo. Please verify the name (\`owner/repo\` format) and try again.`);
    }

    // Star the repo
    await this.github.starRepo({
      repoFullname,
    });

    $.export("$summary", `Successfully starred [${repo.full_name}](${repo.html_url})`);
    return repo.html_url;
  },
};
