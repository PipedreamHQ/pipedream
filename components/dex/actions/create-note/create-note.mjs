import dex from "../../dex.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dex-create-note",
  name: "Create Note",
  description: "Establishes a brand new note within dex. [See the documentation](https://guide.getdex.com/dex-user-api/post-a-note)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dex,
    note: {
      type: "string",
      label: "Note",
      description: "Content of the note",
    },
    contactIds: {
      propDefinition: [
        dex,
        "contactIds",
      ],
    },
    eventTime: {
      type: "string",
      label: "Event Time",
      description: "Time of the note in ISO 8601 format (`2023-05-19T01:03:27.083Z`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dex.createNote({
      $,
      data: {
        timeline_event: {
          note: this.note,
          event_time: this.eventTime || utils.getCurrentDatetime(),
          meeting_type: "note",
          timeline_items_contacts: this.contactIds?.length
            ? {
              data: utils.buildContactData(this.contactIds),
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Successfully created note with ID: ${response.insert_timeline_items_one.id}`);
    return response;
  },
};
