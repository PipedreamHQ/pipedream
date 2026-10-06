import htmlCssToImageApp from "../html_css_to_image.app.mjs";
import {
  htmlParameters,
  urlParameters,
  templateParameters,
  htmlPropOverrides,
  signedUrlParameters,
} from "./generated-props.mjs";

const referenceProps = (parameters, overrides = {}) => Object.fromEntries(parameters.map((name) => [
  name,
  {
    propDefinition: [
      htmlCssToImageApp,
      name,
    ],
    ...overrides[name],
  },
]));

export const htmlClientProps = referenceProps(htmlParameters, htmlPropOverrides);
export const urlClientProps = referenceProps(urlParameters);
export const templateClientProps = referenceProps(templateParameters);
export const signedUrlClientProps = referenceProps(signedUrlParameters, {
  headers: {
    description: `${htmlCssToImageApp.propDefinitions.headers.description} Header values are embedded in the signed URL and are visible to anyone who receives it.`,
  },
});
