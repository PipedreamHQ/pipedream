import app from "../../less_annoying_crm.app.mjs";
import { pluck } from "../../common/utils.mjs";

const ACTIVITY_TYPES = [
  "notes",
  "tasks",
  "events",
  "pipelineItems",
];

// Trimmed field sets keep the output small; the full objects carry attendees,
// recurrence rules, and per-record metadata that are rarely needed.
const NOTE_FIELDS = [
  "NoteId",
  "Note",
  "DateDisplayedInHistory",
  "UserMetaData",
  "PipelineInfo",
];
const TASK_FIELDS = [
  "TaskId",
  "Name",
  "DueDate",
  "Description",
  "IsCompleted",
  "DateCompleted",
  "AssignedTo",
];
const EVENT_FIELDS = [
  "EventId",
  "Name",
  "StartDate",
  "EndDate",
  "Location",
  "Description",
  "IsAllDay",
  "Status",
];
const PIPELINE_ITEM_FIELDS = [
  "PipelineItemId",
  "PipelineId",
  "StatusId",
  "LastNote",
  "LastUpdate",
  "PipelineMetaData",
  "StatusMetaData",
];

export default {
  key: "less_annoying_crm-get-contact-activities",
  name: "Get Contact Activities",
  description: "Retrieves the activity attached to a contact, company, or lead's contact record: notes, tasks (including completed), calendar events, and pipeline items (leads) with their current status."
    + " Use this for \"what's happened with X\", \"show the history for X\", or \"what's open for X\" requests. Get the `contactId` from **Search Contacts**; for a lead, use the `ContactId` on the pipeline item from **Search Pipeline Items**."
    + " By default all four types are returned; pass `include` to fetch only some (e.g. `[\"notes\", \"tasks\"]`)."
    + " Returns an object keyed by type. Each of notes/tasks/events has `hasMoreResults` and `results`; if `hasMoreResults` is true, call again with `page` incremented (or raise `maxResults`). `pipelineItems` is grouped by pipeline. Records are trimmed to their key fields."
    + " Example: `contactId: \"1234567890123456789012345678901\", include: [\"tasks\"]` returns `{\"tasks\": {\"hasMoreResults\": false, \"results\": [{\"TaskId\": \"…\", \"Name\": \"Follow up on proposal\", \"DueDate\": \"2025-08-01\", \"IsCompleted\": false}]}}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Items_Attached_To_Contacts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    include: {
      type: "string[]",
      label: "Activity Types",
      description: "Which activity types to retrieve. Defaults to all.",
      options: ACTIVITY_TYPES,
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      description: "Maximum number of notes, tasks, and events to return per type (default 50, max 10000).",
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
      description: "Page of notes, tasks, and events to return, starting at 1. Applies to every selected type; increment while a type reports `hasMoreResults: true`. Does not apply to pipeline items.",
    },
  },
  async run({ $ }) {
    const include = this.include?.length
      ? this.include
      : ACTIVITY_TYPES;
    const parameters = {
      ContactId: this.contactId,
    };
    const paged = {
      ...parameters,
      MaxNumberOfResults: this.maxResults ?? 50,
      Page: this.page,
    };
    const normalize = (fields) => ({
      HasMoreResults, Results,
    }) => ({
      hasMoreResults: HasMoreResults,
      results: Results.map((record) => pluck(record, fields)),
    });

    const calls = {
      notes: () => this.app.getNotesAttachedToContact({
        $,
        parameters: paged,
      }).then(normalize(NOTE_FIELDS)),
      tasks: () => this.app.getTasksAttachedToContact({
        $,
        parameters: paged,
      }).then(normalize(TASK_FIELDS)),
      events: () => this.app.getEventsAttachedToContact({
        $,
        parameters: paged,
      }).then(normalize(EVENT_FIELDS)),
      pipelineItems: () => this.app.getPipelineItemsAttachedToContact({
        $,
        parameters,
      }).then((groups) => groups.map(({
        PipelineId, PipelineItems,
      }) => ({
        PipelineId,
        PipelineItems: PipelineItems.map((item) => pluck(item, PIPELINE_ITEM_FIELDS)),
      }))),
    };

    const entries = await Promise.all(
      include.map(async (type) => [
        type,
        await calls[type](),
      ]),
    );
    const activities = Object.fromEntries(entries);

    const counts = entries.map(([
      type,
      value,
    ]) => {
      const count = type === "pipelineItems"
        ? value.reduce((n, group) => n + group.PipelineItems.length, 0)
        : value.results.length;
      return `${count} ${type}`;
    });
    $.export("$summary", `Retrieved ${counts.join(", ")} for contact ${this.contactId}`);
    return activities;
  },
};
