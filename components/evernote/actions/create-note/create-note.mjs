import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-create-note",
  name: "Create Note",
  description: "Creates a new note in Evernote. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_createNote)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    evernote,
    title: {
      type: "string",
      label: "Title",
      description: "The subject of the note. Can't begin or end with a space.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The XHTML block that makes up the note. This is the canonical form of the note's contents, so will include abstract Evernote tags for internal resource references. A client may create a separate transformed version of this content for internal presentation, but the same canonical bytes should be used for transmission and comparison unless the user chooses to modify their content.",
      default: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\"><en-note></en-note>",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "If the note is available for normal actions and viewing",
      optional: true,
    },
    notebookGuid: {
      propDefinition: [
        evernote,
        "notebookGuid",
      ],
      optional: true,
    },
    tagGuids: {
      propDefinition: [
        evernote,
        "tagGuids",
      ],
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "A list of the attributes for this note. [See the documentation](https://dev.evernote.com/doc/reference/Types.html#Struct_NoteAttributes) for further details.",
      optional: true,
    },
    noUpdateTitle: {
      type: "boolean",
      label: "No Update Title",
      description: "The client may not update the note's title.",
      optional: true,
    },
    noUpdateContent: {
      type: "boolean",
      label: "No Update Content",
      description: "The client may not update the note's content. Content includes `content` and `resources`, as well as the related fields `contentHash` and `contentLength`.",
      optional: true,
    },
    noUpdateEmail: {
      type: "boolean",
      label: "No Update Email",
      description: "The client may not email the note.",
      optional: true,
    },
    noUpdateShare: {
      type: "boolean",
      label: "No Update Share",
      description: "The client may not share the note with specific recipients.",
      optional: true,
    },
    noUpdateSharePublicly: {
      type: "boolean",
      label: "No Update Share Publicly",
      description: "The client may not make the note public.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const note = await this.evernote.createNote({
        title: this.title,
        content: this.content,
        active: this.active,
        notebookGuid: this.notebookGuid,
        tagGuids: this.tagGuids,
        resources: this.resources,
        attributes: parseObject(this.attributes),
        restrictions: {
          noUpdateTitle: this.noUpdateTitle,
          noUpdateContent: this.noUpdateContent,
          noUpdateEmail: this.noUpdateEmail,
          noUpdateShare: this.noUpdateShare,
          noUpdateSharePublicly: this.noUpdateSharePublicly,
        },
      });

      $.export("$summary", `Created note "${note.title}" with ID ${note.guid}`);
      return note;
    } catch ({ parameter }) {
      throw new ConfigurationError(parameter);
    }
  },
};
