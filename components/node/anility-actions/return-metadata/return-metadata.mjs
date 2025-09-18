import { type } from "os";

export default {
  key: "anility-return-metadata",
  name: "Return Metadata (Fiable)",
  description: "Returns the request metadata in the HTTP response immediately while allowing the workflow to continue processing in the background.",
  version: "0.0.6",
  type: "action",
  props: {
    context: {
      type: "object",
      label: "Context",
      description: "The context object from the trigger step.",
      optional: false,
    },
  },
  async run({ $ }) {
    const { context } = this;

    await $.respond({
      immediate: true,
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        projectId: context.project_id,
        workflowId: context.workflow_id,
        traceId: context.trace_id,
        traceUrl: `https://pipedream.com/@ahmad-anility/projects/${context.project_id}/${context.workflow_id}/inspect/${context.trace_id}`,
      },
    });
  },
};
