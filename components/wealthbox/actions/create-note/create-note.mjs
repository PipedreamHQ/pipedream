import wealthbox from "../../wealthbox.app.mjs";
import {
  DEFAULT_LINKED_TO_TYPE,
  NOTE_VISIBILITY,
} from "../../common/constants.mjs";

export default {
  key: "wealthbox-create-note",
  name: "Create Note",
  description: "Create a note linked to a contact via POST /notes. Run **List Contact Options** to find the id of the contact to link the note to. Example: create a note with body `Called client to discuss Q3 portfolio review` linked to contact id `67890`; returns the note object including `id`, `content`, `linked_to`, `visible_to`, and `created_at`. [See the documentation](https://dev.wealthbox.com/#notes-retrieve-all-notes-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wealthbox,
    body: {
      type: "string",
      label: "Body",
      description: "The main body text of the note. Example: `Called client to discuss Q3 portfolio review.`",
    },
    linkedToId: {
      type: "string",
      label: "Linked To ID",
      description: "Free-form id of the resource to link the note to. Run **List Contact Options** first. Example: `67890`.",
    },
    linkedToType: {
      type: "string",
      label: "Linked To Type",
      description: "Type of the linked resource. Defaults to `Contact` (the only supported type).",
      optional: true,
    },
    visibleTo: {
      type: "string",
      label: "Visible To",
      description: "Note visibility. One of `Everyone` or `Private` (or a user group id). Defaults to `Everyone`.",
      options: NOTE_VISIBILITY,
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional list of tag name strings to attach to the note. Example: `portfolio`, `q3-review`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.createNote({
      $,
      data: {
        content: this.body,
        linked_to: [
          {
            id: Number(this.linkedToId),
            type: this.linkedToType || DEFAULT_LINKED_TO_TYPE,
          },
        ],
        visible_to: this.visibleTo,
        tags: this.tags,
      },
    });

    $.export("$summary", `Successfully created note with ID ${response.id}`);
    return response;
  },
};
