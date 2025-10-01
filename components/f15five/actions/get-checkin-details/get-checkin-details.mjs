import f15five from "../../f15five.app.mjs";

export default {
  key: "f15five-get-checkin-details",
  name: "Get Checkin Details",
  description: "Get check-in object details. [See the documentation](https://my.15five.com/api/public/#tag/Check-in/paths/~1api~1public~1report~1%7Bid%7D~1/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    f15five,
    user: {
      propDefinition: [
        f15five,
        "user",
      ],
      optional: true,
    },
    checkin: {
      propDefinition: [
        f15five,
        "checkin",
        (c) => ({
          userId: c.user,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.f15five.getCheckin({
      checkinId: this.checkin,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved checkin with ID ${response.id}`);
    }

    return response;
  },
};
