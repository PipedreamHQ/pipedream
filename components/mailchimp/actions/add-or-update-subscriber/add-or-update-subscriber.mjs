// legacy_hash_id: a_RAiaJ1
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-add-or-update-subscriber",
  name: "Add or Update Subscriber",
  description: "Adds a new subscriber to an audience or updates existing subscriber.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    list_id: {
      type: "string",
      description: "The unique ID for the list.",
    },
    subscriber_hash: {
      type: "string",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
    skip_merge_validation: {
      type: "boolean",
      description: "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to False.",
      optional: true,
    },
    email_address: {
      type: "string",
      description: "Email address for a subscriber. This value is required only if the email address is not already present on the list.",
    },
    statu_if_new: {
      type: "string",
      description: "Subscriber's status. This value is required only if the email address is not already present on the list.",
      options: [
        "subscribed",
        "unsubscribed",
        "cleaned",
        "pending",
        "transactional",
      ],
    },
    email_type: {
      type: "string",
      description: "Type of email this member asked to get ('html' or 'text').",
      optional: true,
      options: [
        "html",
        "text",
      ],
    },
    status: {
      type: "string",
      description: "Subscriber's current status.",
      optional: true,
      options: [
        "subscribed",
        "unsubscribed",
        "cleaned",
        "pending",
        "transactional",
      ],
    },
    merge_fields: {
      type: "object",
      description: "An individual merge var and value for a member.",
      optional: true,
    },
    interests: {
      type: "object",
      description: "The key of this object's properties is the ID of the interest in question.",
      optional: true,
    },
    language: {
      type: "string",
      description: "If set/detected, the subscriber's language.",
      optional: true,
    },
    vip: {
      type: "boolean",
      description: "VIP status for subscriber.",
      optional: true,
    },
    latitude: {
      type: "integer",
      description: "The location latitude.",
      optional: true,
    },
    longitude: {
      type: "integer",
      description: "The location longitude.",
      optional: true,
    },
    marketing_permission_id: {
      type: "string",
      description: "The id for the marketing permission on the list.",
      optional: true,
    },
    marketing_permissions_enabled: {
      type: "boolean",
      description: "If the subscriber has opted-in to the marketing permission.",
      optional: true,
    },
    ip_signup: {
      type: "string",
      description: "IP address the subscriber signed up from.",
      optional: true,
    },
    timestamp_signup: {
      type: "string",
      description: "The date and time the subscriber signed up for the list in ISO 8601 format.",
      optional: true,
    },
    ip_opt: {
      type: "string",
      description: "The IP address the subscriber used to confirm their opt-in status.",
      optional: true,
    },
    timestamp_opt: {
      type: "string",
      description: "The date and time the subscriber confirmed their opt-in status in ISO 8601 format.",
      optional: true,
    },
  },
  async run({ $ }) {
    let listId = this.list_id;
    let subscriberHash = this.subscriber_hash;
    let skipMergeValidation = this.skip_merge_validation;

    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}?skip_merge_validation=${skipMergeValidation}`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
      method: "PUT",
      data: {
        "email_address": this.email_address,
        "status_if_new": this.statu_if_new,
        "email_type": this.email_type,
        "status": this.status,
        "merge_fields": this.merge_fields,
        "interests": this.interests,
        "language": this.language,
        "vip": this.vip,
        "location": {
          "latitude": this.latitude,
          "longitude": this.longitude,
        },
        "marketing_permissions": [
          {
            "marketing_permission_id": this.marketing_permission_id,
            "enabled": this.marketing_permissions_enabled,
          },
        ],
        "ip_signup": this.ip_signup,
        "timestamp_signup": this.timestamp_signup,
        "ip_opt": this.ip_opt,
        "timestamp_opt": this.timestamp_opt,
      },
    });
  },
};
