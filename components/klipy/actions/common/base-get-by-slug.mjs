import klipy from "../../klipy.app.mjs";

export default {
  props: {
    klipy,
    customerId: {
      propDefinition: [
        klipy,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const model = this.getModel();
    const response = await this.klipy.search({
      $,
      model,
      slug: this.slug,
      data: {
        customer_id: this.customerId,
      },
    });

    $.export("$summary", `Successfully fetched ${model}.`);
    return response;
  },
};
