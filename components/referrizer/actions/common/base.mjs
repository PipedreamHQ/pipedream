import referrizer from "../../referrizer.app.mjs";

export default {
  props: {
    referrizer,
    points: {
      propDefinition: [
        referrizer,
        "points",
      ],
    },
    quantityTotal: {
      propDefinition: [
        referrizer,
        "quantityTotal",
      ],
      optional: true,
    },
    quantityPerContact: {
      propDefinition: [
        referrizer,
        "quantityPerContact",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        referrizer,
        "startDate",
      ],
      optional: true,
    },
    itemId: {
      propDefinition: [
        referrizer,
        "itemId",
      ],
      optional: true,
    },
    itemName: {
      propDefinition: [
        referrizer,
        "itemName",
      ],
      optional: true,
    },
    expires: {
      propDefinition: [
        referrizer,
        "expires",
      ],
      optional: true,
      reloadProps: true,
    },
    type: {
      propDefinition: [
        referrizer,
        "type",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.type && this.type != "ITEM") {
      props.value =  {
        type: "integer",
        label: "Value",
        description: "The value of the loyalty reward",
      };
    }
    if (this.expires) {
      props.expiredDate = {
        type: "string",
        label: "Expire Date",
        description: "Expiration date of loyalty reward. `Format YYYY-MM-DDTHH:MM:SS.SSSZ`",
      };
    }
    return props;
  },
};
