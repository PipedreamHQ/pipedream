import lnkBio from "../../lnk_bio.app.mjs";
import querystring from "querystring";

export default {
  key: "lnk_bio-delete-link",
  name: "Delete Link",
  description: "Deletes an existing link in lnk.bio. [See the documentation](https://app.swaggerhub.com/apis/lnkbio/Lnk.Bio/0.0.2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lnkBio,
    linkId: {
      propDefinition: [
        lnkBio,
        "linkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lnkBio.deleteLink({
      $,
      data: querystring.stringify({
        link_id: this.linkId,
      }),
    });

    $.export("$summary", `Successfully deleted link with ID ${this.linkId}`);
    return response;
  },
};
