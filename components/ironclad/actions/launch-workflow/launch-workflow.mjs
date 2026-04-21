import app from "../../ironclad.app.mjs";
import { parseValue } from "../../common/utils.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new Ironclad workflow from a template."
    + " **Call Describe Workflow Template first** to learn which attributes the template expects and their required shapes — the `attributes` object is template-specific."
    + " Pass `attributes` as a free-form JSON object keyed by attribute key. Example: `{\"counterpartyName\": \"Acme Corp\", \"contractValue\": {\"currency\": \"USD\", \"amount\": 25000}}`."
    + " Complex attribute shapes: `monetaryAmount` → `{currency, amount}`, `address` → `{lines, locality, region, postcode, country}`, `duration` → `{years, months, weeks, days}`, `date` → ISO 8601 string, `document` → `{url}`, `user` → `{email}`."
    + " If the connection uses Client Credentials (service account) rather than standard OAuth, set `creatorEmail` to act on behalf of a user."
    + " [See the documentation](https://developer.ironcladapp.com/reference/launch-a-new-workflow)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the workflow template to launch. Obtain via **Describe Workspace**.",
    },
    attributes: {
      type: "string",
      label: "Attributes",
      description: "JSON object of attribute key-value pairs for the workflow. Use **Describe Workflow Template** to discover valid keys and expected value shapes."
        + " Example: `{\"counterpartyName\": \"Acme Corp\", \"paperSource\": \"Our paper\", \"effectiveDate\": \"2026-01-01T00:00:00Z\"}`.",
    },
    useDefaultValues: {
      type: "boolean",
      label: "Use Default Values",
      description: "When true, unspecified attributes use their template defaults.",
      optional: true,
      default: true,
    },
    creatorEmail: {
      type: "string",
      label: "Creator Email",
      description: "Optional. Email of the Ironclad user to act as workflow creator. Only needed for Client Credentials authentication flows.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedAttributes = parseValue(this.attributes) ?? {};

    const headers = {};
    if (this.creatorEmail) {
      headers["x-as-user-email"] = this.creatorEmail;
    }

    const response = await this.app.launchWorkflow({
      $,
      headers,
      params: {
        useDefaultValues: this.useDefaultValues !== false,
      },
      data: {
        template: this.templateId,
        attributes: parsedAttributes,
        ...(this.creatorEmail
          ? {
            creator: {
              email: this.creatorEmail,
            },
          }
          : {}),
      },
    });

    $.export("$summary", `Launched workflow ${response?.id ?? ""} from template ${this.templateId}`);
    return response;
  },
};
