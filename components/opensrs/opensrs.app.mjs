import { createHash } from "crypto";
import { XMLParser } from "fast-xml-parser";
import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

const parser = new XMLParser({
  ignoreAttributes: false,
  arrayMode: true,
  textNodeName: "value",
});

export default {
  type: "app",
  app: "opensrs",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name to register, update, or transfer.",
    },
  },
  methods: {
    getUrl() {
      const { api_host_port: url } = this.$auth;
      return url;
    },
    generateSignature(data) {
      const { api_key: apiKey } = this.$auth;
      const signature = createHash("md5")
        .update(data + apiKey)
        .digest("hex");
      return createHash("md5")
        .update(signature + apiKey)
        .digest("hex");
    },
    getHeaders(data, headers) {
      const { reseller_username: username } = this.$auth;
      return {
        ...headers,
        "Content-Type": "text/xml",
        "X-Username": username,
        "X-Signature": this.generateSignature(data),
      };
    },
    throwIfError(jsonResponse) {
      const { item: items } =  jsonResponse?.OPS_envelope?.body?.data_block?.dt_assoc || {};
      const attributes = items?.find((item) => item["@_key"] === "attributes");
      const { item: errorItems } = attributes?.dt_assoc || {};
      const errorItem = errorItems?.find((item) => item["@_key"] === "error");
      if (errorItem) {
        throw new Error(errorItem.value);
      }

      const isSuccessItem = items?.find((item) => item["@_key"] === "is_success");
      const responseTextItem = items?.find((item) => item["@_key"] === "response_text");

      if (isSuccessItem?.value === 0 && responseTextItem) {
        console.log("response", JSON.stringify(jsonResponse, null, 2));
        throw new Error(responseTextItem.value);
      }
    },
    async _makeRequest({
      $ = this, jsonBody, headers, jsonOutput = true, ...args
    } = {}) {
      const data = utils.buildXmlData(jsonBody);

      const response = await axios($, {
        ...args,
        url: this.getUrl(),
        headers: this.getHeaders(data, headers),
        data,
      });

      const jsonResponse = parser.parse(response);
      this.throwIfError(jsonResponse);

      return jsonOutput
        ? jsonResponse
        : response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
