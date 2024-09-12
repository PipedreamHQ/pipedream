import nioleads from "../../nioleads.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nioleads-new-contact",
  name: "New Contact",
  description: "Emits a new event when a new contact data is found.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    nioleads,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    email: {
      propDefinition: [
        nioleads,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        nioleads,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        nioleads,
        "lastName",
      ],
      optional: true,
    },
  },
  methods: {
    _getPreviousEmail() {
      return this.db.get("previousEmail") || null;
    },
    _setPreviousEmail(email) {
      this.db.set("previousEmail", email);
    },
  },
  hooks: {
    async deploy() {
      // Emit the current email as an event on deploy
      const email = this._getPreviousEmail();
      if (email) {
        const {
          firstName, lastName,
        } = await this.nioleads.verifyEmail(email);
        this.$emit(
          {
            email,
            firstName,
            lastName,
          },
          {
            summary: `Found contact data for ${email}`,
          },
        );
      }
    },
  },
  async run() {
    const email = this.email;
    const previousEmail = this._getPreviousEmail();

    if (email !== previousEmail) {
      const {
        firstName, lastName,
      } = await this.nioleads.verifyEmail(email);
      this.$emit(
        {
          email,
          firstName,
          lastName,
        },
        {
          summary: `New contact data found for ${email}`,
        },
      );
      this._setPreviousEmail(email);
    }
  },
};
