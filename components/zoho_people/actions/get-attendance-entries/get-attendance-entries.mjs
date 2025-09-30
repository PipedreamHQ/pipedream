import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoho_people.app.mjs";
import { convertEmptyToNull } from "../common/add-update-record-common.mjs";

export default {
  type: "action",
  key: "zoho_people-get-attendance-entries",
  name: "Get Attendance Entries",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "This API is used to fetch the shift configuration details of an employee. All the details of the shift, that has been configured to the employee, in the given duration can be fetched using this API. Details include shifts mapped to the employee, start and end time of the shift and holiday, Weekend set for the shift. [See the documentation](https://www.zoho.com/people/api/attendance-shift-details.html)",
  props: {
    app,
    sdate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the attendance entry. The format should be `yyyy-MM-dd`",
    },
    edate: {
      type: "string",
      label: "End Date",
      description: "The end date of the attendance entry. The format should be `yyyy-MM-dd`",
    },
    empId: {
      propDefinition: [
        app,
        "empId",
      ],
    },
    emailId: {
      propDefinition: [
        app,
        "emailId",
      ],
    },
    mapId: {
      propDefinition: [
        app,
        "mapId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;

    if (!data.empId && !data.emailId && !data.mapId) {
      throw new ConfigurationError("One of the following fields is required: Employee ID, Email ID, Map ID");
    }
    const res = await app.getShiftConfiguration(convertEmptyToNull(data));
    if (res.error) {
      throw new Error(`Zoho People error response: ${res.error}`);
    }
    $.export("summary", "Attendance entry successfully fetched");
    return res;
  },
};
