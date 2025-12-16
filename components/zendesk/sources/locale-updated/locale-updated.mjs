import common from "../common/polling.mjs";

export default {
  ...common,
  key: "zendesk-locale-updated",
  name: "Locale Updated",
  type: "source",
  description: "Emit new event when a locale has been updated",
  version: "0.0.5",
  dedupe: "unique",
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const { locales } = await this.zendesk.listLocales();
    for (const locale of locales) {
      const ts = Date.parse(locale.updated_at);
      if (ts > lastTs) {
        this.$emit(locale, {
          id: `${locale.id}-${ts}`,
          summary: locale.name,
          ts,
        });
        maxTs = Math.max(maxTs, ts);
      }
    }
    this._setLastTs(maxTs);
  },
};
