import mementoDatabase from "../../memento_database.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "memento_database-create-entry",
  name: "Create Entry",
  description: "Create an entry in a library on Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/entries/create-a-new-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    fields: {
      propDefinition: [
        mementoDatabase,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const entry = await this.mementoDatabase.createEntry({
      $,
      libraryId: this.libraryId,
      data: {
        fields: parseJson(this.fields),
      },
    });
    $.export("$summary", `Successfully created entry with ID: ${entry.id}`);
    return entry;
  },
};
