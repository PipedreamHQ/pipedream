import lnkBio from "../../lnk_bio.app.mjs";

export default {
  key: "lnk_bio-create-link",
  name: "Create Link",
  description: "Creates a new link on your lnk.bio profile which will immediately publish and appear on top of your existing links. [See the documentation](https://api.lnk.bio)",
  version: "0.0.1",
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
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lnkBio.createLink({
      title: this.title,
      link: this.link,
      image: this.image,
    });
    $.export("$summary", `Successfully created a new link: ${this.title}`);
    return response;
  },
};
