import { ConfigurationError } from "@pipedream/platform";
import grain from "../../grain.app.mjs";

export default {
  key: "grain-update-recording",
  name: "Update Recording",
  description: "Renames a recording and/or adds and removes tags on it. All fields are optional — pass only what you want to change."
    + " Use **List Recordings** first to find the recording's ID."
    + " Example: to retitle a recording and tag it, pass `title` and `addTags: [\"qa-verified\"]` together."
    + " [See the documentation](https://developers.grain.com/#update-recording)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    grain,
    recordingId: {
      propDefinition: [
        grain,
        "recordingId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title for the recording. Leave blank to keep the current title.",
      optional: true,
    },
    addTags: {
      type: "string[]",
      label: "Add Tags",
      description: "Tags to add to the recording. Example: `[\"qa-verified\", \"customer-call\"]`.",
      optional: true,
    },
    removeTags: {
      type: "string[]",
      label: "Remove Tags",
      description: "Tags to remove from the recording.",
      optional: true,
    },
  },
  async run({ $ }) {
    const addTags = typeof this.addTags === "string"
      ? JSON.parse(this.addTags)
      : this.addTags;
    if (addTags !== undefined && !Array.isArray(addTags)) {
      throw new ConfigurationError("`addTags` must be an array of tag names.");
    }
    const removeTags = typeof this.removeTags === "string"
      ? JSON.parse(this.removeTags)
      : this.removeTags;
    if (removeTags !== undefined && !Array.isArray(removeTags)) {
      throw new ConfigurationError("`removeTags` must be an array of tag names.");
    }

    const actions = [];

    if (this.title) {
      await this.grain.updateRecordingTitle({
        $,
        recordingId: this.recordingId,
        data: {
          title: this.title,
        },
      });
      actions.push(`renamed to "${this.title}"`);
    }

    for (const tag of addTags ?? []) {
      await this.grain.addRecordingTag({
        $,
        recordingId: this.recordingId,
        data: {
          tag,
        },
      });
    }
    if (addTags?.length) {
      actions.push(`added tag(s) [${addTags.join(", ")}]`);
    }

    for (const tag of removeTags ?? []) {
      await this.grain.removeRecordingTag({
        $,
        recordingId: this.recordingId,
        tag,
      });
    }
    if (removeTags?.length) {
      actions.push(`removed tag(s) [${removeTags.join(", ")}]`);
    }

    const summary = actions.length
      ? `Updated recording ${this.recordingId}: ${actions.join("; ")}`
      : `No changes requested for recording ${this.recordingId}`;
    $.export("$summary", summary);
    return {
      recordingId: this.recordingId,
      actions,
    };
  },
};
