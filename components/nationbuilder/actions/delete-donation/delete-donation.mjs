import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-delete-donation",
  name: "Delete Donation",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a specific donation with the provided Id. [See the documentation](https://nationbuilder.com/donations_api)",
  type: "action",
  props: {
    nationbuilder,
    donationId: {
      propDefinition: [
        nationbuilder,
        "donationId",
      ],
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      donationId,
    } = this;

    const response = await nationbuilder.deleteDonation({
      $,
      donationId,
    });

    $.export("$summary", `The donation with Id: ${donationId} was successfully deleted!`);
    return response;
  },
};
