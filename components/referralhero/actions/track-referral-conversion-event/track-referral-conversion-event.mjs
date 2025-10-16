import referralhero from "../../referralhero.app.mjs";

export default {
  key: "referralhero-track-referral-conversion-event",
  name: "Track Referral Conversion Event",
  description: "Track a referral conversion event. Use when your Campaign Goal is set to track two or three conversion events. [See the documentation](https://support.referralhero.com/integrate/rest-api/endpoints-reference#track-referral-conversion-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    referralhero,
    listId: {
      propDefinition: [
        referralhero,
        "listId",
      ],
    },
    subscriber: {
      propDefinition: [
        referralhero,
        "subscriber",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    referrer: {
      type: "string",
      label: "Referrer",
      description: "The unique identifier of the referrer",
    },
  },
  async run({ $ }) {
    const response = await this.referralhero.trackReferralConversionEvent({
      listId: this.listId,
      params: {
        email: this.subscriber,
        referrer: this.referrer,
      },
      $,
    });

    if (response?.status === "error") {
      throw new Error(response.message);
    }

    if (response?.data?.id) {
      $.export("$summary", `Successfully tracked referral conversion event for subscriber with ID ${response.data.id}.`);
    }

    return response;
  },
};
