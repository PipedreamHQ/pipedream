import tapfiliate from "../../tapfiliate.app.mjs";

export default {
  key: "tapfiliate-add-commission-conversion",
  name: "Add Commission to Conversion",
  description: "Adds a new commission to an existing conversion. Used for managing recurring subscription workflows. [See the documentation](https://tapfiliate.com/docs/rest/#conversions-add-commissions-to-conversion)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tapfiliate,
    conversionId: {
      propDefinition: [
        tapfiliate,
        "conversionId",
      ],
    },
    conversionSubAmount: {
      type: "integer",
      label: "Conversion Sub Amount",
      description: "The amount on which the commission should be calculated using the supplied, or the program's default commission type",
    },
    commissionType: {
      type: "string",
      label: "Commission Type",
      description: "If no commission type is supplied, the programs default commission type is used",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for this commission. The comment will be visible to the affiliate",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      conversionId,
      conversionSubAmount,
      commissionType,
      comment,
    } = this;

    const data = {
      conversion_sub_amount: conversionSubAmount,
      ...(commissionType && {
        commission_type: commissionType,
      }),
      ...(comment && {
        comment,
      }),
    };
    const response = await this.tapfiliate.addCommissionToConversion({
      $,
      conversionId,
      data,
    });

    $.export("$summary", `Successfully added commission to conversion ${conversionId}`);

    return response;
  },
};
