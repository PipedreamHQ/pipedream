import { MAX_CANCELLATION_REASON_LENGTH } from "../../common/constants.mjs";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-cancel-event",
  name: "Cancel Event",
  description: "Cancel a scheduled Calendly event. Posts to `POST /scheduled_events/{uuid}/cancellation`. Run **List Events** first to obtain the event UUID. Example: with `eventUuid` set to `a1b2c3d4-e5f6-7890-abcd-ef1234567890` and `reason` set to `Schedule conflict - rescheduling needed`, the event is canceled and all invitees are notified. [See the documentation](https://developer.calendly.com/api-docs/afb2e9fe3a0a0-cancel-event).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    calendly,
    eventUuid: {
      type: "string",
      label: "Event UUID",
      description: "The UUID of the scheduled event to cancel (the `{uuid}` path segment, e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`). Run **List Events** first to obtain event UUIDs. Do not pass the full URI; only the UUID.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: `Optional reason for the cancellation (max ${MAX_CANCELLATION_REASON_LENGTH} characters), e.g. \`Schedule conflict - rescheduling needed\`. Sent as the \`reason\` field in the request body.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.calendly.cancelEvent(
      this.eventUuid,
      {
        reason: this.reason,
      },
      $,
    );
    $.export("$summary", `Canceled event ${this.eventUuid}`);
    return response;
  },
};
