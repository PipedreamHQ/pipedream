import app from "../../calendarhero.app.mjs";

export default {
  key: "calendarhero-list-meeting-types",
  name: "List Meeting Types",
  description: "Get the user's meeting types. [See the documentation](https://api.calendarhero.com/documentation#/user/getUserMeeting).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listMeetingTypes({
      $,
    });
    const { length } = Object.keys(response ?? {});
    $.export("$summary", `Successfully listed ${length} meeting type${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
