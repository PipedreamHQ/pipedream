import shortApp from "../../short.app.mjs";
import common from "../common/common.mjs";
import lodash from "lodash";

const {
  props: { // eslint-disable-next-line no-unused-vars
    domain, ...props
  },
} = common;

export default {
  key: "short-create-a-link",
  name: "Create Link",
  description: "Create a Short Link. [See the documentation](https://developers.short.io/reference/linkspost).",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortApp,
    domainId: {
      propDefinition: [
        shortApp,
        "domainId",
      ],
    },
    ...props,
    folderId: {
      propDefinition: [
        shortApp,
        "folderId",
        ({ domainId }) => ({
          domainId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const param = lodash.pick(this, [
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
      "folderId",
    ]);
    const { hostname: domain } = await this.shortApp.getDomainInfo(this.domainId);
    const link = await this.shortApp.createLink($, {
      domain,
      ...param,
    });
    $.export("$summary", `Successfully created the link: ${link.secureShortURL}`);
    return link;
  },
};
