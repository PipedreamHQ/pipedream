import charthop from "../../charthop.app.mjs";

export default {
  key: "charthop-update-employee-details",
  name: "Update Employee Details",
  description: "Updates an existing employee's details. [See the documentation](https://api.charthop.com/swagger#/user/updateUser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    charthop,
    orgId: {
      propDefinition: [
        charthop,
        "orgId",
      ],
    },
    employeeId: {
      propDefinition: [
        charthop,
        "employeeId",
        (c) => ({
          orgId: c.orgId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.employeeId || !this.orgId) {
      return props;
    }

    const employee = await this.charthop.getPerson({
      orgId: this.orgId,
      personId: this.employeeId,
    });

    for (const [
      key,
      value,
    ] of Object.entries(employee)) {
      if (key === "id") {
        continue;
      }
      props[key] = {
        type: "string",
        label: `${key}`,
        default: key === "name"
          ? (`${value?.first} ${value?.last}`).trim()
          : `${value}`,
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      charthop,
      orgId,
      employeeId,
      ...fields
    } = this;

    await charthop.updatePerson({
      $,
      orgId,
      personId: employeeId,
      data: {
        ...fields,
      },
    });

    const response = await charthop.getPerson({
      $,
      orgId,
      personId: employeeId,
    });

    $.export("$summary", `Successfully updated employee with ID ${employeeId}`);
    return response;
  },
};
