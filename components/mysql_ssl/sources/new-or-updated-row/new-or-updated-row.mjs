import newOrUpdatedRow from "../../../mysql/sources/new-or-updated-row/new-or-updated-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...newOrUpdatedRow,
  ...utils.getAppProps(newOrUpdatedRow),
  key: "mysql_ssl-new-or-updated-row",
  description: "Emit new event when you add or modify a new row in a table (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
