// x-pd-ai: optimized
import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-ticket",
  name: "Create Ticket",
  description:
    "Create a support ticket in HubSpot. Set **Ticket Name**, **Pipeline**, and **Pipeline Stage** (use **List Pipelines and Stages** for `tickets` to get valid ids), and put extra fields in **Object Properties**. Example: subject `Login broken`, hs_pipeline `0`, hs_pipeline_stage `1`, Object Properties `{ \"hs_ticket_priority\": \"HIGH\" }`. Returns the created ticket with its id. [See the documentation](https://developers.hubspot.com/docs/api/crm/tickets)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    subject: {
      type: "string",
      label: "Ticket Name",
      description: "The name of the ticket",
    },
    hs_pipeline: {
      propDefinition: [
        common.props.hubspot,
        "ticketPipeline",
      ],
    },
    hs_pipeline_stage: {
      propDefinition: [
        common.props.hubspot,
        "ticketStage",
        (c) => ({
          pipelineId: c.hs_pipeline,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.TICKET;
    },
  },
};
