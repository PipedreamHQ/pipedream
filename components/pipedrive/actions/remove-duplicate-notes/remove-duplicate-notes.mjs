import { decode } from "html-entities";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-remove-duplicate-notes",
  name: "Remove Duplicate Notes",
  description: "Remove duplicate notes from an object in Pipedrive. See the documentation for [getting notes](https://developers.pipedrive.com/docs/api/v1/Notes#getNotes) and [deleting notes](https://developers.pipedrive.com/docs/api/v1/Notes#deleteNote)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedriveApp,
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead that the notes are attached to",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "The ID of the deal that the notes are attached to",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "The ID of the person that the notes are attached to",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "The ID of the organization that the notes are attached to",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "The ID of the user that the notes are attached to",
    },
    projectId: {
      propDefinition: [
        pipedriveApp,
        "projectId",
      ],
      description: "The ID of the project that the notes are attached to",
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Only remove duplicate notes that contain the specified keyword(s)",
      optional: true,
    },
  },
  methods: {
    getDuplicateNotes(notes) {
      const seenContent = new Map();
      const uniqueNotes = [];
      const duplicates = [];

      // Sort notes by add_time (ascending) to keep the oldest duplicate
      const sortedNotes = notes.sort((a, b) => {
        const dateA = new Date(a.add_time);
        const dateB = new Date(b.add_time);
        return dateA - dateB;
      });

      for (const note of sortedNotes) {
        // Normalize content by removing extra whitespace and converting to lowercase
        const decodedContent = decode(note.content || "");
        const normalizedContent = decodedContent?.replace(/^\s*<br\s*\/?>|<br\s*\/?>\s*$/gi, "").trim()
          .toLowerCase();

        if (!normalizedContent) {
          // Skip notes with empty content
          continue;
        }

        if (seenContent.has(normalizedContent)) {
          // This is a duplicate
          duplicates.push({
            duplicate: note,
            original: seenContent.get(normalizedContent),
          });
        } else {
          // This is the first occurrence
          seenContent.set(normalizedContent, note);
          uniqueNotes.push(note);
        }
      }

      return {
        uniqueNotes,
        duplicates,
        duplicateCount: duplicates.length,
      };
    },
  },
  async run({ $ }) {
    let notes = await this.pipedriveApp.getPaginatedResources({
      fn: this.pipedriveApp.getNotes,
      params: {
        user_id: this.userId,
        lead_id: this.leadId,
        deal_id: this.dealId,
        person_id: this.personId,
        org_id: this.organizationId,
        project_id: this.projectId,
      },
    });

    if (this.keyword) {
      notes = notes.filter((note) =>
        note.content?.toLowerCase().includes(this.keyword.toLowerCase()));
    }

    let result = {
      notes,
      totalNotes: notes.length,
    };

    const {
      uniqueNotes, duplicates, duplicateCount,
    } = this.getDuplicateNotes(notes);

    for (const note of duplicates) {
      await this.pipedriveApp.deleteNote(note.duplicate.id);
    }

    result = {
      notes: uniqueNotes,
      totalNotes: uniqueNotes.length,
      duplicatesFound: duplicateCount,
      duplicates: duplicates,
      originalCount: notes.length,
    };

    $.export("$summary", `Found ${notes.length} total note(s), removed ${duplicateCount} duplicate(s), returning ${uniqueNotes.length} unique note(s)`);

    return result;
  },
};
