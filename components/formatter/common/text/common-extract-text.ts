import { ActionRunOptions } from "@pipedream/types";

export default {
  methods: {
    getRegExp(): RegExp {
      throw new Error("RegExp not implemented for this action!");
    },
    getType(): string {
      throw new Error("Type not implemented for this action!");
    },
  },
  async run({ $ }: ActionRunOptions): Promise<string> {
    const input: string = this.input;
    const type = this.getType();
    const result = input.match(this.getRegExp())?.[0];

    $.export(
      "$summary",
      result
        ? `Successfully found ${type} "${result}"`
        : `No ${type} found`,
    );
    return result;
  },
};
