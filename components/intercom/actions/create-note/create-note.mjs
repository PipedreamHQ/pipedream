import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-create-note",
  name: "Create Note",
  description: "Creates a note for a specific user. [See the docs here](https://developers.intercom.com/intercom-api-reference/reference/create-note-for-contact)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    userId: {
      propDefinition: [
        intercom,
        "userIds",
      ],
      type: "string",
      label: "User",
      description: "The user to create a note for",
    },
    body: {
      propDefinition: [
        intercom,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const {
      userId,
      body,
    } = this;
    const { id: adminId } = await this.intercom.getAdmin($);
    const res = await this.intercom.createNote(userId, adminId, body, $);
    $.export("$summary", `Successfully created note with ID ${res.id}`);
    return res;
  },
};
