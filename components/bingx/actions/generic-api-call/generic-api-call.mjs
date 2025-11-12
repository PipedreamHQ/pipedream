import bingx from "../../bingx.app.mjs";
import {
  VERSION_2_PATH, VERSION_3_PATH,
} from "../../common.mjs";

export default {
  name: "BingX Generic API Call",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bingx-generic-api-call",
  description: "Make any API call for Bingx Futures as per the documentation. [See the documentation](https://bingx-api.github.io/docs/#/swapV2/account-api.html)",
  props: {
    bingx,
    httpMethod: {
      label: "HTTP Method",
      description: "HTTP Method as per API documentation",
      type: "string",
      options: [
        "GET",
        "DELETE",
        "POST",
        "PUT",
      ],
      default: "GET",
    },
    apiPath: {
      label: "API Path",
      description: "Ex. /quote/contracts",
      type: "string",
    },
    apiVersion: {
      type: "string",
      label: "API Version",
      description: "The API version the path belongs to",
      options: [
        {
          label: "Version 2",
          value: VERSION_2_PATH,
        },
        {
          label: "Version 3",
          value: VERSION_3_PATH,
        },
      ],
    },
    params: {
      label: "Parameters",
      description: "API Parameters",
      type: "object",
      optional: true,
    },
  },
  type: "action",
  async run({ $ }) {
    if (!this.apiPath.startsWith("/")) {
      throw new Error("Api Path property should always start with `/` as a path like string");
    }
    const returnValue = await this.bingx.makeRequest({
      path: this.apiPath,
      version: this.apiVersion,
      method: this.httpMethod,
      params: this.params,
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Bingx Futures custom action successful");
    }
    return returnValue;
  },
};
