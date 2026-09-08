import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    transcript: {
      propDefinition: [
        common.props.grain,
        "transcript",
      ],
    },
    speakers: {
      propDefinition: [
        common.props.grain,
        "speakers",
      ],
    },
  },
  methods: {
    ...common.methods,
    getInclude() {
      const include = {
        transcript: this.transcript,
        speakers: this.speakers,
      };
      return Object.fromEntries(Object.entries(include).filter(([
        , value,
      ]) => value));
    },
  },
};
