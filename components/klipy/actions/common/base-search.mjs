import { LIMIT } from "../../common/constants.mjs";
import klipy from "../../klipy.app.mjs";

export default {
  props: {
    klipy,
    locale: {
      propDefinition: [
        klipy,
        "locale",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        klipy,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const model = this.getModel();
    const response = await this.klipy.search({
      $,
      model,
      data: {
        q: this.q,
        customer_id: this.customer_id,
        locale: this.locale,
        page: this.page,
        per_page: LIMIT,
      },
    });
    $.export("$summary", `Retrieved ${response.data.data.length} ${model}`);
    return response;
  },
};
