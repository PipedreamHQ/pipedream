import { parseObject } from "../../common/utils.mjs";
import l2s from "../../l2s.app.mjs";

export default {
  key: "l2s-create-shortened-url",
  name: "Create Shortened URL",
  description: "Generates a shortened URL utilizing L2S capabilities. [See the documentation](https://docs.l2s.is/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    l2s,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be shortened",
    },
    customKey: {
      type: "string",
      label: "Custom Key",
      description: "Custom key for the shortened URL",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "UTM source parameter",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "UTM medium parameter",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "UTM campaign parameter",
      optional: true,
    },
    utmTerm: {
      type: "string",
      label: "UTM Term",
      description: "UTM term parameter",
      optional: true,
    },
    utmContent: {
      type: "string",
      label: "UTM Content",
      description: "UTM content parameter",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for the shortened URL",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the URL",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      l2s,
      tags,
      ...data
    } = this;

    if (tags) {
      data.tags = parseObject(tags);
    }

    const { response: { data: response } } = await l2s.shortenUrl({
      $,
      data,
    });

    const shortUrl = `https://l2s.is/${response.key}`;
    $.export("$summary", "URL shortened successfully");
    return {
      short_url: shortUrl,
      ...response,
    };
  },
};
