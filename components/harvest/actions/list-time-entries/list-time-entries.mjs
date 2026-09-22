import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-time-entries",
  name: "List Time Entries",
  description: `Retrieve a list of time entries from Harvest, with optional filters, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} entries. Use this to discover time entry IDs for **Get Time Entry**, **Update Time Entry**, or **Delete Time Entry**. For a pure "how many entries are there" question, set \`countOnly\` to skip fetching any entries and just return the true total — safe even on a huge, unfiltered result set that would otherwise exceed the response-size limit. Pass \`notes\` to filter results to entries whose notes contain that text (client-side, case-insensitive substring) — useful for finding one entry inside a large result set without hitting the output-size limit. Example: call with projectId set to a project's ID and from/to set to a date range to total up hours logged that week. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#list-all-time-entries).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
    },
    clientId: {
      propDefinition: [
        harvest,
        "clientId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
      ],
      optional: true,
    },
    isBilled: {
      type: "boolean",
      label: "Is Billed",
      description: "Only return entries that have or have not been invoiced.",
      optional: true,
    },
    isRunning: {
      type: "boolean",
      label: "Is Running",
      description: "Only return running or non-running entries.",
      optional: true,
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
    from: {
      type: "string",
      label: "From",
      description: "Only return entries with a spent_date on or after this date, format `YYYY-MM-DD`, e.g. `2026-09-01`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "Only return entries with a spent_date on or before this date, format `YYYY-MM-DD`, e.g. `2026-09-10`.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes Contains",
      description: "Only return entries whose notes contain this text (case-insensitive substring match, applied client-side). Use this to find a specific entry inside a large result set instead of paging through everything.",
      optional: true,
    },
    countOnly: {
      type: "boolean",
      label: "Count Only",
      description: "Skip fetching entries entirely and just return the true total for the given filters (via Harvest's own count). Use this for \"how many\" questions — safe on any result size, since it never fetches the entries themselves.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filterParams = {
      accountId: this.accountId,
      user_id: this.userId,
      client_id: this.clientId,
      project_id: this.projectId,
      task_id: this.taskId,
      is_billed: this.isBilled,
      is_running: this.isRunning,
      updated_since: this.updatedSince,
      from: this.from,
      to: this.to,
    };

    // A single per_page=1 lookup so $summary can report the account's true total for
    // these filters even when the full result set is capped or notes-filtered down.
    const totalsResponse = await this.harvest.listTimeEntries({
      $,
      per_page: 1,
      page: 1,
      ...filterParams,
    });
    const totalEntries = totalsResponse.total_entries ?? null;

    if (this.countOnly) {
      $.export("$summary", `${totalEntries ?? 0} time entr${totalEntries === 1
        ? "y"
        : "ies"} match the filters`);
      return [];
    }

    const entries = [];
    const notesFilter = this.notes?.toLowerCase();
    let scanned = 0;
    const pages = this.harvest.listTimeEntriesPaginated({
      page: 1,
      $,
      ...filterParams,
    });
    for await (const entry of pages) {
      scanned += 1;
      if (notesFilter && !entry.notes?.toLowerCase().includes(notesFilter)) {
        if (scanned >= constants.MAX_AUTO_PAGINATE_RECORDS * 10) break;
        continue;
      }
      entries.push(entry);
      if (entries.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = entries.length;
    const totalSuffix = totalEntries !== null && totalEntries !== count
      ? ` (${totalEntries} total match the filters)`
      : "";
    $.export("$summary", `Successfully retrieved ${count} time entr${count === 1
      ? "y"
      : "ies"}${totalSuffix}`);
    return entries;
  },
};
