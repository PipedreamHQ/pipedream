import mailchimp from "../../mailchimp.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailchimp-add-or-update-subscriber",
  name: "Add or Update Subscriber",
  description: "Adds a new subscriber to an audience or updates existing subscriber. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/)",
  version: "0.2.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
    subscriberHash: {
      propDefinition: [
        mailchimp,
        "subscriberHash",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    emailAddress: {
      label: "Email address",
      type: "string",
      description: "Email address for a subscriber.",
    },
    skipMergeValidation: {
      label: "Skip merge validation",
      type: "boolean",
      description: "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to False.",
      optional: true,
    },
    statusIfNew: {
      label: "Status if new",
      type: "string",
      description: "Subscriber's status. This value is required only if the email address is not already present on the list.",
      options: constants.STATUS,
    },
    emailType: {
      label: "Email type",
      type: "string",
      description: "Type of email this member asked to get ('html' or 'text').",
      optional: true,
      options: constants.EMAIL_TYPES,
    },
    status: {
      label: "Status",
      type: "string",
      description: "Subscriber's current status.",
      optional: true,
      options: constants.STATUS,
    },
    mergeFields: {
      label: "Merge fields",
      type: "object",
      description: "An individual merge var and value for a member.",
      optional: true,
    },
    interests: {
      label: "Interests",
      type: "object",
      description: "The key of this object's properties is the ID of the interest in question.",
      optional: true,
    },
    language: {
      label: "Language",
      type: "string",
      description: "If set/detected, the subscriber's language.",
      optional: true,
    },
    vip: {
      label: "Vip",
      type: "boolean",
      description: "VIP status for subscriber.",
      optional: true,
    },
    latitude: {
      label: "Latitude",
      type: "string",
      description: "The location latitude.",
      optional: true,
    },
    longitude: {
      label: "Longitude",
      type: "string",
      description: "The location longitude.",
      optional: true,
    },
    marketingPermissionId: {
      label: "Marketing permission ID",
      type: "string",
      description: "The ID for the marketing permission on the list.",
      optional: true,
    },
    marketingPermissionsEnabled: {
      label: "Marketing permissions enabled",
      type: "boolean",
      description: "If the subscriber has opted-in to the marketing permission.",
      optional: true,
    },
    ipSignup: {
      label: "IP signup",
      type: "string",
      description: "IP address the subscriber signed up from.",
      optional: true,
    },
    timestampSignup: {
      label: "Timestamp signup",
      type: "string",
      description: "The date and time the subscriber signed up for the list in ISO 8601 format.",
      optional: true,
    },
    ipOpt: {
      label: "IP opt in",
      type: "string",
      description: "The IP address the subscriber used to confirm their opt-in status.",
      optional: true,
    },
    timestampOpt: {
      label: "Timestamp opt in",
      type: "string",
      description: "The date and time the subscriber confirmed their opt-in status in ISO 8601 format.",
      optional: true,
    },
  },
  async run({ $ }) {

    const payload = removeNullEntries({
      listId: this.listId,
      subscriberHash: this.subscriberHash,
      data: {
        email_address: this.emailAddress,
        status_if_new: this.statusIfNew,
        email_type: this.emailType,
        status: this.status,
        merge_fields: this.mergeFields,
        interests: this.interests,
        language: this.language,
        vip: this.vip,
        location: {
          latitude: this.latitude && Number(this.latitude),
          longitude: this.longitude && Number(this.longitude),
        },
        marketing_permissions: [
          {
            marketing_permission_id: this.marketingPermissionId,
            enabled: this.marketingPermissionsEnabled,
          },
        ],
        ip_signup: this.ipSignup,
        timestamp_signup: this.timestampSignup,
        ip_opt: this.ipOpt,
        timestamp_opt: this.timestampOpt,
      },
      params: {
        skip_merge_validation: this.skipMergeValidation,
      },
    });
    const response = await this.mailchimp.addOrUpdateListMember($, payload);
    response && $.export("$summary", "Successful");
    return response;
  },
};
