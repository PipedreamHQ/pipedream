import { ConfigurationError } from "@pipedream/platform";
import app from "../../zoho_people.app.mjs";

export default {
  type: "action",
  key: "zoho_people-create_attendance_entry",
  name: "Create Attendance Entry",
  version: "0.0.1",
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
      type: "string",
      label: "Employee ID",
      description: "The employee ID of the employee",
      optional: true,
    },
    emailId: {
      type: "string",
      label: "Email ID",
      description: "The email ID of the employee",
      optional: true,
    },
    mapId: {
      type: "string",
      label: "Map ID",
      description: "The mapper ID of the employee",
      optional: true,
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
    const res = await app.createAttendance(data);
    $.export("summary", "Attendance entry successfully created");
    return res;
  },
};
