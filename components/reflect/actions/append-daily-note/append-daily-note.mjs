import reflect from "../../reflect.app.mjs";

export default {
  key: "reflect-append-daily-note",
  name: "Append Daily Note",
  description: "Append to a daily note. [See the documentation](https://openpm.ai/apis/reflect#/graphs/{graphId}/daily-notes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reflect,
    graphId: {
      propDefinition: [
        reflect,
        "graphId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text to append to the daily note",
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "Name of the list to append to",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date of the daily note. ISO 8601 format. Defaults to today.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.reflect.appendDailyNote({
      graphId: this.graphId,
      data: {
        text: this.text,
        transform_type: "list-append",
        list_name: this.listName,
        date: this.date,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully appended text to daily note.");
    }

    return response;
  },
};
