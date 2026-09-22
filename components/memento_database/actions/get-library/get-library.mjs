import mementoDatabase from "../../memento_database.app.mjs";

export default {
  key: "memento_database-get-library",
  name: "Get Library",
  description: "Get a library by ID on Memento Database. [See the documentation](https://mementodatabase.docs.apiary.io/#reference/0/library/get-a-library)",
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
  },
  async run({ $ }) {
    const library = await this.mementoDatabase.getLibrary({
      $,
      libraryId: this.libraryId,
    });
    $.export("$summary", `Successfully retrieved library with ID: ${library.id}`);
    return library;
  },
};
