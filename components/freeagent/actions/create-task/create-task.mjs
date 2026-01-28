import {
  BILLING_PERIOD_OPTIONS,
  STATUS_OPTIONS,
} from "../../common/constants.mjs";
import { getId } from "../../common/utils.mjs";
import freeagent from "../../freeagent.app.mjs";

export default {
  key: "freeagent-create-task",
  name: "Create Task",
  description: "Create a task under a specific project in FreeAgent. [See the documentation](https://dev.freeagent.com/docs/tasks#create-a-task-under-a-certain-project).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freeagent,
    projectId: {
      propDefinition: [
        freeagent,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
      description: "The name of the task.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "[Currency](https://dev.freeagent.com/docs/currencies) code of the project (e.g. USD, GBP, EUR, …)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task.",
      optional: true,
      options: STATUS_OPTIONS,
    },
    isBillable: {
      type: "boolean",
      label: "Is Billable",
      description: "`true` if charging your clients for the task, `false` otherwise",
      optional: true,
    },
    isDeletable: {
      type: "boolean",
      label: "Is Deletable",
      description: "`true` if this task can be deleted, `false` otherwise",
      optional: true,
    },
    billingRate: {
      type: "string",
      label: "Billing Rate",
      description: "The rate at which the [project](https://dev.freeagent.com/docs/projects) is billed, per `billing_period` E.g. `10.5`",
      optional: true,
    },
    billingPeriod: {
      type: "string",
      label: "Billing Period",
      description: "How the charge is calculated",
      optional: true,
      options: BILLING_PERIOD_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.freeagent.createTask({
      $,
      params: {
        project: this.projectId,
      },
      data: {
        name: this.name,
        currency: this.currency,
        status: this.status,
        is_billable: this.isBillable,
        is_deletable: this.isDeletable,
        billing_rate: this.billingRate && parseFloat(this.billingRate),
        billing_period: this.billingPeriod,
      },
    });

    $.export("$summary", `Successfully created task with ID: \`${getId(response.task.url)}\``);
    return response;
  },
};

