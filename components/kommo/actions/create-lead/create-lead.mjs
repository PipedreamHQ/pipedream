import { parseObject } from "../../common/utils.mjs";
import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in the Kommo app. [See the documentation](https://www.kommo.com/developers/content/api_v4/leads-api/#leads-add)",
  version: "0.0.1",
  type: "action",
  props: {
    kommo,
    name: {
      type: "string",
      label: "Name",
      description: "Lead name.",
      optional: true,
    },
    price: {
      type: "integer",
      label: "Price",
      description: "Lead sale.",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        kommo,
        "pipelineId",
      ],
      optional: true,
    },
    statusId: {
      propDefinition: [
        kommo,
        "statusId",
        ({ pipelineId }) => ({
          pipelineId,
        }),
      ],
      optional: true,
    },
    customFieldsValues: {
      propDefinition: [
        kommo,
        "customFieldsValues",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.createLead({
      $,
      data: [
        {
          name: this.name,
          price: this.price,
          status_id: this.statusId,
          pipeline_id: this.pipelineId,
          custom_fields_values: parseObject(this.customFieldsValues),
        },
      ],
    });

    $.export("$summary", `Successfully created lead with ID: ${response?._embedded?.leads[0]?.id}`);
    return response?._embedded?.leads[0];
  },
};
