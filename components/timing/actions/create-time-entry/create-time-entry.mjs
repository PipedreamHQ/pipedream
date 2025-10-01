import timing from "../../timing.app.mjs";

export default {
  key: "timing-create-time-entry",
  name: "Create Time Entry",
  description: "Generates a new time entry in Timing app. [See the documentation](https://web.timingapp.com/docs/#time-entries-POSTapi-v1-time-entries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timing,
    project: {
      propDefinition: [
        timing,
        "project",
      ],
    },
    startDate: {
      propDefinition: [
        timing,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        timing,
        "endDate",
      ],
    },
    title: {
      propDefinition: [
        timing,
        "title",
      ],
    },
    notes: {
      propDefinition: [
        timing,
        "notes",
      ],
    },
    replaceExisting: {
      propDefinition: [
        timing,
        "replaceExisting",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.timing.createNewTimeEntry({
      $,
      data: {
        start_date: this.startDate,
        end_date: this.endDate,
        project: this.project,
        title: this.title,
        notes: this.notes,
        replace_existing: this.replaceExisting,
      },
    });
    $.export("$summary", `Time entry ${data.self} created successfully`);
    return data;
  },
};
