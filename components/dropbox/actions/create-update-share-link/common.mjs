import dropbox from "../../dropbox.app.mjs";

export default {
  props: {
    dropbox: {
      ...dropbox,
      reloadProps: true,
    },
  },
};
