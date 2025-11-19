import app from "../../ashby.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ashby-create-interview-schedule",
  name: "Create Interview Schedule",
  description: "Creates a scheduled interview. [See the documentation](https://developers.ashbyhq.com/reference/interviewschedulecreate)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    applicationId: {
      propDefinition: [
        app,
        "applicationId",
      ],
      description: "The ID of the application to schedule an interview for",
    },
    interviewEvents: {
      type: "string[]",
      label: "Interview Events",
      description: `Array of interview events. Each event should contain:
- **startTime** (string, required): Interview start time in ISO 8601 format (e.g., 2023-01-30T15:00:00.000Z)
- **endTime** (string, required): Interview end time in ISO 8601 format (e.g., 2023-01-30T16:00:00.000Z)
- **interviewers** (array, required): Array of interviewer objects with:
  - **email** (string, required): Email address of the interviewer
  - **feedbackRequired** (boolean, optional): Whether feedback from this interviewer is required

Example:
\`\`\`json
[
  {
    "startTime": "2023-01-30T15:00:00.000Z",
    "endTime": "2023-01-30T16:00:00.000Z",
    "interviewers": [
      {
        "email": "interview@example.com",
        "feedbackRequired": true
      }
    ]
  }
]
\`\`\`
`,
    },
  },
  async run({ $ }) {
    const {
      app,
      applicationId,
      interviewEvents,
    } = this;

    const response = await app.createInterviewSchedule({
      $,
      data: {
        applicationId,
        interviewEvents: utils.parseJson(interviewEvents),
      },
    });

    $.export("$summary", "Successfully created interview schedule");

    return response;
  },
};
