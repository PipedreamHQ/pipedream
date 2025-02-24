import setmore from "../../setmoreappointments.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "setmoreappointments-new-appointment-created",
  name: "New Appointment Created",
  description: "Emit new event when a new appointment is created in Setmore. [See the documentation](https://setmore.docs.apiary.io/#introduction/appointments/fetch-appointments-by-date-range)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    setmore,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    staffKey: {
      propDefinition: [
        setmore,
        "staffKey",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || this.getMonthAgo();
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getMonthAgo() {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return this.formatDate(oneMonthAgo);
    },
    getToday() {
      const now = new Date();
      return this.formatDate(now);
    },
    getYearFromNow() {
      const now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      return this.formatDate(now);
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    generateMeta(appointment) {
      return {
        id: appointment.key,
        summary: `New Appointment with Key: ${appointment.key}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const startDate = this._getLastDate();
    const endDate = this.getYearFromNow();

    const appointments = this.setmore.paginate({
      resourceFn: this.setmore.listAppointments,
      resourceKey: "appointments",
      params: {
        startDate,
        endDate,
        staff_key: this.staffKey,
        customerDetails: true,
      },
    });

    for await (const appointment of appointments) {
      const meta = this.generateMeta(appointment);
      this.$emit(appointment, meta);
    }

    this._setLastDate(this.getToday());
  },
  sampleEmit,
};
