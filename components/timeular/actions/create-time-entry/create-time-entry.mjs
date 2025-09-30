import timeular from "../../timeular.app.mjs";

export default {
  key: "timeular-create-time-entry",
  name: "Create Time Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new time entry. [See the documentation](https://developers.timeular.com/#e66a9e5a-1035-4522-a9fc-5df5a5a05ef7)",
  type: "action",
  props: {
    timeular,
    activityId: {
      propDefinition: [
        timeular,
        "activityId",
      ],
    },
    startedAt: {
      type: "string",
      label: "Started At",
      description: "The start dateTime. Format **YYYY-DD-MMTHH:mm:ss.sss**",
    },
    stoppedAt: {
      type: "string",
      label: "Stopped At",
      description: "The stop dateTime. Format **YYYY-DD-MMTHH:mm:ss.sss**",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Within this Note, you can refer one or more Tags or Mentions by their ID and put inside a special prefix and suffix, `<{{|t|1|}}>` for the tag with id 1 and `<{{|m|1|}}>` for the mention with id 1.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      timeular,
      note,
      ...data
    } = this;

    const response = await timeular.createTimeEntry({
      $,
      data: {
        ...data,
        note: {
          text: note,
        },
        scope: "timeular",
      },
    });

    $.export("$summary", `A new time entry with Id: ${response.id} was successfully created!`);
    return response;
  },
};
