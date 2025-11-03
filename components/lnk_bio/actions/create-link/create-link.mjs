import lnkBio from "../../lnk_bio.app.mjs";
import querystring from "querystring";

export default {
  key: "lnk_bio-create-link",
  name: "Create Link",
  description: "Creates a new link on your lnk.bio profile which will immediately publish and appear on top of your existing links. [See the documentation](https://app.swaggerhub.com/apis/lnkbio/Lnk.Bio/0.0.2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lnkBio,
    title: {
      propDefinition: [
        lnkBio,
        "title",
      ],
    },
    link: {
      propDefinition: [
        lnkBio,
        "link",
      ],
    },
    image: {
      propDefinition: [
        lnkBio,
        "image",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lnkBio.createLink({
      $,
      data: querystring.stringify({
        title: this.title,
        link: this.link,
        image: this.image,
      }),
    });
    $.export("$summary", `Successfully created a new link: ${this.title}`);
    return response;
  },
};
