import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import app from "../../talend.app.mjs";

export default {
  name: "Get Available Plans Executions",
  description: "List all plan executions the user is granted visibility on. For each plan execution returns execution and plan identifiers, start and finish timestamps, execution status and counters on done and planned executables within plan. [See the documentation](https://api.talend.com/apis/processing/2021-03/#operation_get-available-plans-executions).",
  key: "talend-get-available-plans-executions",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      description: "Workspace ID the plans should belong to",
      optional: true,
    },
    environmentId: {
      propDefinition: [
        app,
        "environmentId",
      ],
      description: "Environment ID the plans should belong to",
      optional: true,
    },
    lastDays: {
      type: "integer",
      label: "Last Days",
      description: "Filter by last days",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "From date time filter. You can use either ISO8601 date format or timestamp.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "To date time filter. You can use either ISO8601 date format or timestamp.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by status",
      options: constants.PLAN_STATUS,
      optional: true,
    },
    maximumItems: {
      type: "integer",
      label: "Maximum Items",
      description: "Maximum number of items to return",
      optional: true,
    },
  },
  methods: {
    isFieldEmptyOrNull(field) {
      return !field || field === "";
    },
    isDateValid(date) {
      return !isNaN(new Date(date).getTime());
    },
    getConvertedDate(date, fieldName) {
      let converted = null;
      if (!this.isFieldEmptyOrNull(date)) {
        if (!isNaN(date)) {
          converted = date;
        } else {
          if (!this.isDateValid(date)) {
            throw new ConfigurationError(`Invalid date informed for field ${fieldName}`);
          }
          converted = new Date(date).getTime();
        }
      }

      return converted;
    },
  },
  async run({ $ }) {
    const MAXIMUM_ITEMS = this.maximumItems ?? 1000;
    let page = 1;
    const items = [];

    while (true) {
      const res = await this.app.getAvailablePlansExecutions({
        workspaceId: this.workspaceId,
        environmentId: this.environmentId,
        lastDays: this.lastDays,
        from: this.getConvertedDate(this.from, "from"),
        to: this.getConvertedDate(this.to, "to"),
        status: this.status,
      }, page);
      items.push(...res.items);
      if (!res.items || res.items.length === 0 || items.length >= MAXIMUM_ITEMS) {
        break;
      }
      page++;
    }
    if (items.length === 0) {
      $.export("summary", "No items found.");
      return [];
    }
    $.export("summary", `Successfully fetched ${items.length} item(s).`);
    return items.slice(0, MAXIMUM_ITEMS);
  },
};
