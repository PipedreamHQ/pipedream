// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";
import { LAUNCH_WORKFLOW_DEFAULT_USE_DEFAULT_VALUES } from "../../common/constants.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new workflow in Ironclad. Run **Describe Workspace** to find a template ID, then run **Describe Workflow Template** to discover the field keys, types, and constraints (including conditional fields) needed to build the `attributes` payload. Example: set `templateId` to `\"tmpl_abc123\"` and `attributes` to `{\"counterpartyName\": \"Acme Corp\", \"paperSource\": \"Our paper\", \"startDate\": \"2026-09-01\"}`; returns `{\"id\": \"wf_xyz789\", \"status\": \"review\"}`. [See the documentation](https://developer.ironcladapp.com/reference/launch-a-new-workflow)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ironclad,
    templateId: {
      propDefinition: [
        ironclad,
        "templateId",
      ],
    },
    attributes: {
      type: "string",
      label: "Attributes",
      description: "JSON object of workflow field key to value pairs. Run **Describe Workflow Template** first to discover valid keys, types, and required fields — including any fields whose `required` is `\"conditional\"` (a `dependsOn` hint shows which other field's value triggers the requirement, when inferable). Complex types use nested objects: monetaryAmount `{\"currency\": \"USD\", \"amount\": 25.37}`, date `\"2021-05-11T17:16:53-07:00\"`, address `{\"lines\": [\"325 5th Street\", \"Suite 200\"], \"locality\": \"San Francisco\", \"region\": \"California\", \"postcode\": \"94107\", \"country\": \"USA\"}`, duration `{\"years\": 1, \"months\": 2, \"weeks\": 3, \"days\": 4}`. A `document` array field (e.g. `draft`) takes `[{\"url\": \"...\"}]` — Ironclad fetches this URL server-side, so it must be a real, publicly-reachable file, not a placeholder domain; if you don't have a specific document, use `[{\"url\": \"https://file-examples.com/storage/fe99faaddd6a870e791ac7b/2017/10/file-sample_150kB.pdf\"}]`. Example: `{\"counterpartyName\": \"Acme Corp\", \"paperSource\": \"Our paper\", \"startDate\": \"2026-09-01\"}`.",
    },
    useDefaultValues: {
      type: "boolean",
      label: "Use Default Values",
      description: "Whether to populate unset fields with the template's default values. Defaults to `true`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const attributes = JSON.parse(this.attributes);
    const response = await this.ironclad.launchWorkflow({
      $,
      params: {
        useDefaultValues: this.useDefaultValues ?? LAUNCH_WORKFLOW_DEFAULT_USE_DEFAULT_VALUES,
      },
      data: {
        template: this.templateId,
        attributes,
      },
    });
    $.export("$summary", `Workflow launched successfully with ID ${response.id}`);
    return response;
  },
};
