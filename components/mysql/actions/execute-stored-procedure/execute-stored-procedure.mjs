import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-stored-procedure",
  name: "Execute Stored Procedure",
  description: "Execute Stored Procedure. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-defining.html)",
  type: "action",
  version: "2.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mysql,
    storedProcedure: {
      propDefinition: [
        mysql,
        "storedProcedure",
      ],
    },
    values: {
      propDefinition: [
        mysql,
        "storedProcedureParameters",
      ],
    },
  },
  async run({ $ }) {
    const {
      storedProcedure,
      values,
    } = this;

    const response = await this.mysql.executeStoredProcedure({
      storedProcedure,
      values,
    });

    $.export("$summary", `Successfully executed stored procedure ${storedProcedure}`);

    const result =
      Array.isArray(response)
        ? response[0]
        : response;

    return result || {
      success: false,
    };
  },
};
