export default {
  name: "Prettyify_json",
  version: "0.0.1",
  key: "prettyify_json",
  description: "",
  props: {},
  type: "action",
  methods: {},
  async run({ $ }) {
    $.export("name", "value");
    return $.flow.exit("end reason");
  },
};
