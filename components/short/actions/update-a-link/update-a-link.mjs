import shortApp from "../../short.app.mjs";
import common from "../common/common.mjs";
import lodash from "lodash";

export default {
  key: "short-update-a-link",
  name: "Update Link",
  description: "Update original URL, title or path for existing URL by id. [See the documentation](https://developers.short.io/reference/linksbylinkidpost).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    ...common.props,
  },
  async run({ $ }) {
    const url = new URL(this.shortLink);
    const domain = url.host;
    const path = url.pathname.split("/").join("");
    const linkInfo = await this.shortApp.getLinkInfo(domain, path);

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

    const link = await this.shortApp.updateLink($, linkInfo.idString, param);
    $.export("$summary", `Successfully updated the link: ${link.secureShortURL}`);
    return link;
  },
};
