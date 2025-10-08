import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-add-content-to-page",
  name: "Add Content To Page",
  description: "Add content as a child block to an existing or new page in Roam Research (access to encrypted and non encrypted graphs). [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/eb8OVhaFC).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Page Title",
      description: "Title of the page to add content to.",
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    nestUnder: {
      propDefinition: [
        app,
        "nestUnder",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      title,
      content,
      nestUnder,
    } = this;

    const response = app.appendBlocks({
      $,
      data: {
        "location": {
          page: {
            title,
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

    $.export("$summary", "Successfully added content to page.");
    return response;
  },
};
