import shortApp from "../../short.app.mjs";
import lodash from "lodash";

export default {
  key: "short-expire-a-link",
  name: "Expire Link",
  description: "Expire a short link by id. [See the documentation](https://developers.short.io/reference/linksbylinkidpost).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortApp,
    shortLink: {
      propDefinition: [
        shortApp,
        "link",
      ],
    },
    expiresAt: {
      propDefinition: [
        shortApp,
        "expiresAt",
      ],
      optional: false,
    },
    expiredURL: {
      propDefinition: [
        shortApp,
        "expiredURL",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const url = new URL(this.shortLink);
    const domain = url.host;
    const path = url.pathname.split("/").join("");
    const linkInfo = await this.shortApp.getLinkInfo(domain, path);

    const param = lodash.pick(linkInfo, [
      "domain",
      "originalURL",
      "path",
      "title",
      "tags",
      "allowDuplicates",
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

    param.expiresAt = this.expiresAt;
    param.expiredURL = this.expiredURL;

    const link = await this.shortApp.updateLink($, linkInfo.idString, param);
    $.export("$summary", `Successfully updated the link: ${link.secureShortURL}`);
    return link;
  },
};
