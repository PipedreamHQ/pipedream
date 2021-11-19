import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-stored-procedure",
  name: "Execute Stored Procedure",
  description: "Execute Stored Procedure. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-defining.html)",
  type: "action",
  version: "0.0.1",
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

    const result = await this.mysql.executeStoredProcedure({
      storedProcedure,
      values,
    });

    $.export("$summary", `Successfully executed stored procedure ${storedProcedure}`);

    return result;
  },
};
