// x-pd-ai: optimized
import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-deal",
  name: "Create Deal",
  description:
    "Create a deal in HubSpot. Set **Deal Name**, **Pipeline**, and **Stage**, and put any extra fields in **Object Properties** as HubSpot internal names. Example: Deal Name `InGen Annual Contract`, Pipeline `default`, Stage `appointmentscheduled`, Object Properties `{ \"amount\": \"250000\", \"closedate\": \"2026-09-23\" }`. Returns the created deal with its id. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=POST-/crm/v3/objects/deals)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    dealname: {
      type: "string",
      label: "Deal Name",
      description: "Name of the deal",
    },
    pipeline: {
      propDefinition: [
        common.props.hubspot,
        "dealPipeline",
      ],
      description: "Pipeline of the deal",
    },
    dealstage: {
      propDefinition: [
        common.props.hubspot,
        "stages",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
      type: "string",
      description: "Stage of the deal",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
  },
};
