// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import note from "../../common/sobjects/note.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm";

/* eslint-disable no-unused-vars */
const {
  useAdvancedProps, ...props
} = getProps({
  objType: note,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-create-note",
  name: "Create Note",
  description: "Create a classic Salesforce note (up to 32 KB of plain text) attached to a parent record."
    + " Prefer **Create Content Note** on modern orgs - classic notes are legacy and do not support rich text."
    + " Use **Find Records** to get the parent record ID first."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    noteInfo: NOTE_INFO_PROP,
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo, noteInfo, ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Note", {
      $,
      data,
    });
    $.export("$summary", `Successfully created note "${this.Title}"`);
    return response;
  },
};
