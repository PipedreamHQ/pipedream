import { ConfigurationError } from "@pipedream/platform";
import {
  apiNameByParameter,
  pdfApiNameByParameter,
  numericParameters,
  propDefinitions,
  htmlParameters,
} from "./generated-props.mjs";

const isProvided = (value) => value !== undefined && value !== null;

const parseNumber = (value, label, min = -Infinity, max = Infinity, integer = false) => {
  const number = Number(value);
  if (String(value).trim() === "" || !Number.isFinite(number)
    || number < min || number > max || (integer && !Number.isInteger(number))) {
    throw new ConfigurationError(`${label} must be a valid ${integer
      ? "integer"
      : "number"} within its allowed range.`);
  }
  return number;
};

const validatePair = (width, height, label) => {
  if (isProvided(width) !== isProvided(height)) {
    throw new ConfigurationError(`${label} width and height must be supplied together.`);
  }
};

const validatePdfDimension = (value) => {
  if (!/^\d+(?:\.\d+)?(?:px|in|cm|mm)$/.test(value)) {
    throw new ConfigurationError("PDF dimensions must be nonnegative values with px, in, cm, or mm units, e.g. 8.5in.");
  }
  return value;
};

export const validateTemplateValues = (values) => {
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    throw new ConfigurationError("Template Values must be an object of variable names and typed values.");
  }
};

export const buildRenderingOptions = (props, parameters = htmlParameters) => {
  validatePair(props.viewportWidth, props.viewportHeight, "Viewport");
  validatePair(props.jumboMaxWidth, props.jumboMaxHeight, "Jumbo maximum");

  const options = {};
  const pdfOptions = {};
  for (const parameter of parameters) {
    if (!isProvided(props[parameter])) continue;
    const definition = propDefinitions[parameter];
    let value = props[parameter];
    if (numericParameters.includes(parameter)) {
      const min = parameter === "deviceScale"
        ? Number.MIN_VALUE
        : parameter === "pdfScale"
          ? 0.1
          : definition.min;
      const max = parameter === "pdfScale"
        ? 2
        : undefined;
      value = parseNumber(value, definition.label, min, max, definition.type === "integer");
    }

    // Pipedream-specific adapters for the client's structured types.
    if (parameter === "googleFonts") {
      const fonts = value.map((font) => font.trim().replace(/ /g, "+")).filter(Boolean);
      if (!fonts.length) continue;
      value = [
        ...new Set(fonts),
      ].join("|");
    }
    if (parameter === "pdfPageWidth" || parameter === "pdfPageHeight") {
      value = validatePdfDimension(value);
    }
    if (parameter === "pdfMargins") {
      if (!Array.isArray(value) || value.length !== 4) {
        throw new ConfigurationError("PDF Margins must contain exactly four dimensions: top, right, bottom, left.");
      }
      value = value.map(validatePdfDimension);
    }
    if (pdfApiNameByParameter[parameter]) {
      pdfOptions[pdfApiNameByParameter[parameter]] = value;
    } else {
      options[apiNameByParameter[parameter]] = value;
    }
  }
  if (Object.keys(pdfOptions).length) options.pdf_options = pdfOptions;
  return options;
};
