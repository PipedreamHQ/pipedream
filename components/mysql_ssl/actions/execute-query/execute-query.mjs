import executeQuery from "../../../mysql/actions/execute-query/execute-query.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...executeQuery,
  ...utils.getAppProps(executeQuery),
  key: "mysql_ssl-execute-query",
  description: "Find row(s) via a custom query (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
