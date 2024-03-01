export class ConfigurationError extends Error {
  exposeStack: boolean;
  constructor(message: string, exposeStack = false) {
    super(message);
    this.name = "ConfigurationError";
    this.exposeStack = exposeStack;
  }
}

export class NonexistentDataPropertyError extends Error {
  exposeStack: boolean;
  constructor(message: string, exposeStack = false) {
    super(message);
    this.name = "Nonexistent Data Property Error";
    this.exposeStack = exposeStack;
  }
}
