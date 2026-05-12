import facebookPages from "../../facebook_pages.app.mjs";

export default {
  props: {
    facebookPages,
    page: {
      propDefinition: [
        facebookPages,
        "page",
      ],
    },
  },
};
