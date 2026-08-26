// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-create-note",
  name: "Create Note",
  description: "Creates a note on a contact's record in Intercom. The note is automatically attributed to the currently authenticated admin — no Admin ID prop is required. Use **Search Contacts** to find the contact's ID before calling this action. Example: set **User** to `63a07ddf05a32042dffac965` and **Body** to `Followed up via email on 2024-01-15` to log a note on that contact. Returns the new note object including `id`, `body`, and `author`. [See the docs here](https://developers.intercom.com/intercom-api-reference/reference/create-note-for-contact)",
  version: "0.0.8",
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
