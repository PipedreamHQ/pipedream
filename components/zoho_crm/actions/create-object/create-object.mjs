import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-create-object",
  name: "Create Object",
  description: "Create a new object/module entry. [See the docs here](https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html)",
  version: "0.2.3",
  type: "action",
  props: {
    zohoCrm,
    module: {
      propDefinition: [
        zohoCrm,
        "module",
      ],
    },
  },
  async additionalProps() {
    let props = {};
    if (this.module === "Leads" || this.module === "Contacts") {
      props = {
        firstName: {
          type: "string",
          label: "First Name",
          description: `First Name of new ${(this.module === "Leads")
            ? "lead"
            : "contact"}`,
          optional: true,
        },
        lastName: {
          type: "string",
          label: "Last Name",
          description: `Last Name of new ${(this.module === "Leads")
            ? "lead"
            : "contact"}`,
        },
        email: {
          type: "string",
          label: "Email Address",
          description: `Email Address of new ${(this.module === "Leads")
            ? "lead"
            : "contact"}`,
          optional: true,
        },
      };
    }
    if (this.module === "Accounts") {
      props = {
        accountName: {
          type: "string",
          label: "Account Name",
          description: "Name of new account",
        },
      };
    }
    if (this.module === "Deals") {
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
          options: [
            "Qualification",
            "Needs Analysis",
            "Value Proposition",
            "Identify Decision Makers",
            "Proposal/Price Quote",
            "Negotiation/Review",
            "Closed Won",
            "Closed Lost",
            "Closed-Lost to Competition",
          ],
        },
      };
    }
    if (this.module === "Tasks") {
      props = {
        subject: {
          type: "string",
          label: "Subject",
          description: "Subject of new task",
        },
      };
    }
    if (this.module === "Calls") {
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
          options: [
            "inbound",
            "outbound",
          ],
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
    if (this.module === "Campaigns") {
      props = {
        campaignName: {
          type: "string",
          label: "Campaign Name",
          description: "Name of the new campaign",
        },
      };
    }
    props = {
      ...props,
      additionalData: {
        type: "object",
        label: "Additional Data",
        description: "Additional values for new object",
        optional: true,
      },
    };
    return props;
  },
  async run({ $ }) {
    const props = this.zohoCrm.omitEmptyStringValues({
      First_Name: this.firstName,
      Last_Name: this.lastName,
      Email: this.email,
      Account_Name: this.accountName,
      Deal_Name: this.dealName,
      Stage: this.stage,
      Subject: this.subject,
      Call_Type: this.callType,
      Call_Start_Time: this.callStartTime,
      Call_Duration: this.callDuration,
      Campaign_Name: this.campaignName,
      ...this.additionalData,
    });
    const data = {
      data: [
        {
          ...props,
        },
      ],
    };
    const res = await this.zohoCrm.createObject(this.module, data, $);
    $.export("$summary", `Successfully created new ${this.module.substring(0, this.module.length - 1)}`);
    return res;
  },
};
