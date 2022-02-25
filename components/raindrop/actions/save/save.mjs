// legacy_hash_id: a_NqilJ3
export default {
  key: "raindrop-save",
  name: "Save to Raindrop Collection",
  description: "Receive a link and save it into a specific collection. You can get the collection id by accessing you collection and grabbing the numbers at the end of the address.",
  version: "1.0.1",
  type: "action",
  props: {
    raindrop: {
      type: "app",
      app: "raindrop",
    },
    link: {
      type: "string",
    },
    collectionid: {
      type: "string",
    },
    bookmarktag: {
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      link,
      collectionid,
      bookmarktag,
    } = this;

    $.send.http({
      method: "POST",
      url: "https://api.raindrop.io/rest/v1/raindrop",
      headers: {
        Authorization: `Bearer ${this.raindrop.$auth.oauth_access_token}`,
      },
      data: {
        link,
        collection: {
          $id: collectionid,
        },
        tags: [
          bookmarktag,
        ],
      },
    });
  },
};
