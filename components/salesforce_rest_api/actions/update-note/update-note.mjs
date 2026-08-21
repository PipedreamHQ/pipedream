import common, { getProps } from "../common/base-create-update.mjs";
import note from "../../common/sobjects/note.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm";

/* eslint-disable no-unused-vars */
const {
  salesforce: _sf, ...props
} = getProps({
  createOrUpdate: "update",
  objType: note,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-update-note",
  name: "Update Note",
  description: `Updates a classic Salesforce note, which can contain up to 32 KB of text and is associated with a parent record. [See the documentation](${docsLink})`,
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  methods: {
    ...common.methods,
  },
  props: {
    salesforce,
    noteInfo: NOTE_INFO_PROP,
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note to update. Use **SOQL Query** to find the ID.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      noteId,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      additionalFields,
      noteInfo,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */

    await salesforce.updateRecord("Note", {
      $,
      id: noteId,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });

    $.export("$summary", `Successfully updated note (ID: ${noteId})`);

    return salesforce.getSObject("Note", noteId);
  },
};
