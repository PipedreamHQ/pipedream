/* eslint-disable no-unused-vars */
import common, { getProps } from "../common/base-create-update.mjs";
import contentNote from "../../common/sobjects/content-note.mjs";
import contentDocumentLink from "../../common/sobjects/content-document-link.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentnote.htm";

const {
  useAdvancedProps: contentNoteUseAdvancedProps,
  ...contentNoteProps
} = getProps({
  objType: contentNote,
  docsLink,
});

const {
  useAdvancedProps: contentDocumentLinkUseAdvancedProps,
  ...contentDocumentLinkProps
} = getProps({
  objType: contentDocumentLink,
  docsLink,
  showDocsInfo: false,
});

export default {
  ...common,
  key: "salesforce_rest_api-create-content-note",
  name: "Create Content Note",
  description: `Creates a content note. [See the documentation](${docsLink}) and [Set Up Notes](https://help.salesforce.com/s/articleView?id=sales.notes_admin_setup.htm&type=5).`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...contentNoteProps,
    ...contentDocumentLinkProps,
  },
  methods: {
    ...common.methods,
    escapeHtml4(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
  },
  async run({ $ }) {
    const {
      salesforce,
      escapeHtml4,
      Title,
      Content,
      OwnerId,
      LinkedEntityId,
      ShareType,
      Visibility,
    } = this;

    const contentNoteResponse = await salesforce.createRecord("ContentNote", {
      $,
      data: {
        Title,
        Content: Buffer.from(escapeHtml4(Content)).toString("base64"),
        OwnerId: OwnerId,
      },
    });

    if (!LinkedEntityId) {
      $.export("$summary", `Successfully created content note with ID \`${contentNoteResponse.id}\`.`);
      return {
        contentNote: contentNoteResponse,
      };
    }

    const contentDocumentLinkResponse = await salesforce.createRecord("ContentDocumentLink", {
      $,
      data: {
        ContentDocumentId: contentNoteResponse.id,
        LinkedEntityId,
        ShareType,
        Visibility,
      },
    });

    $.export("$summary", `Successfully created content note with ID \`${contentNoteResponse.id}\` and document link with ID \`${contentDocumentLinkResponse.id}\`.`);
    return {
      contentNote: contentNoteResponse,
      contentDocumentLink: contentDocumentLinkResponse,
    };
  },
};
