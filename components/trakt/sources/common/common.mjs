import trakt from "../../trakt.app.mjs";
import constants from "../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    trakt,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    type: {
      label: "Type",
      description: "The content type. E.g. `movies`",
      type: "string",
      options: constants.CONTENT_TYPES,
    },
  },
};
