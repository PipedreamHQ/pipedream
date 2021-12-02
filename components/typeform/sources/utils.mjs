import { DateTime } from "luxon";

export default {
  parseIsoDate(isoDate) {
    const dt = DateTime.fromISO(isoDate);
    return {
      isoDate,
      date_time: dt.toFormat("yyyy-mm-dd hh:mm:ss a"),
      date: dt.toFormat("yyyy-mm-dd"),
      time: dt.toFormat("hh:mm:ss a"),
      timezone: dt.zoneName,
      epoch: dt.toMillis(),
    };
  },
};
