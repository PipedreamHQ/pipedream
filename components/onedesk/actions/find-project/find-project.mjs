import app from "../../onedesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "onedesk-find-project",
  name: "Find Project",
  description: "Search for a project/space by name or ID. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    creationTimeValue: {
      type: "string",
      label: "Creation Time Value",
      description: "Project creation date. Eg. `2024-01-28`",
    },
    creationTimeOperator: {
      type: "string",
      label: "Creation Time Operator",
      description: "Project creation date operator",
      optional: true,
      options: Object.values(constants.DATE_OPERATOR),
    },
    invoiceType: {
      label: "Invoice Type",
      description: "Type of invoice. Eg. `flat fee`",
      propDefinition: [
        app,
        "invoice",
      ],
    },
    dueDateValue: {
      type: "string",
      label: "Due Date Value",
      description: "Due date of project. Eg. `2024-01-28`",
      optional: true,
    },
    dueDateOperator: {
      type: "string",
      label: "Due Date Operator",
      description: "Due date of project operator",
      optional: true,
      options: Object.values(constants.DATE_OPERATOR),
    },
  },
  async run({ $ }) {
    const {
      app,
      creationTimeValue,
      creationTimeOperator,
      invoiceType,
      dueDateValue,
      dueDateOperator,
    } = this;

    const properties = [
      {
        property: "creationTime",
        operation: creationTimeOperator || constants.DATE_OPERATOR.LT.value,
        value: creationTimeValue,
      },
      {
        property: "invoiceType",
        operation: "EQ",
        value: invoiceType,
      },
      {
        property: "dueDate",
        operation: dueDateOperator || constants.DATE_OPERATOR.LT.value,
        value: dueDateValue,
      },
    ];

    const results = await app.paginate({
      resourcesFn: app.filterProjectDetails,
      resourcesFnArgs: {
        $,
        data: {
          properties: properties.filter(({ value }) => value),
          isAsc: false,
        },
      },
      resourceName: "data",
    });

    if (!results.length) {
      $.export("$summary", "No projects found.");
    } else {
      $.export("$summary", `Found \`${results.length}\` matching project(s).`);
    }

    return results;
  },
};
