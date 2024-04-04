import dex from "../../dex.app.mjs";

export default {
  key: "dex-create-reminder",
  name: "Create Reminder",
  description: "Generates a new reminder within the Dex system. [See the documentation](https://guide.getdex.com/dex-user-api/post-reminder)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dex,
    time: dex.propDefinitions.time,
    message: dex.propDefinitions.message,
  },
  async run({ $ }) {
    const response = await this.dex.createReminder({
      time: this.time,
      message: this.message,
    });
    $.export("$summary", `Successfully created reminder with ID: ${response.id}`);
    return response;
  },
};
