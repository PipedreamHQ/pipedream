import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-set-sql-warehouse-config",
  name: "Set SQL Warehouse Config",
  description: "Updates the global configuration for SQL Warehouses. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/setworkspacewarehouseconfig)",
  version: "0.0.3",
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
      description: "Channel details. Example: `{ \"name\": \"CHANNEL_NAME_CUSTOM\", \"dbsql_version\": \"2023.35\" }`",
      optional: true,
    },
    enabledWarehouseTypes: {
      type: "string[]",
      label: "Enabled Warehouse Types",
      description: "Specify which warehouse types are enabled. Example item: `{ \"warehouse_type\": \"PRO\", \"enabled\": true }`",
      optional: true,
    },
    configParam: {
      type: "object",
      label: "Config Parameters",
      description: "General config key/value pairs. Example item: `{ \"key\": \"some.config\", \"value\": \"true\" }`",
      optional: true,
    },
    globalParam: {
      type: "object",
      label: "Global Parameters",
      description: "Global config key/value pairs applied to all warehouses.",
      optional: true,
    },
    sqlConfigurationParameters: {
      type: "object",
      label: "SQL Configuration Parameters",
      description: "SQL-specific configuration key/value pairs.",
      optional: true,
    },
    dataAccessConfig: {
      type: "object",
      label: "Data Access Config",
      description: "Key/value pairs for data access configuration (e.g., credentials passthrough, external storage access).",
      optional: true,
    },
  },
  async run({ $ }) {
    const current = await this.databricks.getSQLWarehouseConfig({
      $,
    });
    const allowed = [
      "enable_serverless_compute",
      "instance_profile_arn",
      "google_service_account",
      "security_policy",
      "channel",
      "enabled_warehouse_types",
      "config_param",
      "global_param",
      "sql_configuration_parameters",
      "data_access_config",
    ];
    const payload = Object.fromEntries(
      Object.entries(current || {}).filter(([
        k,
      ]) => allowed.includes(k)),
    );

    if (this.instanceProfileArn !== undefined) {
      payload.instance_profile_arn = this.instanceProfileArn;
    }
    if (this.googleServiceAccount !== undefined) {
      payload.google_service_account = this.googleServiceAccount;
    }
    if (this.securityPolicy !== undefined) {
      payload.security_policy = this.securityPolicy;
    }
    if (this.channel !== undefined) {
      payload.channel = utils.parseObject(this.channel);
    }
    const enabledWarehouseTypes = utils.parseObject(this.enabledWarehouseTypes);
    if (Array.isArray(enabledWarehouseTypes) && enabledWarehouseTypes.length) {
      payload.enabled_warehouse_types = enabledWarehouseTypes.map((item, idx) => {
        let obj = item;
        if (typeof item === "string") {
          try { obj = JSON.parse(item); } catch (e) {
            throw new ConfigurationError(`enabledWarehouseTypes[${idx}] must be valid JSON: ${e.message}`);
          }
        }
        if (!obj || typeof obj !== "object") {
          throw new ConfigurationError(`enabledWarehouseTypes[${idx}] must be an object with { "warehouse_type": string, "enabled": boolean }`);
        }
        const {
          warehouse_type, enabled,
        } = obj;
        if (typeof warehouse_type !== "string" || typeof enabled !== "boolean") {
          throw new ConfigurationError(`enabledWarehouseTypes[${idx}] invalid shape; expected { "warehouse_type": string, "enabled": boolean }`);
        }
        return {
          warehouse_type,
          enabled: Boolean(enabled),
        };
      });
    }
    const configParam = utils.parseObject(this.configParam);
    if (Array.isArray(configParam) && configParam.length) {
      payload.config_param = {
        configuration_pairs: configParam,
      };
    }
    const globalParam = utils.parseObject(this.globalParam);
    if (Array.isArray(globalParam) && globalParam.length) {
      payload.global_param = {
        configuration_pairs: globalParam,
      };
    }
    const sqlConfigurationParameters = utils.parseObject(this.sqlConfigurationParameters);
    if (Array.isArray(sqlConfigurationParameters) && sqlConfigurationParameters.length) {
      payload.sql_configuration_parameters = {
        configuration_pairs: sqlConfigurationParameters,
      };
    }
    const dataAccessConfig = utils.parseObject(this.dataAccessConfig);
    if (Array.isArray(dataAccessConfig) && dataAccessConfig.length) {
      payload.data_access_config = dataAccessConfig;
    }
    const response = await this.databricks.setSQLWarehouseConfig({
      data: payload,
      $,
    });

    $.export("$summary", "Successfully updated SQL Warehouse configuration");
    return response;
  },
};
