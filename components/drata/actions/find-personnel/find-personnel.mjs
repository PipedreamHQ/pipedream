import drata from "../../drata.app.mjs";
import _ from "lodash";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/PersonnelPublicController_listPersonnel/";

export default {
  key: "drata-find-personnel",
  name: "Find Personnel",
  description: `Find Personnel. [See the documentation](${docsLink}).`,
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    drata,
    q: {
      type: "string",
      label: "Query",
      description: "Query to search for",
      optional: true,
    },
    employmentStatuses: {
      type: "string[]",
      label: "Employment Statuses",
      description: "Employment statuses to filter by",
      optional: true,
      options: [
        "CURRENT_EMPLOYEE",
        "FORMER_EMPLOYEE",
        "CURRENT_CONTRACTOR",
        "FORMER_CONTRACTOR",
        "OUT_OF_SCOPE",
        "UNKNOWN",
        "SPECIAL_FORMER_EMPLOYEE",
        "SPECIAL_FORMER_CONTRACTOR",
      ],
    },
    complianceTypes: {
      type: "string[]",
      label: "Compliance Types",
      description: "Compliance types to filter by",
      optional: true,
      options: [
        "fullCompliance",
        "acceptedPoliciesCompliance",
        "identityMfaCompliance",
        "bgCheckCompliance",
        "agentInstalledCompliance",
        "passwordManagerCompliance",
        "autoUpdatesCompliance",
        "locationServicesCompliance",
        "hdEncryptionCompliance",
        "antivirusCompliance",
        "lockScreenCompliance",
        "securityTrainingCompliance",
        "hipaaTrainingCompliance",
        "deviceCompliance",
        "multiSecurityTrainingCompliance",
        "offboardingEvidence",
      ],
    },
    groupIds: {
      type: "integer[]",
      label: "Group IDs",
      description: "List of groups to find personnel by",
      optional: true,
    },
    useExclusions: {
      type: "boolean",
      label: "Use Exclusions",
      description: "Use exclusions on list personnel",
      optional: true,
    },
    mdmSourceType: {
      type: "string",
      label: "MDM Source Type",
      description: "MDM Source Type to filter by",
      optional: true,
      options: [
        "AGENT",
        "JAMF",
        "INTUNE",
        "KANDJI",
        "JUMPCLOUD",
        "HEXNODE_UEM",
        "UNKNOWN",
        "RIPPLING",
        "WORKSPACE_ONE",
      ],
    },
    inverseMdmSourceTypes: {
      type: "string[]",
      label: "Inverse MDM Source Types",
      description: "Inverse MDM Source Types to filter by",
      optional: true,
      options: [
        "AGENT",
        "JAMF",
        "INTUNE",
        "KANDJI",
        "JUMPCLOUD",
        "HEXNODE_UEM",
        "UNKNOWN",
        "RIPPLING",
        "WORKSPACE_ONE",
      ],
    },
  },
  async run({ $ }) {
    const params = _.pickBy(_.pick(this, [
      "q",
      "employmentStatuses",
      "groupIds",
      "useExclusions",
      "mdmSourceType",
      "inverseMdmSourceTypes",
    ]));

    this.drata.initializeJsonProps(this, [
      "employmentStatuses",
      "complianceTypes",
      "groupIds",
      "inverseMdmSourceTypes",
    ]);

    for (const complianceType of this.complianceTypes || []) {
      params[complianceType] = true;
    }

    const response = await this.drata.listPersonnel({
      $,
      paginate: true,
      params,
    });

    $.export("$summary", `Succesfully found ${response.data.length} personnel`);

    return response;
  },
};
