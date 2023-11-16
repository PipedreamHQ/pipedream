import executeStoredProcedure from "../../../mysql/actions/execute-stored-procedure/execute-stored-procedure.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...executeStoredProcedure,
  ...utils.getAppProps(executeStoredProcedure),
  key: "mysql_ssl-execute-stored-procedure",
  description: "Execute Stored Procedure (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-defining.html)",
  version: "1.0.1",
};
