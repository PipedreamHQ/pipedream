import common from "../common/base-create-update.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { NOTE_INFO_PROP } from "../../common/props-info.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentnote.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-content-note",
  name: "Create Content Note",
  description: `Creates a content note. [See the documentation](${docsLink}) and [Set Up Notes](https://help.salesforce.com/s/articleView?id=sales.notes_admin_setup.htm&type=5).`,
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    noteInfo: NOTE_INFO_PROP,
    Title: {
      type: "string",
      label: "Title",
      description: "Title of the content note.",
    },
    Content: {
      type: "string",
      label: "Content",
      description: "Body content of the note (HTML-escaped and base64-encoded before send).",
    },
    LinkedEntityId: {
      type: "string",
      label: "Linked Entity ID",
      description:
        "Optional ID of a record to link this note to. Use **SOQL Query** to find the ID.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description:
        "Other ContentNote/ContentDocumentLink fields as name -> value pairs. Use for OwnerId, ShareType (default `I`), Visibility, IsReadOnly, etc. Example: `{\"OwnerId\": \"005xxx\", \"ShareType\": \"V\", \"Visibility\": \"AllUsers\"}`.",
      optional: true,
    },
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
      Title,
      Content,
      LinkedEntityId,
      additionalFields: af,
    } = this;

    const {
      OwnerId,
      IsReadOnly,
      ShareType = "I",
      Visibility,
    } = af ?? {};

    const contentNoteResponse = await this.salesforce.createRecord("ContentNote", {
      $,
      data: {
        Title,
        Content: Buffer.from(this.escapeHtml4(Content)).toString("base64"),
        OwnerId,
        IsReadOnly,
      },
    });

    if (!LinkedEntityId) {
      $.export("$summary", `Successfully created content note with ID \`${contentNoteResponse.id}\`.`);
      return {
        contentNote: contentNoteResponse,
      };
    }

    const contentDocumentLinkResponse = await this.salesforce.createRecord("ContentDocumentLink", {
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
