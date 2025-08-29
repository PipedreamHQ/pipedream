import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-set-sql-warehouse-config",
  name: "Set SQL Warehouse Config",
  description: "Updates the global configuration for SQL Warehouses. [See docs](https://docs.databricks.com/api/workspace/warehouses/setworkspacewarehouseconfig)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    instanceProfileArn: {
      type: "string",
      label: "Instance Profile ARN",
      description: "Instance profile ARN used to pass an IAM role to clusters (AWS).",
      optional: true,
    },
    googleServiceAccount: {
      type: "string",
      label: "Google Service Account",
      description: "Service account email used for GCP workspaces, if applicable.",
      optional: true,
    },
    securityPolicy: {
      type: "string",
      label: "Security Policy",
      description: "Workspace-wide security policy for SQL Warehouses (if applicable).",
      options: [
        "NONE",
        "DATA_ACCESS_CONTROL",
        "PASSTHROUGH",
      ],
      optional: true,
    },
    channel: {
      type: "object",
      label: "Channel",
      description: "Channel details. Example: `{ \"name\": \"CHANNEL_NAME_PREVIEW\", \"dbsql_version\": \"2023.35\" }`",
      optional: true,
    },
    enabledWarehouseTypes: {
      type: "object[]",
      label: "Enabled Warehouse Types",
      description: "Specify which warehouse types are enabled. Example item: `{ \"warehouse_type\": \"PRO\", \"enabled\": true }`",
      properties: {
        warehouse_type: {
          type: "string",
          label: "Warehouse Type",
          options: [
            "TYPE_UNSPECIFIED",
            "CLASSIC",
            "PRO",
          ],
        },
        enabled: {
          type: "boolean",
          label: "Enabled",
        },
      },
      optional: true,
    },
    configParam: {
      type: "object[]",
      label: "Config Parameters",
      description: "General config key/value pairs. Example item: `{ \"key\": \"some.config\", \"value\": \"true\" }`",
      properties: {
        key: {
          type: "string",
          label: "Key",
        },
        value: {
          type: "string",
          label: "Value",
        },
      },
      optional: true,
    },
    globalParam: {
      type: "object[]",
      label: "Global Parameters",
      description: "Global config key/value pairs applied to all warehouses.",
      properties: {
        key: {
          type: "string",
          label: "Key",
        },
        value: {
          type: "string",
          label: "Value",
        },
      },
      optional: true,
    },
    sqlConfigurationParameters: {
      type: "object[]",
      label: "SQL Configuration Parameters",
      description: "SQL-specific configuration key/value pairs.",
      properties: {
        key: {
          type: "string",
          label: "Key",
        },
        value: {
          type: "string",
          label: "Value",
        },
      },
      optional: true,
    },
    dataAccessConfig: {
      type: "object[]",
      label: "Data Access Config",
      description: "Key/value pairs for data access configuration (e.g., credentials passthrough, external storage access).",
      properties: {
        key: {
          type: "string",
          label: "Key",
        },
        value: {
          type: "string",
          label: "Value",
        },
      },
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {};

    if (this.instanceProfileArn) payload.instance_profile_arn = this.instanceProfileArn;
    if (this.googleServiceAccount) payload.google_service_account = this.googleServiceAccount;
    if (this.securityPolicy) payload.security_policy = this.securityPolicy;
    if (this.channel) payload.channel = this.channel;

    if (Array.isArray(this.enabledWarehouseTypes) && this.enabledWarehouseTypes.length) {
      payload.enabled_warehouse_types = this.enabledWarehouseTypes.map((item) => ({
        warehouse_type: item.warehouse_type,
        enabled: Boolean(item.enabled),
      }));
    }
    if (Array.isArray(this.configParam) && this.configParam.length) {
      payload.config_param = {
        configuration_pairs: this.configParam,
      };
    }
    if (Array.isArray(this.globalParam) && this.globalParam.length) {
      payload.global_param = {
        configuration_pairs: this.globalParam,
      };
    }
    if (Array.isArray(this.sqlConfigurationParameters) && this.sqlConfigurationParameters.length) {
      payload.sql_configuration_parameters = {
        configuration_pairs: this.sqlConfigurationParameters,
      };
    }
    if (Array.isArray(this.dataAccessConfig) && this.dataAccessConfig.length) {
      payload.data_access_config = this.dataAccessConfig;
    }
    const response = await this.databricks.setSQLWarehouseConfig({
      data: payload,
      $,
    });

    $.export("$summary", "Successfully updated SQL Warehouse configuration");
    return response;
  },
};
