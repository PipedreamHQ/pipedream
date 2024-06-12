import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  type: "source",
  name: "Test Source",
  key: "salesforce_rest_api-test-source",
  description:
    "Emit new event when a record of the selected object type is created",
  version: "0.0.{{ts}}",
  props: {
    salesforce,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      description: "Timer description",
      default: {
        intervalSeconds: 30,
      },
      hidden: true,
    },
  },
  hooks: {
    async deploy() {
      console.log("deploy");
    },
    async activate() {
      console.log("activate");
    },
    async deactivate() {
      console.log("deactivate");
    },
  },
  methods: {
    emitEvent(timestamp) {
      console.log("emit ", timestamp);
      // const ts = Date.now();
      // this.$emit(
      //   { testEvent: true, timestamp, ts },
      //   {
      //     id: ts,
      //     summary: `New event ${ts} / ${Date.now()}`,
      //     ts,
      //   }
      // );
    },
    setRunStart() {
      this.db.set("lastRunStart", Date.now());
    },
    setRunEnd() {
      this.db.set("lastRunEnd", Date.now());
    },
    checkFirstRun() {
      const didFirstRun = this.db.get("didFirstRun");
      if (!didFirstRun) {
        this.db.set("didFirstRun", true);
      }
      return !didFirstRun;
    },
    isRunning() {
      const lastRunStart = this.db.get("lastRunStart");
      const lastRunEnd = this.db.get("lastRunEnd");
      return !lastRunEnd || (lastRunStart > lastRunEnd);
    },
  },
  async run({ timestamp }) {
    if (this.checkFirstRun()) {
      console.log("starting first run");
    } else {
      console.log("starting subsequent run");
      if (this.isRunning()) {
        console.log("aborting");
        return;
      }
    }

    this.setRunStart();
    console.log("started run: ", timestamp);
    await new Promise((resolve) => {
      setTimeout(resolve, 20000);
    });
    // this.emitEvent(timestamp);
    await new Promise((resolve) => {
      setTimeout(resolve, 20000);
    });
    // this.emitEvent(timestamp);

    this.setRunEnd();
    console.log("finished run: ", timestamp);
  },
};
