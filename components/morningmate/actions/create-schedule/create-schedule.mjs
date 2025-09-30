import morningmate from "../../morningmate.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "morningmate-create-schedule",
  name: "Create Schedule",
  description: "Creates a new schedule for a specific project. [See the documentation](https://api.morningmate.com/docs/api/posts#createSchedule-metadata)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    morningmate,
    projectId: {
      propDefinition: [
        morningmate,
        "projectId",
      ],
    },
    registerId: {
      propDefinition: [
        morningmate,
        "userId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the schedule",
    },
    isAllDay: {
      type: "boolean",
      label: "Is All Day",
      description: "Availability for the whole day",
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "The start datetime of the schedule in ISO 8601 format",
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "The end datetime of the schedule in ISO 8601 format",
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Contents of a memo for the schedule",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.createSchedule({
      $,
      projectId: this.projectId,
      data: {
        registerId: this.registerId,
        title: this.title,
        isAllDay: this.isAllDay,
        startDateTime: utils.formatDateTime(this.startDateTime),
        endDateTime: utils.formatDateTime(this.endDateTime),
        memo: this.memo,
      },
    });
    $.export("$summary", `Successfully created schedule for project ID ${this.projectId}`);
    return response;
  },
};
