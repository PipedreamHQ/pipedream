import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-list-pipelines",
  name: "List Pipelines",
  description: "Lists all pipelines (e.g. Leads) in the Less Annoying CRM account along with each pipeline's statuses and their IDs."
    + " Use this before **Search Pipeline Items**, **Create Pipeline Item**, or **Update Pipeline Item** to find the `pipelineId` and `statusId` values they require."
    + " Leads are pipeline items in the pipeline named \"Leads\". Statuses with `IsActive: false` are closed/inactive."
    + " Example result: `[{\"PipelineId\": \"1234567890123456789012345678904\", \"Name\": \"Leads\", \"Statuses\": [{\"StatusId\": \"1234567890123456789012345678905\", \"Name\": \"New\", \"IsActive\": true}, {\"StatusId\": \"1234567890123456789012345678907\", \"Name\": \"Closed - Won\", \"IsActive\": false}]}]`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Settings_Functions/Pipelines#Goto-GetPipelines)",
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
    includeArchived: {
      type: "boolean",
      label: "Include Archived Pipelines",
      description: "Also return archived pipelines, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const pipelines = await this.app.getPipelines({
      $,
      parameters: {
        IncludeArchivedPipelines: this.includeArchived ?? false,
        IncludeCustomFields: false,
      },
    });

    const result = pipelines.map(({
      PipelineId, Name, DateArchived, Statuses,
    }) => ({
      PipelineId,
      Name,
      DateArchived,
      Statuses: Statuses?.map(({
        StatusId, Name, IsActive,
      }) => ({
        StatusId,
        Name,
        IsActive,
      })),
    }));

    $.export("$summary", `Found ${result.length} pipeline(s)`);
    return result;
  },
};
