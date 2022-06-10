import base from "../../../gorgias/sources/new-events/new-events.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "gorgias_oauth-new-events",
  name: "New Events",
  description: "Emit new Gorgias event. [See the docs](https://developers.gorgias.com/reference/the-event-object)",
  version: "0.0.1",
  type: "source",
};
