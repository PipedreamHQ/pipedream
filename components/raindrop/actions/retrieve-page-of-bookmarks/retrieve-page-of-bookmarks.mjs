// legacy_hash_id: a_jQioxY
import axios from "axios";

export default {
  key: "raindrop-retrieve-page-of-bookmarks",
  name: "Retrieve page of bookmarks from Raindrop Collection",
  description: "Retrieves a single page of bookmarks from the specified Raindrop Collection.",
  version: "0.1.1",
  type: "action",
  props: {
    raindrop: {
      type: "app",
      app: "raindrop",
    },
    collectionId: {
      type: "string",
      description: "The ID of the Raindrop Collection containing the bookmarks you want to retrieve.\n\nYou can find the ID of a Collection by logging into the Raindrop web app and navigating to the desired Collection. The ID will be at the end of the URL in your address bar. For example, for the address `https://app.raindrop.io/my/123456` the Collection ID is `123456`.",
    },
    sort: {
      type: "string",
      description: "The way bookmarks should be sorted in the response.\n\n`-created` by date descending (default)\n`created` by date ascending\n`score` by relevancy (only applicable when search is specified)\n`-sort` by order\n`title` by title (ascending)\n`-title` by title (descending)\n`domain` by hostname (ascending)\n`-domain` by hostname (descending)\n\nThe above was taken from the [Common Parameters](https://developer.raindrop.io/v1/raindrops/multiple#common-parameters) section of this Raindrop API page.",
      optional: true,
      options: [
        "-created",
        "created",
        "score",
        "-sort",
        "title",
        "-title",
        "domain",
        "-domain",
      ],
    },
    search: {
      type: "string",
      description: "A string for filtering the results by various criteria such as tag, domain, etc. The string is an URL encoded JSON array of key-value pairs.\n\nDue to the complexity of this string, please see the [Search Parameter](https://developer.raindrop.io/v1/raindrops/multiple#search-parameter) section of this Raindrop API page.",
      optional: true,
    },
    page: {
      type: "integer",
      description: "The number of the page you want to retrieve. This parameter defaults to 0 if not specified, in other words the first page is returned.",
      optional: true,
    },
    perpage: {
      type: "integer",
      description: "How many bookmarks to include in each page of results. This parameter defaults to 25 if not specified. 50 is the maximum allowed value.\n\nBecause the Raindrop API rate limits requests on a per-minute basis it is recommended to use the maximum value of 50 when retrieving a large number of bookmarks to reduce the number of API requests that are sent.",
      optional: true,
    },
  },
  async run() {
    const {
      collectionId,
      sort,
      search,
      page,
      perpage,
    } = this;

    const response = await axios({
      method: "GET",
      url: `https://api.raindrop.io/rest/v1/raindrops/${collectionId}`,
      params: {
        sort,
        search,
        perpage,
        page,
      },
      headers: {
        Authorization: `Bearer ${this.raindrop.$auth.oauth_access_token}`,
      },

    });

    return [
      ...response.data.items,
    ];
  },
};
