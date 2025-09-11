import common from "../common/base-polling.mjs";
import md5 from "md5";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "highlevel_oauth-note-updated",
  name: "Note Updated",
  description: "Emit new event when an existing note is updated. [See the documentation](https://highlevel.stoplight.io/docs/integrations/73decb4b6d0c2-get-all-notes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.app,
        "contactId",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getNoteValues() {
      return this.db.get("noteValues") || {};
    },
    _setNoteValues(noteValues) {
      this.db.set("noteValues", noteValues);
    },
    generateMeta(note) {
      const ts = Date.now();
      return {
        id: `${note.id}${ts}`,
        summary: `Note Updated w/ ID: ${note.id}`,
        ts,
      };
    },
  },
  async run() {
    const results = [];
    const noteValues = this._getNoteValues();
    const newNoteValues = {};

    const { notes } = await this.app.listNotes({
      contactId: this.contactId,
    });
    for (const note of notes) {
      const hash = md5(JSON.stringify(note));
      if (noteValues[note.id] && noteValues[note.id] !== hash) {
        results.push(note);
      }
      newNoteValues[note.id] = hash;
    }

    results.forEach((note) => {
      const meta = this.generateMeta(note);
      this.$emit(note, meta);
    });

    this._setNoteValues(newNoteValues);
  },
  sampleEmit,
};
