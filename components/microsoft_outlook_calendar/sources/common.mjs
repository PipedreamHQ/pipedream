import microsoftOutlook from "../microsoft_outlook_calendar.app.mjs";
import common from "../../microsoft_outlook/sources/common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    microsoftOutlook,
  },
};
