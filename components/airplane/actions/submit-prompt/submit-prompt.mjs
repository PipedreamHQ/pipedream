import airplane from "../../airplane.app.mjs";

export default {
  key: "airplane-submit-prompt",
  name: "Submit Prompt",
  description: "Submit a prompt with a set of parameter values. [See the documentation](https://docs.airplane.dev/reference/api#prompts-submit)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airplane,
    runId: {
      propDefinition: [
        airplane,
        "runId",
        () => ({
          status: "Active",
        }),
      ],
    },
    promptId: {
      propDefinition: [
        airplane,
        "promptId",
        (c) => ({
          runID: c.runId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.promptId) {
      return props;
    }
    const promptParameters = await this.getPromptParameters();
    for (const param of promptParameters) {
      if (param.type === "boolean") {
        props[param.slug] = {
          type: "boolean",
          label: param.name,
        };
      } else {
        props[param.slug] = {
          type: "string",
          label: param.name,
        };
      }
    }
    return props;
  },
  methods: {
    async getPromptParameters() {
      const { prompt } = await this.airplane.getPrompt({
        params: {
          id: this.promptId,
        },
      });
      return prompt.schema.parameters;
    },
  },
  async run({ $ }) {
    const values = {};
    const promptParameters = await this.getPromptParameters();
    for (const param of promptParameters) {
      values[param.slug] = this[param.slug];
    }

    const response = await this.airplane.submitPrompt({
      data: {
        id: this.promptId,
        values,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully submitted prompt.");
    }

    return response;
  },
};
