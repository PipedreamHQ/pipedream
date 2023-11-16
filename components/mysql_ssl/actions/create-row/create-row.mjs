import createRow from "../../../mysql/actions/create-row/create-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...createRow,
  ...utils.getAppProps(createRow),
  key: "mysql_ssl-create-row",
  description: "Adds a new row (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  version: "1.0.1",
};
