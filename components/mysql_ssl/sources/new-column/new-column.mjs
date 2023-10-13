import newColumn from "../../../mysql/sources/new-column/new-column.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...newColumn,
  ...utils.getAppProps(newColumn),
  key: "mysql_ssl-new-column",
  description: "Emit new event when you add a new column to a table (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/show-columns.html)",
  version: "1.0.1",
};
