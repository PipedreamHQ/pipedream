import mementoDatabase from "../../memento_database.app.mjs";

export default {
  key: "memento_database-list-entries",
  name: "List Entries",
  description: "List entries in a library on Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/entries/list-entries-on-a-library)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mementoDatabase,
    libraryId: {
      propDefinition: [
        mementoDatabase,
        "libraryId",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "The comma-separated list of fields ids to include in the response. *all - include all fields.",
      default: "all",
    },
    startRevision: {
      type: "integer",
      label: "Start Revision",
      description: "Only entries updated/created at or after this revision are returned",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The token for continuing a previous list request on the next page",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The maximum number of entries to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mementoDatabase.listEntries({
      $,
      libraryId: this.libraryId,
      params: {
        fields: this.fields,
        startRevision: this.startRevision,
        pageSize: this.pageSize,
        pageToken: this.pageToken,
      },
    });
    $.export("$summary", `Successfully listed ${response.entries.length} entr${response.entries.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
