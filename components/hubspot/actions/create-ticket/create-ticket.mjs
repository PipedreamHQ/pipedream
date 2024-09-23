import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-ticket",
  name: "Create Ticket",
  description: "Create a ticket in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/tickets)",
  version: "0.0.3",
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
    isDefaultProperty(property) {
      return property.name === "subject"
        || property.name === "hs_pipeline"
        || property.name === "hs_pipeline_stage";
    },
  },
};
