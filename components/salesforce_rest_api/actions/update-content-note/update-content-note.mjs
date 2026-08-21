// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import contentNote from "../../common/sobjects/content-note.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentnote.htm";

/* eslint-disable no-unused-vars */
const {
  salesforce: _sf, ...props
} = getProps({
  createOrUpdate: "update",
  objType: contentNote,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-update-content-note",
  name: "Update Content Note",
  description: "Update an enhanced Salesforce content note (rich text, stored in Salesforce Files)."
    + " Use **Update Note** instead for classic plain-text notes - the two are different objects."
    + " Supplying `Content` replaces the note body outright rather than appending to it."
    + " "
    + "Notes must be enabled in the org first - see [Set Up Notes](https://help.salesforce.com/s/articleView?id=sales.notes_admin_setup.htm&type=5)."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.1.0",
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
    contentNoteId: {
      type: "string",
      label: "Content Note ID",
      description: "The ID of the ContentNote to update (Salesforce's 15- or 18-character record ID, e.g. `069XX0000004Grr`). Use **SOQL Query** to find the ID.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      contentNoteId,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      additionalFields,
      noteInfo,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    await salesforce.updateRecord("ContentNote", {
      $,
      id: contentNoteId,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });

    $.export("$summary", `Successfully updated content note (ID: ${contentNoteId})`);

    return salesforce.getSObject("ContentNote", contentNoteId);
  },
};
