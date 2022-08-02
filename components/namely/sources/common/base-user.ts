import namely from "../../app/namely.app";

export default {
  props: {
    namely,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async emitEvent() {
      throw new Error("Method emitEvent is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const users = await this.namely.getUsers({
        perPage: 10,
      });

      for (const user of users) {
        this.emitEvent(user);
      }
    },
  },
  async run() {
    let page = 1;

    while (page > 0) {
      const users = await this.namely.getUsers({
        page,
      });

      if (!users || users.length <= 0) {
        page = -1;
      }

      for (const user of users) {
        this.emitEvent(user);
      }

      page++;
    }
  },
};
