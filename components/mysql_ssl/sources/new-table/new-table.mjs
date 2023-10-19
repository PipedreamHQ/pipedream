import newTable from "../../../mysql/sources/new-table/new-table.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...newTable,
  ...utils.getAppProps(newTable),
  key: "mysql_ssl-new-table",
  description: "Emit new event when a new table is added to a database (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
