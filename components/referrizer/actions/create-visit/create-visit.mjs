import { ConfigurationError } from "@pipedream/platform";
import referrizer from "../../referrizer.app.mjs";

export default {
  key: "referrizer-create-visit",
  name: "Create Visit",
  description: "Create a visit to an existing contact in Referrizer. [See the documentation](https://api.referrizer.com/static/docs/index.html#operation/inviteContact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    referrizer,
    contactId: {
      propDefinition: [
        referrizer,
        "contactId",
      ],
    },
    points: {
      type: "integer",
      label: "Points",
      description: "Loyalty points to be earned. If not provided, the number of earned points will depend on your Loyalty settings.",
      optional: true,
    },
    amountSpent: {
      type: "integer",
      label: "Amount Spent",
      description: "Dollar amount spent connected to Earning Points value. E.g. if $1 is 1pts and when contact spent $25 they will get 25pts. This is related to loyalty settings value 'pointsPerDollar'.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date and time of the visit in this request with the format 'YYYY-MM-DDTHH:MM:SS.SSSZ'. E.g. 2022-01-19T16:16:24.000Z. Date must be in the past. If the date is set a notification for the visit will not be sent.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.points && this.amountSpent) {
      throw new ConfigurationError("You must provide either Points or Amount Spent.");
    }
    const {
      referrizer,
      ...data
    } = this;

    const response = await referrizer.createVisit({
      $,
      data,
    });

    $.export("$summary", `Successfully created visit with ID: ${response.id}`);
    return response;
  },
};
