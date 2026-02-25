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
  description: `Updates an enhanced Salesforce content note, which can include formatted text and is part of Salesforce Files. [See the documentation](${docsLink}) and [Set Up Notes](https://help.salesforce.com/s/articleView?id=sales.notes_admin_setup.htm&type=5).`,
  version: "0.0.2",
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
