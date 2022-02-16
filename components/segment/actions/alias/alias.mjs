// legacy_hash_id: a_EViozl
import { axios } from "@pipedream/platform";

export default {
  key: "segment-alias",
  name: "Associate one identity with another",
  description: "Alias is how you associate one identity with another.",
  version: "0.1.1",
  type: "action",
  props: {
    segment: {
      type: "app",
      app: "segment",
    },
    context: {
      type: "object",
      description: "Dictionary of extra information that provides useful context about a message, but is not directly related to the API call like ip address or locale",
      optional: true,
    },
    integrations: {
      type: "object",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    previousId: {
      type: "string",
      description: "Previous unique identifier for the user",
    },
    timestamp: {
      type: "string",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an ISO-8601 date string.",
      optional: true,
    },
    userId: {
      type: "string",
      description: "Unique identifier for the user in your database., A userId or an anonymousId is required.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api.segment.io/v1/alias",
      auth: {
        username: this.segment.$auth.write_key,
      },
      data: {
        context: this.context,
        integrations: this.integrations,
        previousId: this.previousId,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
