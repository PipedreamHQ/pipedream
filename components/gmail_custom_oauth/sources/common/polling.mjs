import base from "../../../gmail/sources/common/polling.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
};
