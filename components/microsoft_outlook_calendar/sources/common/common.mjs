import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";
import common from "@pipedream/microsoft_outlook/sources/common/common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    microsoftOutlook,
  },
};
