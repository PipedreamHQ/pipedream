main_example = """## Example app file for Raindrop

Here's an example Pipedream app for Raindrop:

```
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "raindrop",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The collection ID",
      async options() {
        const { items } = await this.getCollections();
        return items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
      },
    },
    raindropId: {
      type: "string",
      label: "Bookmark ID",
      description: "Existing Bookmark ID",
      async options({
        prevContext, collectionId,
      }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { items } = await this.getRaindrops({
          collectionId,
          params: {
            page,
          },
        });
        return {
          options: items.map((e) => ({
            value: e._id,
            label: e.title,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.raindrop.io/rest/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getCollections(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/collections",
      });
    },
    async getRaindrops({ collectionId, ...opts}) {
      return this._makeRequest({
        ...opts,
        path: `/raindrops/${collectionId}`,
      });
    },
  },
};
```

This object contains a `propDefinitions` property, which contains the definitions for the props of the app.

The propDefinitions object contains two props: collectionId and raindropId. The collectionId prop is a string prop. The raindropId prop is also a string prop. The propDefinitions object also contains an `options` method. The `options` method is an optional method that can be defined on a prop. It is used to dynamically generate the options for a prop and can return a static array of options or a Promise that resolves to an array of options.

This object contains a `props` property, which defines a single prop of type "app":

```
import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "the_app_name",
  propDefinitions: {
    prop_key: {
      type: "string",
      label: "Prop Label",
      description: "A description of the prop",
      async options() {
        const static_options = ["option 1", "option 2"]; // a static array of options
        const dynamic_options = await this.getOptions(); // a Promise that resolves to an array of options.
        return dynamic_options; // return the options
      },
    }
  },
  methods: {
    _baseUrl() {
      return "https://api.the_app_name.com"; // the base URL of the app API
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
        headers,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`, // the authentication type depends on the app
        },
      });
    },
    async getOptions(opts = {}) {
      // the code to get the options
      return this._makeRequest({
        ...opts,
      })
    },
  },
}
```"""
