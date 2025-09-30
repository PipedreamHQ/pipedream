import app from "../../lamini.app.mjs";

export default {
  key: "lamini-evaluate-job",
  name: "Evaluate Job",
  description: "Evaluate a fine-tuning job by job ID. [See the documentation](https://docs.lamini.ai/api/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    jobId: {
      propDefinition: [
        app,
        "jobId",
        () => ({
          filter: ({ status }) => status === "COMPLETED",
        }),
      ],
      description: "The ID of the fine-tuning job to evaluate.",
    },
  },
  methods: {
    evaluateJob({
      jobId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/finetune_eval/jobs/${jobId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      evaluateJob,
      jobId,
    } = this;

    const response = await evaluateJob({
      $,
      jobId,
    });

    $.export("$summary", `Successfully evaluated job with ID \`${jobId}\`.`);
    return response;
  },
};
