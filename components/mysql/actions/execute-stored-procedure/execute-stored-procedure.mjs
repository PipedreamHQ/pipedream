import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-stored-procedure",
  name: "Execute Stored Procedure",
  description: "Execute Stored Procedure. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-defining.html)",
  type: "action",
  version: "0.0.1",
  methods: {
    async executeStoredProcedure({
      storedProcedure, params = [],
    }) {
      const sql = `CALL ${storedProcedure}(${params.join(",")});`;
      const [
        result,
      ] = await this.mysql.executeQueryConnectionHandler(sql);
      return result;
    },
  },
  props: {
    mysql,
    storedProcedure: {
      propDefinition: [
        mysql,
        "storedProcedure",
      ],
    },
    params: {
      propDefinition: [
        mysql,
        "storedProcedureParameters",
      ],
    },
  },
  async run() {
    return await this.executeStoredProcedure({
      storedProcedure: this.storedProcedure,
      params: this.params,
    });
  },
};
