// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import terminateLimit from "../../../ramp/actions/terminate-limit/terminate-limit.mjs";

export default {
  ...terminateLimit,
  key: "ramp_sandbox-terminate-limit",
  name: "Terminate Limit",
  description: "Permanently terminate a Ramp Sandbox spend limit by ID. This is irreversible and takes effect immediately. Run the **List Limits** action to find the limit ID. Example: given a limit id from **List Limits**, terminates that limit and returns its final (terminated) state. [See the documentation](https://docs.ramp.com/developer-api/v1/api/funds).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    limitId: {
      type: "string",
      label: "Limit ID",
      description: "The ID of the spend limit to terminate. Run the **List Limits** action to find this value.",
    },
  },
};
