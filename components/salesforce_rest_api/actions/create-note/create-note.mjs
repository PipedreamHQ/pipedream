import common, { getProps } from "../common/base-create-update.mjs";
import note from "../../common/sobjects/note.mjs";

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
  description: `Creates a note. [See the documentation](${docsLink})`,
  version: "0.3.1",
  type: "action",
  props,
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,  ...data
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
