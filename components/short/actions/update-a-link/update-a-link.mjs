import shortApp from "../../short.app.mjs";
import common from "../common.mjs";
import lodash from "lodash";

export default {
  key: "short-update-a-link",
  name: "Update a Short Link.",
  description: "Update original url, title or path for existing URL by id. [See the docs](https://developers.short.io/reference/linksbylinkidpost).",
  version: "0.0.1",
  type: "action",
  props: {
    shortApp,
    domainId: {
      propDefinition: [
        shortApp,
        "domainId",
      ],
    },
    linkIdString: {
      propDefinition: [
        shortApp,
        "link",
        ({ domainId }) => ({
          domainId,
        }),
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const param = lodash.pick(this, [
      "domain",
      "originalURL",
      "path",
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
    const link = await this.shortApp.updateLink($, this.linkIdString, param);
    $.export("$summary", `Successfully updated the link: ${link.secureShortURL}`);
    return link;
  },
};
