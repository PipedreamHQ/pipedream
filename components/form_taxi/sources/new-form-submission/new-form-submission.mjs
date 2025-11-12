import base from "../common/base.mjs";

export default {
  ...base,
  type: "source",
  name: "New Form Submission",
  key: "form_taxi-new-form-submission",
  version: "0.0.1",
  description: "Emit new event when Form.taxi receives a new form submission. [About Form.taxi](https://form.taxi/en/backend)",
  dedupe: "unique",
  methods: {
    ...base.methods,
  },
};
