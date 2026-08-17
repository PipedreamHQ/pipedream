// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-share-meeting",
  name: "Share Meeting",
  description: "Share a meeting with up to 50 people by email, optionally expiring their access after a number of days. Only the meeting owner or a team admin (on the owner's team) can share a meeting. Rate-limited to 10 requests per hour per user. Use **Revoke Meeting Access** to remove access later. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/share-meeting)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "The meeting to share. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID.",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Email addresses to share the meeting with (max 50). Example: `[\"jane@example.com\", \"john@example.com\"]`.",
    },
    expiryDays: {
      type: "integer",
      label: "Expiry Days",
      description: "Number of days after which shared access expires. Must be one of `7`, `14`, or `30`. Omit for access that doesn't expire.",
      optional: true,
      options: constants.SHARE_EXPIRY_DAYS_OPTIONS,
    },
  },
  async run({ $ }) {
    if (!this.emails?.length) {
      throw new ConfigurationError("At least one email is required.");
    }
    if (this.emails.length > constants.MAX_SHARE_EMAILS) {
      throw new ConfigurationError(`A maximum of ${constants.MAX_SHARE_EMAILS} emails can be shared at once.`);
    }

    const { data: { shareMeeting } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.shareMeeting,
        variables: {
          input: {
            meeting_id: this.meetingId,
            emails: this.emails,
            expiry_days: this.expiryDays,
          },
        },
      },
    });

    if (!shareMeeting.success) {
      throw new Error(`Failed to share meeting ${this.meetingId}: ${shareMeeting.message}`);
    }

    $.export("$summary", `Shared meeting ${this.meetingId} with ${this.emails.length} recipient(s)`);
    return shareMeeting;
  },
};
