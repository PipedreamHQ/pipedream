import component from "@pipedream/procore/actions/create-timesheet/create-timesheet.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  ...utils.getAppProps(component),
  key: "procore_sandbox-create-timesheet",
  description: "Create a new timesheet. [See the documentation](https://developers.procore.com/reference/rest/timesheets?version=latest#create-timesheet).",
  version: "0.0.2",
};
