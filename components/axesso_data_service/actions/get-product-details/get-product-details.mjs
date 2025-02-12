import axesso_data_service from "../../axesso_data_service.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "axesso_data_service-get-product-details",
  name: "Get Product Details",
  description: "Requests product detail information. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    axesso_data_service: {
      type: "app",
      app: "axesso_data_service",
    },
    url: {
      propDefinition: [
        axesso_data_service,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.axesso_data_service.requestProductDetail({
      url: this.url,
    });
    $.export("$summary", `Retrieved product details for URL: ${this.url}`);
    return response;
  },
};
