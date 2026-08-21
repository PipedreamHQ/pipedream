import common, { getProps } from "../common/base-create-update.mjs";
import note from "../../common/sobjects/note.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm";

const props = getProps({
  objType: note,
  docsLink,
});

export default {
  ...common,
  key: "salesforce_rest_api-create-note",
  name: "Create Note",
  description: `Creates a note. [See the documentation](${docsLink})`,
  version: "0.3.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: {
    noteInfo: NOTE_INFO_PROP,
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      noteInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Note", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created note "${this.Title}"`);
    return response;
  },
};
