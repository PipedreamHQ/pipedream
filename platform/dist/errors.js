"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonexistentDataPropertyError = exports.ConfigurationError = void 0;
class ConfigurationError extends Error {
    constructor(message, exposeStack = false) {
        super(message);
        this.name = "ConfigurationError";
        this.exposeStack = exposeStack;
    }
}
exports.ConfigurationError = ConfigurationError;
class NonexistentDataPropertyError extends Error {
    constructor(message, exposeStack = false) {
        super(message);
        this.name = "Nonexistent Data Property Error";
        this.exposeStack = exposeStack;
    }
}
exports.NonexistentDataPropertyError = NonexistentDataPropertyError;
