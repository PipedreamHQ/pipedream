// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import contentNote from "../../common/sobjects/content-note.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentnote.htm";

const {
  salesforce, ...props
} = getProps({
  createOrUpdate: "update",
  objType: contentNote,
  docsLink,
});

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
      return "ContentNote";
    },
  },
  props: {
    salesforce,
    noteInfo: NOTE_INFO_PROP,
    contentNoteId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "ContentNote",
          nameField: "Title",
        }),
      ],
      label: "Content Note ID",
      description: "The ID of the content note to update.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      contentNoteId,
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
