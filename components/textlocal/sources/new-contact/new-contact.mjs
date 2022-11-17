import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "textlocal-new-contact",
  name: "New Contact",
  description: "Emit new contact",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    groupId: {
      type: "string",
      label: "Contact Group",
      description: "The contact group to monitor for new contacts",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const { groups } = await this.textlocal.getGroups();
        const options = groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
        return {
          options,
        };
      },
    },
  },
  hooks: {
    ...common.hooks,
    deactivate() {
      this.db.set("isInitialized", false);
    },
  },
  methods: {
    ...common.methods,
    _isContactProcessed(contact) {
      const { number } = contact;
      return Boolean(this.db.get(number));
    },
    _markContactAsProcessed(contact) {
      const { number } = contact;
      this.db.set(number, true);
    },
    async takeContactGroupSnapshot() {
      const contactScan = await this.textlocal.scanContactGroup({
        groupId: this.groupId,
      });

      for await (const contact of contactScan) {
        this._markContactAsProcessed(contact);
      }
    },
    generateMeta({
      contact,
      ts,
    }) {
      const {
        number,
        first_name: firstName,
        last_name: lastName,
      } = contact;
      const maskedName = this.getMaskedName({
        firstName,
        lastName,
      });
      const maskedNumber = this.getMaskedNumber(number);
      const summary = `New contact: ${maskedName} (${maskedNumber})`;
      return {
        id: number,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const isInitialized = this.db.get("isInitialized");
      if (!isInitialized) {
        await this.takeContactGroupSnapshot();
        this.db.set("isInitialized", true);
        return;
      }

      const { timestamp: ts } = event;
      const contactScan = await this.textlocal.scanContactGroup({
        groupId: this.groupId,
      });

      for await (const contact of contactScan) {
        if (this._isContactProcessed(contact)) {
          continue;
        }

        const meta = this.generateMeta({
          contact,
          ts,
        });
        this.$emit(contact, meta);
        this._markContactAsProcessed(contact);
      }
    },
  },
};
