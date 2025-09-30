import app from "../../seqera.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "seqera-create-action",
  name: "Create Pipeline Action",
  description: "Creates a new pipeline action in Seqera. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
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
      description: "The name of the pipeline action to create. Use only alphanumeric, dash, and underscore characters. Eg. `My-Action_1`",
      propDefinition: [
        app,
        "name",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the action to create",
      options: constants.SOURCES,
    },
    computeEnvId: {
      propDefinition: [
        app,
        "computeEnvId",
      ],
    },
    pipeline: {
      propDefinition: [
        app,
        "pipeline",
      ],
    },
    launch: {
      description: "The launch configuration of the action to create",
      propDefinition: [
        app,
        "launch",
      ],
    },
  },
  methods: {
    createPipelineAction(args = {}) {
      return this.app.post({
        path: "/actions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPipelineAction,
      name,
      source,
      computeEnvId,
      pipeline,
      launch,
    } = this;

    const response = await createPipelineAction({
      $,
      data: {
        name,
        source,
        launch: {
          computeEnvId,
          pipeline,
          ...utils.parseProp(launch),
        },
      },
    });

    $.export("$summary", `Successfully created pipeline action with ID \`${response.actionId}\``);
    return response;
  },
};
