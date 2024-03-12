import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-new-user",
  name: "New User Added to Organization",
  description: "Emit new event when a new user gets added to the organization. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=org)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    qntrl,
    db: "$.service.db",
    organizationId: {
      propDefinition: [
        qntrl,
        "organizationId",
      ],
    },
    userRole: {
      propDefinition: [
        qntrl,
        "userRole",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch users initially on deploy to avoid emitting events for all existing users
      const users = await this.qntrl.getUsers({
        organizationId: this.organizationId,
      });
      for (const user of users) {
        this.db.set(user.id, user);
      }
    },
  },
  methods: {
    async getUsers() {
      // Fetch users, assuming such a method exists in the qntrl app file
      return this.qntrl.getUsers({
        organizationId: this.organizationId,
      });
    },
    isNewUser(user) {
      const existingUser = this.db.get(user.id);
      if (!existingUser) {
        this.db.set(user.id, user);
        return true;
      }
      return false;
    },
  },
  async run() {
    const users = await this.getUsers();
    for (const user of users) {
      if (this.isNewUser(user)) {
        this.$emit(user, {
          id: user.id,
          summary: `New user added: ${user.username}`,
          ts: Date.now(),
        });
      }
    }
  },
};
