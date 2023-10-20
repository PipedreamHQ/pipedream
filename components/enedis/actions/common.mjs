export default {
  methods: {
    prepareParam() {
      return {
        "usage_point_id": this.usagePointId,
      };
    },
    prepareAllParams() {
      return {
        "usage_point_id": this.usagePointId,
        "start": this.start,
        "end": this.end,
      };
    },
  },
};
