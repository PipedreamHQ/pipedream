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
  constructor() {
    super("The Pipedream version of axios returns the data directly");
    this.name = "Nonexistent Data Property Error";
  }
}
