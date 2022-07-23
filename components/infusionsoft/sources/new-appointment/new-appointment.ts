import { defineSource } from "@pipedream/types";
import { appointment } from "../../types/responseSchemas";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Appointment",
  description:
    "Emit new event for each new **appointment** [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getAppointmentUsingGET)",
  key: "infusionsoft-new-appointment",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "appointment.add";
    },
    getSummary({ title }: appointment): string {
      return title;
    },
  },
});
