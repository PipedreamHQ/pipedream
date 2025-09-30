import utils from "../../common/utils.mjs";
import app from "../../seqera.app.mjs";

export default {
  key: "seqera-create-compute-environment",
  name: "Create Compute Environment",
  description: "Creates a new compute environment in Seqera Tower. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      description: "A unique name for this compute environment. Use only alphanumeric, dash, and underscore characters. Eg. `My-Env_1`",
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      description: "The description of the compute environment.",
      optional: true,
      propDefinition: [
        app,
        "description",
      ],
    },
    platformId: {
      propDefinition: [
        app,
        "platformId",
      ],
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    credentialsId: {
      optional: true,
      propDefinition: [
        app,
        "credentialsId",
        ({
          platformId, workspaceId,
        }) => ({
          platformId,
          workspaceId,
        }),
      ],
    },
    config: {
      type: "object",
      label: "Configuration",
      description: "The configuration of the compute environment. For the model reference look [here](https://tower.nf/openapi/index.html#post-/compute-envs).",
      optional: true,
    },
  },
  methods: {
    createComputeEnv(args = {}) {
      return this.app.post({
        path: "/compute-envs",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createComputeEnv,
      name,
      platformId,
      description,
      config,
      credentialsId,
    } = this;

    const response = await createComputeEnv({
      $,
      data: {
        computeEnv: {
          name,
          platform: platformId,
          description,
          config: utils.parseProp(config),
          credentialsId,
        },
      },
    });

    $.export("$summary", `Successfully created compute environment with ID \`${response.computeEnvId}\``);

    return response;
  },
};
