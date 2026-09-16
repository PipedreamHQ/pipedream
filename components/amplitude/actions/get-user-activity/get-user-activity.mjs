import app from "../../amplitude.app.mjs";
import {
  USER_ACTIVITY_DIRECTIONS,
  LIMIT_MIN,
  LIMIT_MAX,
  USER_ACTIVITY_MAX_RESULTS,
  USER_ACTIVITY_ALWAYS_FIELDS,
} from "../../common/constants.mjs";
import { pluck } from "../../common/utils.mjs";

export default {
  key: "amplitude-get-user-activity",
  name: "Get User Activity",
  description: `Fetch the event stream for a single user by their numeric Amplitude ID from the Amplitude Dashboard REST API. Each returned event defaults to just ${USER_ACTIVITY_ALWAYS_FIELDS.join(" and ")}; pass \`fields\` to also get e.g. \`event_properties\`, \`user_properties\`, \`uuid\`, \`session_id\`, \`amplitude_id\`, \`device_id\` (event objects can carry many properties, so these stay opt-in). Amplitude's API caps each request at ${LIMIT_MAX} events with no cursor; this tool pages \`offset\` forward automatically to collect up to \`limit\` events (set it above ${LIMIT_MAX}, up to ${USER_ACTIVITY_MAX_RESULTS}, to fetch more than one page). Use **Search Users** first to resolve the Amplitude ID. Example: call with \`user=12345678\`, \`limit=50\` -> returns \`{events: [{event_type: "Purchase", event_time: "2024-08-05 14:22:10"}, ...], userData: {...}, truncated: false}\` (\`truncated: true\` means more events likely exist beyond what was returned — raise \`limit\`/\`offset\` to fetch further). [See the documentation](https://amplitude.com/docs/apis/analytics/dashboard-rest#user-activity).`,
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    user: {
      type: "integer",
      label: "User",
      description: "The numeric Amplitude ID of the user (the `user` param). Example: `12345678`. Use **Search Users** to resolve this from an email or User ID.",
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Zero-indexed starting offset into the event stream (the `offset` param). Min 0. Amplitude documents no upper bound — raise this to page further back into an already-fetched user's history.",
      min: 0,
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Chronological direction (the `direction` param). One of `earliest`, `latest`. Defaults to `latest`.",
      options: USER_ACTIVITY_DIRECTIONS,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: `Maximum number of events to return in total (the \`limit\` param, requested in pages of up to ${LIMIT_MAX}). Min ${LIMIT_MIN}, max ${USER_ACTIVITY_MAX_RESULTS}. Defaults to ${LIMIT_MAX}. Set above ${LIMIT_MAX} to fetch more than one page; check the response's \`truncated\` flag to see if more events exist beyond what was returned.`,
      max: USER_ACTIVITY_MAX_RESULTS,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: `Field names to return for each event (${USER_ACTIVITY_ALWAYS_FIELDS.join(" and ")} are always included). Also available: \`event_properties\`, \`user_properties\`, \`uuid\`, \`session_id\`, \`amplitude_id\`, \`device_id\`. Pass only what you need to keep responses small.`,
    },
  },
  async run({ $ }) {
    const response = await this.app.getUserActivity({
      $,
      params: {
        user: this.user,
        offset: this.offset,
        direction: this.direction,
        limit: this.limit,
      },
    });
    const events = (response.events ?? []).map((event) =>
      pluck(event, this.fields ?? [], USER_ACTIVITY_ALWAYS_FIELDS));
    $.export("$summary", `Retrieved ${events.length} event(s) for user ${this.user}${response.truncated
      ? " (more may exist — raise `limit` or `offset` to fetch further)"
      : ""}`);
    return {
      ...response,
      events,
    };
  },
};
