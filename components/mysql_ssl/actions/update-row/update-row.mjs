import updateRow from "../../../mysql/actions/update-row/update-row.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...updateRow,
  ...utils.getAppProps(updateRow),
  key: "mysql_ssl-update-row",
  description: "Updates an existing row (SSL). [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/update.html)",
  version: "1.0.1",
};
