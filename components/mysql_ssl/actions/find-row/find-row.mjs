import findRow from "../../../mysql/actions/find-row/find-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...findRow,
  ...utils.getAppProps(findRow),
  key: "mysql_ssl-find-row",
  description: "Finds a row in a table via a lookup column (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "1.0.1",
};
