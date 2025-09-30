import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-add-content-to-daily-note-page",
  name: "Add Content To Daily Note Page",
  description: "Adds content as a child block to a daily note page in Roam Research (access to encrypted and non encrypted graphs). [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/eb8OVhaFC).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    dailyNoteTitle: {
      type: "string",
      label: "Date For Daily Note",
      description: "The date for the daily note page title, formatted as `MM-DD-YYYY`. Keep in mind the Daily Note page should exist.",
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
      dailyNoteTitle,
      content,
      nestUnder,
    } = this;

    const response = app.appendBlocks({
      $,
      data: {
        "location": {
          page: {
            title: {
              "daily-note-page": dailyNoteTitle,
            },
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

    $.export("$summary", "Successfully added content to daily note page.");
    return response;
  },
};
