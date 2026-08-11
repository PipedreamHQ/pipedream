// x-pd-ai: optimized
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-get-call",
  name: "Get Call",
  description: "Retrieve a single call by its ID, including its summary and transcript when available. Summary and transcript are fetched from OpenPhone's separate `/summary` and `/transcript` endpoints and merged into the result; they are `null` if OpenPhone has not yet generated them. Use **List Calls** to find call IDs. Example: call with callId=\"AC123abc\" → returns the call record with `summary` and `transcript` fields merged in. [See the documentation](https://www.openphone.com/docs/api-reference/calls/get-a-call-by-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    callId: {
      type: "string",
      label: "Call ID",
      description: "The ID of the call to retrieve (format `AC...`). Run the **List Calls** action first to find call IDs.",
    },
  },
  async run({ $ }) {
    const [
      callResult,
      summaryResult,
      transcriptResult,
    ] = await Promise.allSettled([
      this.openphone.getCall({
        callId: this.callId,
        $,
      }),
      this.openphone.getCallSummary({
        callId: this.callId,
        $,
      }),
      this.openphone.getCallTranscript({
        callId: this.callId,
        $,
      }),
    ]);

    if (callResult.status === "rejected") {
      throw callResult.reason;
    }

    // A summary/transcript not yet generated 404s — that's the only rejection reason
    // that means "null", not "failed". Anything else (auth, rate limit, 5xx) is a real
    // failure and should propagate instead of silently reporting success.
    const auxiliaryResultOrThrow = (result) => {
      if (result.status === "fulfilled") return result.value;
      if (result.reason?.status === 404) return null;
      throw result.reason;
    };

    const call = callResult.value;
    const summary = auxiliaryResultOrThrow(summaryResult);
    const transcript = auxiliaryResultOrThrow(transcriptResult);

    const result = {
      ...call,
      summary,
      transcript,
    };

    $.export("$summary", `Retrieved call ${this.callId}`);
    return result;
  },
};
