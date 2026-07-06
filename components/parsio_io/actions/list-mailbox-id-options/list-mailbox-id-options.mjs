import parsio_io from "../../parsio_io.app.mjs";

export default {
  key: "parsio_io-list-mailbox-id-options",
  name: "List Mailbox ID Options",
  description: "Retrieves available options for the Mailbox ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    parsio_io,
  },
  async run({ $ }) {
    const options = await parsio_io.propDefinitions.mailboxId.options.call(this.parsio_io, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
