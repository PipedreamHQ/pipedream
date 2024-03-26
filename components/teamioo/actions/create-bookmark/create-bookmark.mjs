import teamioo from "../../teamioo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teamioo-create-bookmark",
  name: "Create Bookmark",
  description: "Saves a website URL to the bookmarks. The 'url' and 'bookmark_type' are required. 'bookmark_type' can either be 'personal' or 'group'. An optional prop 'title' can be included to give the bookmark a custom name. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.1",
  type: "action",
  props: {
    teamioo,
    url: teamioo.propDefinitions.url,
    bookmarkType: teamioo.propDefinitions.bookmarkType,
    title: teamioo.propDefinitions.title,
  },
  async run({ $ }) {
    const response = await this.teamioo.saveBookmark({
      url: this.url,
      bookmarkType: this.bookmarkType,
      title: this.title,
    });

    $.export("$summary", `Successfully saved the bookmark "${this.title || this.url}"`);
    return response;
  },
};
