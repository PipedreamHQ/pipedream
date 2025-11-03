import app from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-insert-comment",
  name: "Insert Comment",
  description: "Insert a comment into a spreadsheet. [See the documentation](https://developers.google.com/drive/api/v3/reference/comments/create)",
  version: "0.1.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
    },
    fileId: {
      propDefinition: [
        app,
        "sheetID",
        (c) => ({
          driveId: app.methods.getDriveId(c.drive),
        }),
      ],
    },
    content: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the spreadsheet.",
    },
  },
  methods: {
    createComment(params = {}) {
      return this.app.drive().comments.create(params);
    },
  },
  async run({ $: step }) {
    const {
      fileId,
      content,
    } = this;

    const response = await this.createComment({
      fileId,
      fields: "*",
      requestBody: {
        content,
      },
    });

    step.export("$summary", "Successfully added comment to spreadsheet");

    return response;
  },
};
