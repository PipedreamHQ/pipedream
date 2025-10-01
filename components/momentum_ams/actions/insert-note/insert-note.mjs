import app from "../../momentum_ams.app.mjs";

export default {
  key: "momentum_ams-insert-note",
  name: "Insert Note",
  description: "Insert note . [See the documentation](https://docs.google.com/document/d/11Xk7TviRujq806pLK8pQTcdzDF2ClmPvkfnVmdh1bGc/edit?tab=t.0)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    creatorName: {
      propDefinition: [
        app,
        "creatorName",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    isStickyNote: {
      propDefinition: [
        app,
        "isStickyNote",
      ],
    },
    hide: {
      propDefinition: [
        app,
        "hide",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.insertNote({
      $,
      data: {
        insured_database_id: this.id,
        subject: this.subject,
        creator_name: this.creatorName,
        type: this.type,
        is_sticky_note: this.isStickyNote,
        hide: this.hide,
      },
    });
    $.export("$summary", "Successfully inserted note with subject: " + this.subject);
    return response;
  },
};
