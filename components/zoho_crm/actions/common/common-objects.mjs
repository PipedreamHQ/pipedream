import zohoCrm from "../../zoho_crm.app.mjs";
import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  props: {
    zohoCrm,
    moduleType: {
      type: "string",
      label: "Module",
      description: "Module type of the record. To enter a custom module, use a custom expression.",
      options: constants.OBJECT_MODULES,
      reloadProps: true,
    },
  },
  methods: {
    listFields(moduleType, $ = this) {
      return axios($, {
        url: `${this.zohoCrm.$auth.api_domain}/crm/v5/settings/fields?module=${moduleType}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.zohoCrm.$auth.oauth_access_token}`,
        },
      });
    },
    filterFields(fields, type = "create") {
      return fields.filter((field) =>
        !field.read_only
        && !field.system_mandatory
        && field.operation_type[`api_${type}`]
        && ![
          "picklist",
          "lookup",
          "ownerlookup",
          "profileimage",
        ].includes(field.data_type));
    },
    getType(dataType) {
      switch (dataType) {
      case "boolean":
        return "boolean";
      case "integer":
        return "integer";
      case "bigint":
        return "integer";
      default:
        return "string";
      }
    },
    getRequiredProps(moduleType, type = "create") {
      let props = {};
      if (moduleType === "Leads" || moduleType === "Contacts") {
        props = {
          lastName: {
            type: "string",
            label: "Last Name",
            description: `Last Name of new ${(moduleType === "Leads")
              ? "lead"
              : "contact"}`,
          },
        };
      }
      if (moduleType === "Accounts") {
        props = {
          accountName: {
            type: "string",
            label: "Account Name",
            description: "Name of new account",
          },
        };
      }
      if (moduleType === "Deals") {
        props = {
          dealName: {
            type: "string",
            label: "Deal Name",
            description: "Name of the new Deal",
          },
          stage: {
            type: "string",
            label: "Stage",
            description: "The stage of the new Deal",
            options: constants.DEAL_STAGES,
          },
        };
      }
      if (moduleType === "Tasks") {
        props = {
          subject: {
            type: "string",
            label: "Subject",
            description: "Subject of new task",
          },
        };
      }
      if (moduleType === "Calls") {
        props = {
          subject: {
            type: "string",
            label: "Subject",
            description: "Subject of new call",
          },
          callType: {
            type: "string",
            label: "Call Type",
            description: "Whether the call is inbound or outbound",
            options: constants.CALL_TYPES,
          },
          callStartTime: {
            type: "string",
            label: "Call Start Time",
            description: "The date and time (in ISO8601 format) at which the call starts",
          },
          callDuration: {
            type: "string",
            label: "Call Duration",
            description: "The duration of the call in mm:ss format",
          },
        };
      }
      if (moduleType === "Campaigns") {
        props = {
          campaignName: {
            type: "string",
            label: "Campaign Name",
            description: "Name of the new campaign",
          },
        };
      }
      if (type === "update") {
        Object.keys(props).forEach((key) => {
          props[key].optional = true;
        });
      }
      return props;
    },
    async getOptionalProps(moduleType, type = "create") {
      const props = {};
      const { fields } = await this.listFields(moduleType);
      for (const field of this.filterFields(fields, type)) {
        props[field.api_name] = {
          type: this.getType(field.data_type),
          label: field.display_label,
          optional: true,
        };
      }
      return props;
    },
  },
};
