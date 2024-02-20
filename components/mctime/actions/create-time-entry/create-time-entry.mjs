import mctime from "../../mctime.app.mjs";

export default {
  key: "mctime-create-time-entry",
  name: "Create Time Entry",
  description: "Create a new time entry in McTime. [See the documentation](https://mctime.readme.io/reference/add-time-entry)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mctime,
    userId: mctime.propDefinitions.userId,
    dateTime: mctime.propDefinitions.dateTime,
    action: mctime.propDefinitions.action,
    timeType: mctime.propDefinitions.timeType,
    comment: mctime.propDefinitions.comment,
    organizationName: mctime.propDefinitions.organizationName,
    organizationId: mctime.propDefinitions.organizationId,
  },
  async run({ $ }) {
    const organization = this.organizationName
      ? {
        organizationName: this.organizationName,
      }
      : {
        organizationId: this.organizationId,
      };

    const response = await this.mctime.createTimeEntry({
      data: {
        userId: this.userId,
        dateTime: this.dateTime,
        action: this.action,
        timeType: this.timeType,
        comment: this.comment,
        organizationName: organization.organizationName,
        organizationId: organization.organizationId,
      },
    });

    $.export("$summary", `Created time entry with ID: ${response.id}`);
    return response;
  },
};
