import app from "../../seqera.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "seqera-create-pipeline",
  name: "Create Pipeline",
  description: "Creates a new pipeline in a user context. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
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
      description: "The name of the pipeline to create. Use only alphanumeric, dash, and underscore characters. Eg. `My-Pipeline_1`",
      propDefinition: [
        app,
        "name",
      ],
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
    description: {
      description: "The description of the pipeline to create",
      optional: true,
      propDefinition: [
        app,
        "description",
      ],
    },
    launch: {
      description: "The launch configuration of the pipeline to create",
      propDefinition: [
        app,
        "launch",
      ],
    },
  },
  methods: {
    createPipeline(args = {}) {
      return this.app.post({
        path: "/pipelines",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPipeline,
      name,
      computeEnvId,
      pipeline,
      description,
      launch,
    } = this;

    const response = await createPipeline({
      $,
      data: {
        name,
        description,
        launch: {
          computeEnvId,
          pipeline,
          ...utils.parseProp(launch),
        },
      },
    });

    $.export("$summary", `Successfully created pipeline with ID \`${response?.pipeline?.pipelineId}\``);

    return response;
  },
};
