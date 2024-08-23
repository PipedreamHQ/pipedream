import base from "../../../gmail/sources/common/polling-messages.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
};
