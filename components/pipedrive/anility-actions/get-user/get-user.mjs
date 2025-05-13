import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-get-user",
  name: "Get User (Anility)",
  description: "Returns data about a specific user within the company.",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const { userId } = this;

    const user = await this.pipedriveApp.getUser(userId);

    try {
      $.export("$summary", `Successfully found user with id ${userId}`);

      return user;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get user";
    }
  },
};
