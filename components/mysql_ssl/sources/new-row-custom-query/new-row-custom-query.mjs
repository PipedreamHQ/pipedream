import newRowCustomQuery from "../../../mysql/sources/new-row-custom-query/new-row-custom-query.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...newRowCustomQuery,
  ...utils.getAppProps(newRowCustomQuery),
  key: "mysql_ssl-new-row-custom-query",
  description: "Emit new event when new rows are returned from a custom query (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
