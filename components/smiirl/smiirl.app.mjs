import { Counter } from "@smiirl/smiirl-library-js";

export default {
  type: "app",
  app: "smiirl",
  propDefinitions: {
    number: {
      type: "integer",
      label: "Number",
      description: "Current number value",
    },
  },
  methods: {
    getCounter() {
      const {
        counter_token: token,
        counter_id: counterId,
      } = this.$auth;
      return new Counter(counterId, token);
    },
    async resetCount() {
      return this.getCounter().reset();
    },
    async incrementCount(number) {
      return this.getCounter().add(number);
    },
    async updateCount(number) {
      return this.getCounter().push(number);
    },
  },
};
