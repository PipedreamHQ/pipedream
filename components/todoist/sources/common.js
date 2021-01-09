module.exports = {
  methods: {
    generateMeta(element) {
      const {
        id: elementId,
        content,
        name,
        date_completed: dateCompleted,
      } = element;
      const summary = content || name;
      const ts = new Date(dateCompleted).getTime();
      const id = `${elementId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};