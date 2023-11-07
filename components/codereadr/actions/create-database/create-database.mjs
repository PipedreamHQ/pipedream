// Correct import statement for axios
import { axios } from "@pipedream/platform";
// Correct import statement for the app file
import codereadr from "../../codereadr.app.mjs";

export default {
  key: "codereadr-create-database",
  name: "Create Database",
  description: "Creates a new database in CodeREADr. [See the documentation](https://secure.codereadr.com/apidocs/databases.md)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    codereadr,
    name: {
      type: "string",
      label: "Database Name",
      description: "The name of the database to create",
    },
    // Optional description prop, as it's not required by the API
    description: {
      type: "string",
      label: "Database Description",
      description: "A description for the database",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      // Conditional spread for optional description
      ...(this.description
        ? {
          description: this.description,
        }
        : {}),
    };

    // Correct usage of the method from the app file
    const response = await this.codereadr.createDatabase(data);
    // Summary includes the name of the database which is more relevant than the ID
    $.export("$summary", `Successfully created database with name '${this.name}'`);
    return response;
  },
};
