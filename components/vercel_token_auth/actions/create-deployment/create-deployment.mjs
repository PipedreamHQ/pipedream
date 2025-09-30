import vercelTokenAuth from "../../vercel_token_auth.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "vercel_token_auth-create-deployment",
  name: "Create Deployment",
  description: "Create a new deployment from a GitHub repository. [See the documentation](https://vercel.com/docs/rest-api/endpoints/deployments#create-a-new-deployment)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vercelTokenAuth,
    name: {
      type: "string",
      label: "Name",
      description: "A string with the project name used in the deployment URL",
    },
    team: {
      propDefinition: [
        vercelTokenAuth,
        "team",
      ],
    },
    project: {
      propDefinition: [
        vercelTokenAuth,
        "project",
        (c) => ({
          teamId: c.team,
        }),
      ],
      description: "The target project identifier in which the deployment will be created",
      optional: false,
      reloadProps: true,
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Branch of repository to deploy to",
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Whether a deployment's source and logs are available publicly",
      optional: true,
    },
  },
  async additionalProps(props) {
    if (!this.project) {
      return {};
    }
    try {
      const { link } = await this.vercelTokenAuth.getProject(this.project);
      if (link) {
        props.branch.description = `Branch of \`${link.repo}\` repository to deploy to`;
        props.branch.default = link?.productionBranch || "main";
      } else {
        props.branch.default = "main";
      }
    } catch {
      props.branch.default = "main";
      return {};
    }
    return {};
  },
  async run({ $ }) {
    if (!this.branch) {
      throw new ConfigurationError("Branch prop is required");
    }

    const { link } = await this.vercelTokenAuth.getProject(this.project, $);
    if (!link?.repoId) {
      throw new ConfigurationError(`No linked repository found for project with ID: ${this.project}`);
    }
    const repoId = link.repoId;

    const data = {
      name: this.name,
      project: this.project,
      teamId: this.team,
      public: this.public,
      gitSource: {
        type: "github",
        repoId,
        ref: this.branch,
      },
    };
    const res = await this.vercelTokenAuth.createDeployment(data, $);
    $.export("$summary", "Successfully created new deployment");
    return res;
  },
};
