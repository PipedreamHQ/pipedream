import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-stored-procedure",
  name: "Execute Stored Procedure",
  description: "Execute Stored Procedure. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-defining.html)",
  type: "action",
  version: "0.0.4",
  props: {
    mysql,
    rejectUnauthorized: {
      propDefinition: [
        mysql,
        "rejectUnauthorized",
      ],
    },
    storedProcedure: {
      propDefinition: [
        mysql,
        "storedProcedure",
        (c) => ({
          rejectUnauthorized: c.rejectUnauthorized ?? false,
        }),
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
      rejectUnauthorized,
    } = this;

    const result = await this.mysql.executeStoredProcedure({
      storedProcedure,
      values,
      rejectUnauthorized,
    });

    $.export("$summary", `Successfully executed stored procedure ${storedProcedure}`);

    return result;
  },
};
