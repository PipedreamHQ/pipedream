import shortApp from "../../short.app.mjs";
import common from "../common/common.mjs";
import lodash from "lodash";

export default {
  key: "short-create-a-link",
  name: "Create a Short Link",
  description: "Create a Short Link. [See the docs](https://developers.short.io/reference/linkspost).",
  version: "0.0.1",
  type: "action",
  props: {
    shortApp,
    ...common.props,
  },
  async run({ $ }) {
    const param = lodash.pick(this, [
      "domain",
      "originalURL",
      "path",
      "title",
      "tags",
      "allowDuplicates",
      "expiresAt",
      "expiredURL",
      "iphoneURL",
      "androidURL",
      "password",
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "utmTerm",
      "utmContent",
      "cloaking",
      "redirectType",
    ]);
    const link = await this.shortApp.createLink($, param);
    $.export("$summary", `Successfully created the link: ${link.secureShortURL}`);
    return link;
  },
};
