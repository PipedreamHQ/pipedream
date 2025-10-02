import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoho_people.app.mjs";
import { convertEmptyToNull } from "../common/add-update-record-common.mjs";

export default {
  type: "action",
  key: "zoho_people-create-attendance-entry",
  name: "Create Attendance Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "This API can be used to capture the check-in and check-out entries of an individual employee.The system will mark the attendance exit/entry of individual employees.It will automatically update the attendance status in the web portal for every check-in and check-out. [See the documentation](https://www.zoho.com/people/api/attendance-checkin-checkout.html)",
  props: {
    app,
    checkIn: {
      type: "string",
      label: "Check In",
      description: "The check in time of the employee. The format should be `dd/MM/yyyy HH:mm:ss`",
    },
    checkOut: {
      type: "string",
      label: "Check Out",
      description: "The check out time of the employee. The format should be `dd/MM/yyyy HH:mm:ss`",
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
    const res = await app.createAttendance(convertEmptyToNull(data));
    if (res[0]?.response === "failure") {
      throw new Error(`Zoho People error response: ${res[0].msg}`);
    }
    $.export("summary", "Attendance entry successfully created");
    return res;
  },
};
