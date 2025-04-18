import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  props: {
    microsoftExcel,
    db: "$.service.db",
  },
  methods: {
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
  },
};
