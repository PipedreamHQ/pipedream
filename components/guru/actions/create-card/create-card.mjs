import { SHARE_STATUS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import guru from "../../guru.app.mjs";

export default {
  key: "guru-create-card",
  name: "Create Card",
  description: "Creates a new card on your Guru account. [See the documentation](https://developer.getguru.com/reference/postv1cardscreateextendedfact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    guru,
    title: {
      type: "string",
      label: "Card Title",
      description: "The title of the card to create",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the card to create",
    },
    shareStatus: {
      type: "string",
      label: "Share Status",
      description: "The share status of the card.",
      options: SHARE_STATUS_OPTIONS,
      optional: true,
    },
    collection: {
      propDefinition: [
        guru,
        "collection",
      ],
    },
    folderIds: {
      propDefinition: [
        guru,
        "folderIds",
      ],
    },
    tags: {
      propDefinition: [
        guru,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.guru.createCard({
      $,
      data: {
        preferredPhrase: this.title,
        content: this.content,
        shareStatus: this.shareStatus,
        collection: {
          id: this.collection,
        },
        folderIds: parseObject(this.folderIds),
        tags: parseObject(this.tags)?.map((item) => ({
          id: item,
        })),
      },
    });

    $.export("$summary", `Created card "${this.title}" successfully`);
    return response;
  },
};
