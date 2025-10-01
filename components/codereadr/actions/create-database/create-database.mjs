import app from "../../codereadr.app.mjs";

export default {
  key: "codereadr-create-database",
  name: "Create Database",
  description: "Creates a new database in CodeREADr. [See the documentation](https://secure.codereadr.com/apidocs/Databases.md#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    databaseName: {
      type: "string",
      label: "Database Name",
      description: "The name of the database to create",
    },
  },
  methods: {
    createDatabase({
      params, ...args
    } = {}) {
      return this.app.create({
        ...args,
        params: {
          ...params,
          section: "databases",
        },
      });
    },
  },
  async run({ $ }) {
    const {
      createDatabase,
      databaseName,
    } = this;

    const response = await createDatabase({
      $,
      params: {
        database_name: databaseName,
      },
    });
    $.export("$summary", `Successfully created database with ID \`${response.id}\``);
    return response;
  },
};
