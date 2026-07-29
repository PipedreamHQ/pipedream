// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-list-calls",
  name: "List Calls",
  description: `List recorded calls in a date range and return an array of call metadata objects. This is the cheap way to discover call IDs before acting on them. It does NOT return summaries, topics, trackers, participants, or CRM data - use **Search Calls** for those, and **Get Call Transcripts** for the spoken content. [See the documentation](${constants.DOCS_URL}#get-/v2/calls)`,
  type: "action",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    fromDateTime: {
      propDefinition: [
        app,
        "fromDateTime",
      ],
      description: "Only return calls that started on or after this date and time, in ISO-8601 format (e.g. `2026-01-01T00:00:00Z` or `2026-01-01T02:30:00-07:00`). Omit to start from the earliest call.",
      optional: true,
    },
    toDateTime: {
      propDefinition: [
        app,
        "toDateTime",
      ],
      description: "Only return calls that started before this date and time, in ISO-8601 format (e.g. `2026-04-01T00:00:00Z`). The bound is exclusive. Omit to end at the most recent call.",
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      description: "Return only calls belonging to this workspace. Omit to search every workspace. Use the **List Workspace ID Options** action to discover workspace IDs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of calls to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
      min: constants.MIN_LIMIT,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      app,
      fromDateTime,
      toDateTime,
      workspaceId,
      limit,
    } = this;

    const params = {
      fromDateTime,
      toDateTime,
      workspaceId,
    };

    const calls = await app.paginate({
      resourceFn: (args) => app.listCalls(args),
      resourceFnArgs: {
        step,
        params,
      },
      resourceName: "calls",
      max: limit,
    });

    step.export("$summary", `Found ${utils.pluralize(calls.length, "call")}`);

    return calls;
  },
};
