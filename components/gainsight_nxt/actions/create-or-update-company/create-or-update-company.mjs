import { parseObjectEntries } from "../../common/utils.mjs";
import app from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-company",
  name: "Create or Update Company",
  description: "Create or update a company record. [See the documentation](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Company_and_Relationship_API/Company_API_Documentation#Parameters)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company. If a company record with this name exists, it will be updated, otherwise a new one will be created.",
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry name of the company.",
      optional: true,
    },
    arr: {
      type: "string",
      label: "Annual Recurring Revenue (ARR)",
      description: "The annual recurring revenue of the company, as a currency value.",
      optional: true,
    },
    employees: {
      type: "integer",
      label: "Employees",
      description: "The number of employees the company has.",
      optional: true,
    },
    lifecycleInWeeks: {
      type: "integer",
      label: "Life Cycle in Weeks",
      description: "The number of weeks the entire process goes through.",
      optional: true,
    },
    originalContractDate: {
      type: "string",
      label: "Original Contract Date",
      description: "The date the engagement with the client started, in `YYYY-MM-DD` format.",
      optional: true,
    },
    renewalDate: {
      type: "string",
      label: "Renewal Date",
      description: "The upcoming renewal date of the contract, in `YYYY-MM-DD` format.",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The current stage of the company in the sales pipeline.",
      optional: true,
      options: [
        "New Customer",
        "Kicked Off",
        "Launched",
        "Adopting",
        "Will Churn",
        "Churn",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The current status of the company.",
      optional: true,
      options: [
        "Active",
        "Inactive",
        "Churn",
      ],
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Company_and_Relationship_API/Company_API_Documentation#Parameters) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      records: [
        {
          Name: this.name,
          Industry: this.industry,
          ARR: this.arr,
          Employees: this.employees,
          LifecycleInWeeks: this.lifecycleInWeeks,
          OriginalContractDate: this.originalContractDate,
          RenewalDate: this.renewalDate,
          Stage: this.stage,
          Status: this.status,
          ...(this.additionalOptions && parseObjectEntries(this.additionalOptions)),
        },
      ],
    };

    let summary = "";
    let result;
    try {
      const updateReq = await this.app.updateCompany({
        $,
        data,
      });
      result = updateReq;
      summary = updateReq.result === true
        ? `Successfully updated company '${this.name}'`
        : `Error updating company '${this.name}'`;
    }
    catch (err) {
      const createReq = await this.app.createCompany({
        $,
        data,
      });
      result = createReq;
      summary = createReq.result === true
        ? `Successfully created company '${this.name}'`
        : `Error creating company '${this.name}'`;
    }

    $.export(
      "$summary",
      summary,
    );
    return result;
  },
};
