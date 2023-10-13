import newRow from "../../../mysql/sources/new-row/new-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...newRow,
  ...utils.getAppProps(newRow),
  key: "mysql_ssl-new-row",
  description: "Emit new event when you add a new row to a table (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
