// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import {
  MAX_WORK_ITEM_IDS, WORK_ITEM_ERROR_POLICY_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-work-items",
  name: "List Work Items",
  description: "Retrieve a batch of work items by id in one call, up to 200 at a time. Returns each item's fields. Use this after a query to turn a list of ids into the actual field values. Example: ids `297,298,299`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/list?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
      optional: true,
    },
    ids: {
      type: "string[]",
      label: "Work Item IDs",
      description: "IDs of the work items to retrieve, e.g. `[\"297\", \"298\", \"299\"]` (max 200 IDs)",
    },
    fields: {
      propDefinition: [
        azureDevops,
        "workItemFields",
      ],
      optional: true,
    },
    expand: {
      propDefinition: [
        azureDevops,
        "workItemExpand",
      ],
      optional: true,
    },
    errorPolicy: {
      type: "string",
      label: "Error Policy",
      description: "How to handle IDs that cannot be read. `omit` skips them, `fail` (default) errors the whole request.",
      options: WORK_ITEM_ERROR_POLICY_OPTIONS,
      optional: true,
    },
    asOf: {
      propDefinition: [
        azureDevops,
        "asOf",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.ids.length > MAX_WORK_ITEM_IDS) {
      throw new ConfigurationError(`**Work Item IDs** accepts at most ${MAX_WORK_ITEM_IDS} IDs per call, received ${this.ids.length}.`);
    }
    const { value: workItems } = await this.azureDevops.listWorkItems({
      $,
      organization: this.organization,
      project: this.project,
      params: {
        ids: this.ids.join(","),
        fields: this.fields?.length
          ? this.fields.join(",")
          : undefined,
        $expand: this.expand,
        errorPolicy: this.errorPolicy,
        asOf: this.asOf,
      },
    });
    $.export("$summary", `Retrieved ${workItems.length} work item${workItems.length === 1
      ? ""
      : "s"}`);
    return workItems;
  },
};
