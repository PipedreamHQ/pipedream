import mementoDatabase from "../../memento_database.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "memento_database-update-entry",
  name: "Update Entry",
  description: "Update an entry in a library on Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/entry/edit-an-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mementoDatabase,
    libraryId: {
      propDefinition: [
        mementoDatabase,
        "libraryId",
      ],
    },
    entryId: {
      propDefinition: [
        mementoDatabase,
        "entryId",
        (c) => ({
          libraryId: c.libraryId,
        }),
      ],
    },
    fields: {
      propDefinition: [
        mementoDatabase,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const entry = await this.mementoDatabase.updateEntry({
      $,
      libraryId: this.libraryId,
      entryId: this.entryId,
      data: {
        fields: parseJson(this.fields),
      },
    });
    $.export("$summary", `Successfully updated entry with ID: ${entry.id}`);
    return entry;
  },
};
