import app from "../../teamwork.app.mjs";

export default {
  key: "teamwork-get-user",
  name: "Get User",
  description: "Get a user by ID. [See the documentation](https://apidocs.teamwork.com/docs/teamwork/v1/people/get-people-id-json)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    peopleId: {
      propDefinition: [
        app,
        "peopleId",
      ],
      label: "User ID",
      description: "The ID of the user/person to get",
    },
  },
  async run({ $ }) {
    const user = await this.app.getPerson(this.peopleId, $);
    $.export("$summary", `Found user ${user["first-name"]} ${user["last-name"]}`);
    return user;
  },
};
