import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Reservation Verified",
  key: "planyo_online_booking-new-reservation-verified",
  description: "Emit new event when a new reservation is verified. [See Docs](https://www.planyo.com/api.php?topic=add_notification_callback)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getNotificationType() {
      return "new_verified_reservation";
    },
  },
  async run(event) {
    console.log(event);
  },
};
