import terraform from "../../terraform.app.mjs";

export default {
  key: "terraform-create-run",
  name: "Create Run",
  description: "Creates a new run in Terraform. [See the documentation](https://developer.hashicorp.com/terraform/cloud-docs/api-docs/run#create-a-run)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    terraform,
    orgId: {
      propDefinition: [
        terraform,
        "orgId",
      ],
    },
    workspaceId: {
      propDefinition: [
        terraform,
        "workspaceId",
        (c) => ({
          orgId: c.orgId,
        }),
      ],
    },
    configurationVersion: {
      propDefinition: [
        terraform,
        "configurationVersion",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "Specifies the message associated with this run.",
      optional: true,
    },
    allowEmptyApply: {
      type: "boolean",
      label: "Allow Empty Apply",
      description: "Specifies whether Terraform can apply the run even when the plan [contains no changes](https://developer.hashicorp.com/terraform/cloud-docs/run/modes-and-options#allow-empty-apply). Often used to [upgrade state](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/state#upgrading-state) after upgrading a workspace to a new terraform version.",
    },
    allowConfigGeneration: {
      type: "boolean",
      label: "Allow Config Generation",
      description: "Specifies whether Terraform can [generate resource configuration](https://developer.hashicorp.com/terraform/language/import/generating-configuration) when planning to import new resources. If false, import blocks without a corresponding resource block will error.",
      optional: true,
    },
    autoApply: {
      type: "boolean",
      label: "Auto Apply",
      description: "Whether to automatically apply changes when a Terraform plan is successful. Defaults to the [Auto Apply](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings#auto-apply-and-manual-apply) workspace setting.",
      optional: true,
    },
    isDestroy: {
      type: "boolean",
      label: "Is Destroy",
      description: "Specifies whether this plan is a destroy plan that will destroy all provisioned resources. Mutually exclusive with `refresh-only`.",
      optional: true,
    },
    refresh: {
      type: "boolean",
      label: "Refresh",
      description: "Specifies whether or not to refresh the state before a plan.",
      optional: true,
    },
    refreshOnly: {
      type: "boolean",
      label: "Refresh Only",
      description: "Whether this run should refresh the state without modifying any resources. Mutually exclusive with `is-destroy`.",
      optional: true,
    },
    planOnly: {
      type: "boolean",
      label: "Plan Only",
      description: "Specifies if this is a [speculative, plan-only](https://developer.hashicorp.com/terraform/cloud-docs/run/modes-and-options#plan-only-speculative-plan) run that Terraform cannot apply. Often used in conjunction with terraform-version in order to test whether an upgrade would succeed.",
      optional: true,
    },
    savePlan: {
      type: "boolean",
      label: "Save Plan",
      description: "Specifies if this should be a saved plan run. Terraform can apply saved plan runs, but they perform their plan and checks without becoming the workspace's current run (like a plan-only run), and will only become the current run if you confirm them for apply. When creating new [configuration versions](https://developer.hashicorp.com/terraform/cloud-docs/api-docs/configuration-versions) for saved plan runs, be sure to make them `provisional`",
      optional: true,
    },
    terraformVersion: {
      type: "string",
      label: "Terraform Version",
      description: "Specifies the Terraform version to use in this run. Only valid for plan-only runs; must be a valid Terraform version available to the organization.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.terraform.createRun({
      data: {
        data: {
          attributes: {
            "message": this.message,
            "allow-empty-apply": this.allowEmptyApply,
            "allow-config-generation": this.allowConfigGeneration,
            "auto-apply": this.autoApply,
            "is-destroy": this.isDestroy,
            "refresh": this.refresh,
            "refresh-only": this.refreshOnly,
            "plan-only": this.planOnly,
            "save-plan": this.savePlan,
            "terraform-version": this.terraformVersion,
          },
          relationships: {
            workspace: {
              data: {
                id: this.workspaceId,
              },
            },
            configurationVersion: this.configurationVersion
              ? {
                data: {
                  id: this.configurationVersion,
                },
              }
              : undefined,
          },
        },
      },
      $,
    });

    if (data) {
      $.export("$summary", `Successfully created run with ID ${data.id}.`);
    }

    return data;
  },
};
