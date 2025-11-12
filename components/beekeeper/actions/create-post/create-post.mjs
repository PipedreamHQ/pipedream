import beekeeper from "../../beekeeper.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "beekeeper-create-post",
  name: "Create Post",
  description: "Create a new text or multimedia post in a defined stream. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/18408b41927b9-creates-a-new-post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    beekeeper,
    streamId: {
      propDefinition: [
        beekeeper,
        "streamId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the post",
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "List of file objects to be attached. E.g. [{\"name\": \"fair_play_rules.pdf\", \"url\": \"https://mytenant.beekeeper.io/file/665987/original/fair_play_rules.pdf\", \"userid\": \"5cb9v45d-8i78-4v65-b5fd-81cgfac3ef17\", \"height\": 619, \"width\": 700, \"key\": \"f4fdaab0-d198-49b4-b1cc-dd85572d72f1\", \"media_type\": \"image/png\", \"usage_type\": \"attachment_image\" }]. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/18408b41927b9-creates-a-new-post) for further details.",
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
      type: "string[]",
      label: "Media",
      description: "List of Photo or Video objects. E.g. [{\"name\": \"fair_play_rules.pdf\", \"url\": \"https://mytenant.beekeeper.io/file/665987/original/fair_play_rules.pdf\", \"userid\": \"5cb9v45d-8i78-4v65-b5fd-81cgfac3ef17\", \"height\": 619, \"width\": 700, \"key\": \"f4fdaab0-d198-49b4-b1cc-dd85572d72f1\", \"media_type\": \"image/png\", \"usage_type\": \"attachment_image\" }]. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/18408b41927b9-creates-a-new-post) for further details.",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "List of labels attached to the post",
      optional: true,
    },
    sticky: {
      type: "boolean",
      label: "Sticky",
      description: "Flag that pins a post to the top of the stream",
      optional: true,
    },
    reactionsDisabled: {
      type: "boolean",
      label: "Reactions Disabled",
      description: "Flag that disables the ability to add reaction to the post and to see reactions that have been added",
      optional: true,
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "List of poll options in a post. E.g. [\"This Friday\", \"Monday next week\"]",
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "Date and time when the post is scheduled to be published (UTC timezone, yyyy-mm-ddTHH:MM:SS format)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.beekeeper.createPost({
      $,
      data: {
        streamid: this.streamId,
        files: parseObject(this.files),
        locked: this.locked,
        title: this.title,
        media: parseObject(this.media),
        labels: parseObject(this.labels),
        sticky: this.sticky,
        reactions_disabled: this.reactionsDisabled,
        text: this.text,
        options: parseObject(this.options)?.map((item) => ({
          text: item,
        })),
        scheduled_at: this.scheduledAt,
      },
    });

    $.export("$summary", `Successfully created post with UUID: ${response.uuid}`);
    return response;
  },
};
