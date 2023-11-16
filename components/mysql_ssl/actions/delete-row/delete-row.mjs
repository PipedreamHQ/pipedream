import deleteRow from "../../../mysql/actions/delete-row/delete-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...deleteRow,
  ...utils.getAppProps(deleteRow),
  key: "mysql_ssl-delete-row",
  description: "Delete an existing row (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/delete.html)",
  version: "1.0.1",
};
