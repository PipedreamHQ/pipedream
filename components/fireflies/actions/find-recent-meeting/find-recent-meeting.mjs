import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-find-recent-meeting",
  name: "Find Recent Meeting",
  description: "Retrieves the most recent meeting for a user.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireflies,
  },
  async run({ $ }) {
    const response = await this.fireflies.getRecentMeeting();
    $.export("$summary", "Successfully fetched the most recent meeting");
    return response;
  },
};
