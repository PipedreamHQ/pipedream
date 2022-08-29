import tookan from "../app/tookan.app";

export default {
  props: {
    tookan,
    additionalOptions: {
      propDefinition: [tookan, "additionalOptions"],
    },
    timezone: {
      propDefinition: [tookan, "timezone"],
    },
  },
};

/*
    customerAddress: {
      propDefinition: [tookan, "customerAddress"],
    },
    jobDeliveryDatetime: {
      propDefinition: [tookan, "jobDeliveryDatetime"],
    },
    jobPickupDatetime: {
      propDefinition: [tookan, "jobPickupDatetime"],
    },
    jobPickupAddress: {
      propDefinition: [tookan, "jobPickupAddress"],
    },
    */
