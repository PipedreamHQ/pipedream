export class ConfigurationError extends Error {
  exposeStack: boolean;
  constructor(message: string, exposeStack = false) {
    super(message);
    this.name = "ConfigurationError";
    this.exposeStack = exposeStack;
  }
}
