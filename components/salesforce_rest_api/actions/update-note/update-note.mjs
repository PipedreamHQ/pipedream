// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import note from "../../common/sobjects/note.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm";

const {
  salesforce, ...props
} = getProps({
  createOrUpdate: "update",
  objType: note,
  docsLink,
});

export default {
  ...common,
  key: "salesforce_rest_api-update-note",
  name: "Update Note",
  description: "Update a classic Salesforce note (up to 32 KB of plain text)."
    + " Use **Update Content Note** instead for enhanced rich-text notes - the two are different objects."
    + " Supplying `Body` replaces the note text outright rather than appending to it."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "Note";
    },
  },
  props: {
    salesforce,
    noteInfo: NOTE_INFO_PROP,
    noteId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Note",
          nameField: "Title",
        }),
      ],
      label: "Note ID",
      description: "The ID of the note to update.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      noteId,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
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
