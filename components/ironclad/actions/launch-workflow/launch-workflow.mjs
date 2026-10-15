import ironclad from "../../ironclad.app.mjs";
import { LAUNCH_WORKFLOW_DEFAULT_USE_DEFAULT_VALUES } from "../../common/constants.mjs";
import { parseJsonObject } from "../../common/utils.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new workflow in Ironclad. Run **Describe Workspace** to find a template ID, then run **Describe Workflow Template** to discover the field keys, types, and constraints (including conditional fields) needed to build the `attributes` payload. Example: set `templateId` to `\"tmpl_abc123\"` and `attributes` to `{\"counterpartyName\": \"Acme Corp\", \"paperSource\": \"Our paper\", \"startDate\": \"2026-09-01\"}`; returns `{\"id\": \"wf_xyz789\", \"status\": \"review\"}`. [See the documentation](https://developer.ironcladapp.com/reference/launch-a-new-workflow)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "JSON object of workflow field key to value pairs. Run **Describe Workflow Template** first to discover valid keys, types, and required fields — including any fields whose `required` is `\"conditional\"` (a `dependsOn` hint shows which other field's value triggers the requirement, when inferable). Complex types use nested objects: monetaryAmount `{\"currency\": \"USD\", \"amount\": 25.37}`, date `\"2021-05-11T17:16:53-07:00\"`, address `{\"lines\": [\"325 5th Street\", \"Suite 200\"], \"locality\": \"San Francisco\", \"region\": \"California\", \"postcode\": \"94107\", \"country\": \"USA\"}`, duration `{\"years\": 1, \"months\": 2, \"weeks\": 3, \"days\": 4}`. A `document` array field (e.g. `draft`) takes `[{\"url\": \"...\"}]` — Ironclad fetches this URL server-side, so the URL must be a real, publicly-reachable file (not a placeholder or made-up domain — a fabricated URL fails with `CONTENT_UNAVAILABLE`). Example: `{\"counterpartyName\": \"Acme Corp\", \"paperSource\": \"Our paper\", \"startDate\": \"2026-09-01\"}`.",
    },
    useDefaultValues: {
      type: "boolean",
      label: "Use Default Values",
      description: "Whether to populate unset fields with the template's default values. Defaults to `true`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const attributes = parseJsonObject(this.attributes, "Attributes");
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
