import app from "../../huntress.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "huntress-list-identities",
  name: "List Identities",
  description: "List identities associated with your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/identities/get/v1/identities)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
      description: "Filter by organization ID within Huntress account.",
    },
    tenantType: {
      type: "string",
      label: "Tenant Type",
      description: "Filter by identity provider type.",
      optional: true,
      options: constants.TENANT_TYPE_OPTIONS,
    },
    riskLevel: {
      type: "string",
      label: "Risk Level",
      description: "Filter by risk level.",
      optional: true,
      options: constants.RISK_LEVEL_OPTIONS,
    },
    mfaEnabled: {
      type: "boolean",
      label: "MFA Enabled",
      description: "Filter by MFA enabled status.",
      optional: true,
    },
    billable: {
      type: "boolean",
      label: "Billable",
      description: "Filter by billable status.",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Filter by enabled status.",
      optional: true,
    },
    external: {
      type: "boolean",
      label: "External / Guest",
      description: "Filter by external/guest status.",
      optional: true,
    },
  },
  async run({ $ }) {
    const identities = await this.app.paginate({
      fn: this.app.listIdentities.bind(this.app),
      fnArgs: {
        $,
        params: {
          organization_id: this.organizationId,
          tenant_type: this.tenantType,
          risk_level: this.riskLevel,
          mfa_enabled: this.mfaEnabled,
          billable: this.billable,
          enabled: this.enabled,
          external: this.external,
        },
      },
      keyField: "identities",
    });

    $.export("$summary", `Successfully retrieved \`${identities.length}\` identity(ies)`);

    return identities;
  },
};
