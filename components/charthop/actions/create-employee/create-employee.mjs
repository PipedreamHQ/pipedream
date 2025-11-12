import charthop from "../../charthop.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "charthop-create-employee",
  name: "Create Employee",
  description: "Adds a new employee to the system. [See the documentation](https://api.charthop.com/swagger#/person/createPerson)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of the employee",
    },
    additionalProperties: {
      type: "object",
      label: "Additional Properties",
      description: "Additional properties to add to the employee",
      optional: true,
    },
  },
  async run({ $ }) {
    const additionalProperties = this.additionalProperties
      ? parseObject(this.additionalProperties)
      : {};

    const response = await this.charthop.createPerson({
      $,
      orgId: this.orgId,
      data: {
        name: this.name,
        ...additionalProperties,
      },
    });

    $.export("$summary", `Successfully created employee with ID: ${response.id}`);
    return response;
  },
};
