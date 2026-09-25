import { decode } from "html-entities";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-remove-duplicate-notes",
  name: "Remove Duplicate Notes",
  description: "Deletes duplicate notes, keeping the oldest copy of each. Two notes count as duplicates when their content matches after decoding HTML entities, trimming leading/trailing `<br>` tags and whitespace, and ignoring case; empty notes are skipped."
    + " Scope the cleanup with one or more of the lead, deal, person, organization, project or user IDs (find them with **Search Leads**, **List Deals**, **Search persons**, **List Organizations**, **List Projects** and **List User ID Options**)."
    + " Warning: with no ID set, every note in the account is compared and duplicates across all records are deleted. Deleted notes cannot be recovered; preview with **Search Notes** first."
    + " Example: `Deal ID` `1024` removes repeated notes on that deal only."
    + " Returns the remaining unique notes plus each deleted duplicate paired with the original it matched."
    + " See the documentation for [getting notes](https://developers.pipedrive.com/docs/api/v1/Notes#getNotes) and [deleting notes](https://developers.pipedrive.com/docs/api/v1/Notes#deleteNote)",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "Only include notes attached to this lead. The ID of the lead (a UUID), e.g. `adf21080-0e10-11eb-879b-05d71fb426ec`. Use **Search Leads** or **Get All Leads** to find it (the `id` field).",
    },
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      description: "Only include notes attached to this deal. The ID of the deal, e.g. `1024`. Use **List Deals** to find it (the `id` field).",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "Only include notes attached to this person. The ID of the person, e.g. `42`. Use **Search persons** or **List Persons** to find it (the `id` field).",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "Only include notes attached to this organization. The ID of the organization, e.g. `7`. Use **List Organizations** to find it (the `id` field).",
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "Only include notes written by this user, e.g. `12345678`. Use **List User ID Options** to find it (the `value` field).",
    },
    projectId: {
      propDefinition: [
        pipedriveApp,
        "projectId",
      ],
      description: "Only include notes attached to this project. The ID of the project, e.g. `5`. Use **List Projects** to find it (the `id` field).",
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Only consider notes whose content contains this text (case-insensitive), e.g. `Call summary`. Notes without it are left untouched.",
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
