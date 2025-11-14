import mastodon from "../../mastodon.app.mjs";
import { VISIBILITY_OPTIONS } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "mastodon-post-multiple-statuses",
  name: "Post Multiple Statuses",
  description: "Publish multiple statuses with the given parameters, the subsequent statuses will be posted as a reply of of the first status. [See the documentation](https://docs.joinmastodon.org/methods/statuses/#create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mastodon,
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Array of statuses to be published in sequence; each status must be fewer than 500 characters long.",
    },
    inReplyToId: {
      type: "string",
      label: "In Reply To ID",
      description: "ID of the status being replied to, if the status is a reply.",
      optional: true,
    },
    sensitive: {
      type: "boolean",
      label: "Sensitive",
      description: "Mark the status and attached media as sensitive. The default is false.",
      optional: true,
      default: false,
    },
    spoilerText: {
      type: "string",
      label: "Spoiler Text",
      description: "Text to be shown as a warning or subject before the actual content. Statuses are generally collapsed behind this field.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Set the visibility of the posted status to `public`, `unlisted`, `private`, or `direct`.",
      options: VISIBILITY_OPTIONS,
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "ISO 8601 DateTime at which to schedule a status. Must be at least 5 minutes in the future.",
      optional: true,
    },
  },
  methods: {
    validateStatuses(statuses) {
      for (const status of statuses) {
        if (status.length > 500) {
          throw new ConfigurationError("Each status must be fewer than 500 characters long.");
        }
      }
    },
  },
  async run({ $ }) {
    const { statuses } = this;
    let { inReplyToId } = this;
    this.validateStatuses(statuses);

    const results = [];
    for (const status of statuses) {
      const data = {
        status,
        in_reply_to_id: inReplyToId,
        sensitive: this.sensitive,
        spoiler_text: this.spoilerText,
        visibility: this.visibility,
        scheduled_at: this.scheduledAt,
      };
      results.push(
        await this.mastodon.postStatus({
          $,
          data,
        }),
      );
      if (!inReplyToId) {
        inReplyToId = results[0].id;
      }
    }
    $.export("$summary", `Successfully posted ${statuses.length} statuses.`);
    return results;
  },
};
