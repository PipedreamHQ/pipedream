import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-add-content-underneath-block",
  name: "Add Content Underneath Block",
  description: "Add content underneath an existing block in your Roam Research graph (access to encrypted and non encrypted graphs). [See the documentation](https://roamresearch.com/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    blockUid: {
      type: "string",
      label: "Block UID",
      description: "The block UID in the Roam graph you want to append content to.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the block to be added.",
    },
    nestUnder: {
      type: "string",
      label: "Nest Under",
      description: "Title of the block to nest the new block under.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      blockUid,
      content,
      nestUnder,
    } = this;

    const response = app.appendBlocks({
      $,
      data: {
        "location": {
          block: {
            uid: blockUid,
          },
          ...(nestUnder && {
            "nest-under": {
              string: nestUnder,
            },
          }),
        },
        "append-data": [
          {
            string: content,
          },
        ],
      },
    });

    $.export("$summary", "Successfully added content underneath block.");
    return response;
  },
};
