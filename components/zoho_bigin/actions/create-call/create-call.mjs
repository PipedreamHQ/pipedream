import app from "../../zoho_bigin.app.mjs";
import constants from "../common/constansts.mjs";

export default {
  name: "Create Call",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_bigin-create-call",
  description: "Creates a call. [See the documentation](https://www.bigin.com/developer/docs/apis/insert-records.html)",
  type: "action",
  props: {
    app,
    subject: {
      label: "Subject",
      description: "The subject of the call",
      type: "string",
    },
    callType: {
      label: "Call Type",
      description: "The call type of the call.",
      type: "string",
      options: constants.CALL_TYPES,
    },
    callDuration: {
      label: "Call Duration",
      description: "The duration of the call. E.g. `10:30`",
      type: "string",
    },
    callStartTime: {
      label: "Call Start Time",
      description: "The start time of the call. Accepts date and time in yyyy-MM-ddTHH:mm:ss±HH:mm ISO 8601 format. E.g. `2020-08-02T21:30:00+05:30`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.createCall({
      $,
      data: {
        data: [
          {
            Subject: this.subject,
            Call_Type: this.callType,
            Call_Start_Time: this.callStartTime,
            Call_Duration: this.callDuration,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully created call with ID ${response?.data[0]?.details?.id}`);
    }

    return response;
  },
};
