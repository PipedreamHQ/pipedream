import app from "../../unsplash.app.mjs";

export default {
  key: "unsplash-get-photo",
  name: "Get Photo",
  description: "Get a specific photo from Unsplash. [See the documentation](https://unsplash.com/documentation#get-a-photo)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    photoId: {
      propDefinition: [
        app,
        "photoId",
      ],
    },
  },
  methods: {
    getPhoto({
      photoId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/photos/${photoId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getPhoto,
      photoId,
    } = this;
    const response = await getPhoto({
      $,
      photoId,
    });

    $.export("$summary", `Successfully retrieved photo with ID \`${response.id}\``);
    return response;
  },
};
