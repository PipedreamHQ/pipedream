import daytona from "../../daytona.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "daytona-clone-git-repository",
  name: "Clone Git Repository",
  description: "Clone a Git repository into a Daytona sandbox. Supports public and private repos, specific branches, and specific commits. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/git/#clone)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    daytona,
    sandboxId: {
      propDefinition: [
        daytona,
        "sandboxId",
      ],
    },
    url: {
      type: "string",
      label: "Repository URL",
      description: "The URL of the Git repository to clone (e.g. `https://github.com/user/repo.git`)",
    },
    path: {
      type: "string",
      label: "Destination Path",
      description: "Path inside the sandbox where the repository should be cloned (e.g. `workspace/repo`). Relative paths are resolved based on the sandbox working directory.",
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Specific branch to clone. If not specified, clones the default branch.",
      optional: true,
    },
    commitId: {
      type: "string",
      label: "Commit ID",
      description: "Specific commit SHA to checkout. If specified, the repository will be left in a detached HEAD state at this commit.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Git username for authentication. Required for private repositories.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password / Token",
      description: "Git password or personal access token (PAT) for authentication. Required for private repositories.",
      optional: true,
      secret: true,
    },
  },
  async run({ $ }) {
    if ((this.username && !this.password) || (!this.username && this.password)) {
      throw new ConfigurationError("Provide both Username and Password / Token together for private repository cloning.");
    }

    await this.daytona.cloneGitRepository(
      this.sandboxId,
      this.url,
      this.path,
      this.branch,
      this.commitId,
      this.username,
      this.password,
    );
    $.export("$summary", `Successfully cloned ${this.url} into sandbox ${this.sandboxId}`);
  },
};
