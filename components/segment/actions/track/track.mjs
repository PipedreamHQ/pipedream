// legacy_hash_id: a_2wim5R
import { axios } from "@pipedream/platform";

export default {
  key: "segment-track",
  name: "Track actions your users perform",
  description: "Track lets you record the actions your users perform (note requires userId or anonymousId)",
  version: "0.3.1",
  type: "action",
  props: {
    segment: {
      type: "app",
      app: "segment",
    },
    anonymousId: {
      type: "string",
      description: "A pseudo-unique substitute for a User ID, for cases when you dont have an absolutely unique identifier. A userId or an anonymousId is required.",
      optional: true,
    },
    context: {
      type: "object",
      description: "Dictionary of extra information that provides useful context about a message, but is not directly related to the API call like ip address or locale",
      optional: true,
    },
    event: {
      type: "string",
      description: "Name of the action that a user has performed.",
    },
    integrations: {
      type: "object",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    properties: {
      type: "object",
      description: "Free-form dictionary of properties of the event, like revenue",
      optional: true,
    },
    timestamp: {
      type: "string",
      description: "ISO-8601 date string",
      optional: true,
    },
    userId: {
      type: "string",
      description: "Unique identifier for the user in your database. A userId or an anonymousId is required.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: "https://api.segment.io/v1/track",
      auth: {
        username: this.segment.$auth.write_key,
      },
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        event: this.event,
        integrations: this.integrations,
        properties: this.properties,
        timestamp: this.timestamp,
        userId: this.userId,
      },
    });
  },
};
