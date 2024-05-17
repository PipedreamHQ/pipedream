import { axios } from "@pipedream/platform";
import summit from "../../summit.app.mjs";

export default {
  key: "summit-new-run",
  name: "New Simulation Run",
  description: "Emits an event each time a new simulation is run in Summit",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    summit,
    simulation_id: {
      propDefinition: [
        summit,
        "simulation_id",
      ],
    },
    simulation_start: {
      propDefinition: [
        summit,
        "simulation_start",
      ],
      optional: true,
    },
    simulation_end: {
      propDefinition: [
        summit,
        "simulation_end",
      ],
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getSimulationId() {
      return this.db.get("simulationId") || null;
    },
    _setSimulationId(id) {
      this.db.set("simulationId", id);
    },
  },
  async run() {
    const simulation = await this.summit.emitSimulationEvent({
      simulation_id: this.simulation_id,
      simulation_start: this.simulation_start,
      simulation_end: this.simulation_end,
    });

    if (simulation.id !== this._getSimulationId()) {
      this.$emit(simulation, {
        id: simulation.id,
        summary: `New Simulation Run: ${simulation.id}`,
        ts: Date.now(),
      });
      this._setSimulationId(simulation.id);
    }
  },
};
