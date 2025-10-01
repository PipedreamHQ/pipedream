import mastodon from "../../mastodon.app.mjs";
import { VISIBILITY_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "mastodon-post-status",
  name: "Post Status",
  description: "Publish a status with the given parameters. [See the documentation](https://docs.joinmastodon.org/methods/statuses/#create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mastodon,
    status: {
      type: "string",
      label: "Status",
      description: "The text content of the status.",
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
    shouldSplit: {
      type: "boolean",
      label: "Split to multiple messages",
      description: "If the status content is longer than 500 characters, it will be split, respecting words, and posted as a reply of of the first status.\n\nThis action will return the array of submitted posts.",
      optional: true,
      default: false,
    },
  },
  methods: {
    wordWrap: (str, maxLength) => {
      const words = str.split(" ");
      const chunks = [];
      let currentChunk = "";

      for (const word of words) {
        if (currentChunk.length + word.length < maxLength) {
          const prefix = currentChunk.length > 0 ?
            " " :
            "";
          currentChunk += prefix + word;
        } else {
          chunks.push(currentChunk);
          currentChunk = word;
        }
      }

      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }

      return chunks;
    },
  },
  async run({ $ }) {
    const { status } = this;
    let { inReplyToId } = this;
    let chunkedStatus = [
      status,
    ];
    if (this.shouldSplit && status.length > 500) {
      chunkedStatus = this.wordWrap(status, 500);
    }

    const results = [];
    for (const status of chunkedStatus) {
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
    $.export("$summary", `Successfully posted ${chunkedStatus.length} status(es)`);
    return this.shouldSplit ?
      results :
      results[0];
  },
};
