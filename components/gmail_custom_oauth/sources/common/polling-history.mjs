import base from "../../../gmail/sources/common/polling-history.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
};
