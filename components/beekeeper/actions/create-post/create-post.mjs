import beekeeper from "../../beekeeper.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "beekeeper-create-post",
  name: "Create Post",
  description: "Create a new text or multimedia post in a defined stream. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/18408b41927b9-creates-a-new-post)",
  version: "0.0.1",
  type: "action",
  props: {
    beekeeper,
    streamId: {
      propDefinition: [
        beekeeper,
        "streamId",
      ],
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "Array of files to be attached to the post",
      optional: true,
    },
    locked: {
      type: "boolean",
      label: "Locked",
      description: "Disables adding comments on the post",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
      optional: true,
    },
    media: {
      type: "string",
      label: "Media",
      description: "Media attachment for the post",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Array of labels for the post",
      optional: true,
    },
    sticky: {
      type: "boolean",
      label: "Sticky",
      description: "Make the post sticky",
      optional: true,
    },
    photos: {
      type: "string[]",
      label: "Photos",
      description: "Array of photos to be attached to the post",
      optional: true,
    },
    reactionsDisabled: {
      type: "boolean",
      label: "Reactions Disabled",
      description: "Disable reactions for the post",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the post",
      optional: true,
    },
    options: {
      type: "object",
      label: "Options",
      description: "Additional options for the post",
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "The scheduled time for the post in the format (UTC, yyyy-mm-ddTHH:MM:SS)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.beekeeper.createPost({
      streamId: this.streamId,
      files: this.files,
      locked: this.locked,
      title: this.title,
      media: this.media,
      labels: this.labels,
      sticky: this.sticky,
      photos: this.photos,
      reactionsDisabled: this.reactionsDisabled,
      text: this.text,
      options: this.options,
      scheduledAt: this.scheduledAt,
    });

    $.export("$summary", `Successfully created post with title: ${this.title || "Untitled"}`);
    return response;
  },
};
