import { ActionRunOptions } from "@pipedream/types";

export default {
  methods: {
    getRegExp(): RegExp {
      throw new Error("RegExp not implemented for this action!");
    },
    getResult(input: string) {
      return input.match(this.getRegExp())?.[0];
    },
    getType(): string {
      throw new Error("Type not implemented for this action!");
    },
  },
  async run({ $ }: ActionRunOptions): Promise<string> {
    const input: string = this.input;
    const result = this.getResult(input);

    $.export(
      "$summary",
      result
        ? `Successfully found ${this.getType()} "${result}"`
        : `No ${this.getType()} found`,
    );
    return result;
  },
};
