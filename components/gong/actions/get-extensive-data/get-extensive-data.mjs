// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-get-extensive-data",
  name: "Search Calls",
  description: "Search calls and return their metadata together with whichever detail sections you ask for: the AI call brief (summary), key points, "
  + "outline (which contains the next steps), highlights, call outcome, topics, keyword tracker hits, participants, interaction stats, and linked CRM "
  + "records such as the account and deal. This is the tool for questions like \"what happened on last quarter's calls\", \"what were the next steps\", or "
  + "\"which deals do these calls belong to\". Brief, key points, outline, highlights, and call outcome come from Gong's Spotlight AI. "
  + "They are silently omitted for calls Gong has not generated them for (very short calls, calls without a transcript, or "
  + `workspaces without the feature). [See the documentation](${constants.DOCS_URL}#post-/v2/calls/extensive)`,
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    fromDateTime: {
      propDefinition: [
        app,
        "fromDateTime",
      ],
      description: "Only return calls that started on or after this date and time, in ISO-8601 format (e.g. `2026-01-01T00:00:00Z`). Omit to start from the earliest call.",
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
      description: "Return only calls belonging to this workspace. Cannot be combined with **Call IDs**. Use the **List Workspace ID Options** action to discover workspace IDs.",
      optional: true,
    },
    callIds: {
      propDefinition: [
        app,
        "callIds",
      ],
      description: "Return only these calls. Pass a single ID to fetch one call. Cannot be combined with **Workspace ID**. Use **List Calls** to discover call IDs.",
      optional: true,
    },
    primaryUserIds: {
      type: "string[]",
      label: "Primary User IDs",
      description: "Return only calls hosted by these Gong users, matched against each call's `primaryUserId`. This is how you find a given rep's calls. "
      + "Use the **List Users** action to discover user IDs.",
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    content: {
      type: "string[]",
      label: "Content",
      description: "Which call-content sections to return. Defaults to the insight fields (brief, key points, outline, highlights, call outcome, topics). "
      + "Select **Tracker Occurrences** only together with **Trackers**.",
      options: constants.CONTENT_FIELDS,
      default: [
        "brief",
        "keyPoints",
        "outline",
        "highlights",
        "callOutcome",
        "topics",
      ],
      optional: true,
    },
    interaction: {
      type: "string[]",
      label: "Interaction Stats",
      description: "Which interaction statistics to return, such as per-speaker talk time and talk ratio. Omit for none.",
      options: constants.INTERACTION_FIELDS,
      optional: true,
    },
    includeParties: {
      type: "boolean",
      label: "Include Parties",
      description: "Whether to return the call's participants (name, email, affiliation as "
      + "`Internal` or `External`, `speakerId`, and any linked CRM contact). Needed to attribute transcript speakers to people.",
      default: true,
      optional: true,
    },
    context: {
      type: "string",
      label: "CRM Context",
      description: "How much external-system (CRM, telephony, case management) data to attach to each call and party. Set to `Extended` to get account and deal field values.",
      options: constants.CONTEXT_OPTIONS,
      default: "None",
      optional: true,
    },
    contextTiming: {
      type: "string[]",
      label: "Context Timing",
      description: "Whether CRM values should reflect their state now, at the time of the call, or both. Only valid when **CRM Context** is `Extended`. Defaults to `Now`.",
      options: constants.CONTEXT_TIMING_OPTIONS,
      optional: true,
    },
    includePublicComments: {
      type: "boolean",
      label: "Include Public Comments",
      description: "Whether to return public comments left on the call in Gong.",
      default: false,
      optional: true,
    },
    includeMedia: {
      type: "boolean",
      label: "Include Media URLs",
      description: "Whether to return audio and video download URLs. Requires the `api:calls:read:media-url` scope; the URLs are short-lived.",
      default: false,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: `Maximum number of calls to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
    },
  },
  async run({ $: step }) {
    const {
      app,
      fromDateTime,
      toDateTime,
      workspaceId,
      callIds,
      primaryUserIds,
      content,
      interaction,
      includeParties,
      context,
      contextTiming,
      includePublicComments,
      includeMedia,
      limit,
    } = this;

    if (workspaceId && callIds?.length) {
      throw new ConfigurationError("Must not provide both `Call IDs` and `Workspace ID`");
    }

    const contentFields = utils.parseArray(content);

    if (contentFields.includes(constants.TRACKER_OCCURRENCES_FIELD)
      && !contentFields.includes(constants.TRACKERS_FIELD)) {
      throw new ConfigurationError("`Tracker Occurrences` can only be selected together with `Trackers`");
    }

    const contextTimingValues = utils.parseArray(contextTiming);

    if (contextTimingValues.length && context !== constants.EXTENDED_CONTEXT) {
      throw new ConfigurationError("`Context Timing` can only be provided when `CRM Context` is `Extended`");
    }

    // Built explicitly rather than by spreading the rest of `this`, so that no
    // component method can leak into the request body.
    const filter = {
      fromDateTime,
      toDateTime,
      workspaceId,
      callIds,
      primaryUserIds,
    };

    const contentSelector = {
      context,
      ...(contextTimingValues.length && {
        contextTiming: contextTimingValues,
      }),
      exposedFields: {
        parties: includeParties,
        content: utils.toExposedFields(constants.CONTENT_FIELDS, contentFields),
        interaction: utils.toExposedFields(
          constants.INTERACTION_FIELDS,
          utils.parseArray(interaction),
        ),
        collaboration: {
          publicComments: includePublicComments,
        },
        media: includeMedia,
      },
    };

    const calls = await app.paginate({
      resourceFn: (args) => app.listCallsExtensive(args),
      resourceFnArgs: {
        step,
        data: {
          filter,
          contentSelector,
        },
      },
      resourceName: "calls",
      max: limit,
      cursorIn: "data",
    });

    step.export("$summary", `Found ${utils.pluralize(calls.length, "call")}`);

    return calls;
  },
};
