export default {
  name: "Do Thing A",
  version: "0.0.1",
  key: "do-thing-a",
  description: "",
  props: {},
  type: "action",
  methods: {},
  async run({ $ }) {
    $.export("name", "value");
    return $.flow.exit("end reason");
  },
};
