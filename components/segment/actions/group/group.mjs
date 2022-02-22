// legacy_hash_id: a_Mdi8dg
import { axios } from "@pipedream/platform";

export default {
  key: "segment-group",
  name: "Associate an identified user with a group",
  description: "Group lets you associate an identified user with a group (note requires userId or anonymousId)",
  version: "0.2.1",
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
    groupId: {
      type: "string",
      description: "A unique identifier for the group in your database.",
    },
    integrations: {
      type: "string",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    timestamp: {
      type: "string",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an ISO-8601 date string.",
      optional: true,
    },
    traits: {
      type: "object",
      description: "Free-form dictionary of traits of the group, like email or name",
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
      url: "https://api.segment.io/v1/group",
      auth: {
        username: this.segment.$auth.write_key,
      },
      data: {
        anonymousId: this.anonymousId,
        context: this.context,
        groupId: this.groupId,
        integrations: this.integrations,
        timestamp: this.timestamp,
        traits: this.traits,
        userId: this.userId,
      },
    });
  },
};
