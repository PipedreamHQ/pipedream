import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-new-colleague",
  name: "New Colleague",
  description: "Emits a new event when a new individual is added to the workplace",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    deputy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    accessRights: {
      propDefinition: [
        deputy,
        "accessRights",
      ],
    },
  },
  methods: {
    _getPreviousEmployeeId() {
      return this.db.get("previousEmployeeId");
    },
    _setPreviousEmployeeId(id) {
      this.db.set("previousEmployeeId", id);
    },
  },
  hooks: {
    async deploy() {
      const { data } = await this.deputy._makeRequest({
        path: "/resource/Employee",
      });
      data.forEach((individual) => {
        this.$emit(individual, {
          id: individual.Id,
          summary: `New individual: ${individual.FirstName} ${individual.LastName}`,
          ts: Date.now(),
        });
      });
    },
  },
  async run() {
    const previousEmployeeId = this._getPreviousEmployeeId();
    const { data } = await this.deputy._makeRequest({
      path: "/resource/Employee",
    });

    for (const employee of data) {
      if (employee.Id !== previousEmployeeId) {
        this.$emit(employee, {
          id: employee.Id,
          summary: `New employee added: ${employee.FirstName} ${employee.LastName}`,
          ts: Date.now(),
        });
      } else {
        break;
      }
    }

    if (data.length > 0) {
      this._setPreviousEmployeeId(data[0].Id);
    }
  },
};
