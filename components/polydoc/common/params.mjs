/**
 * Shared extraction of action props into the params shape consumed by
 * buildRequestBody. Pipedream renders all props (no conditional visibility), so
 * the required-field checks that n8n expressed with displayOptions live here as
 * runtime validation.
 */

/**
 * Enforce the source and delivery field requirements that n8n expressed with
 * displayOptions. Throws once with every missing-field message joined.
 */
export function validateParams(props) {
  const errors = [];
  if (props.sourceType === "url" && !props.url) {
    errors.push("URL is required when Source Type is `url`.");
  }
  if (props.sourceType === "html" && !props.html) {
    errors.push("HTML is required when Source Type is `html`.");
  }
  if (props.sourceType === "template" && !props.templateId) {
    errors.push("Template ID is required when Source Type is `template`.");
  }
  if (props.deliveryMode === "cloudStorage" && !props.presignedUrl) {
    errors.push("Presigned URL is required when Delivery Mode is `cloudStorage`.");
  }
  if (props.deliveryMode === "webhook" && !props.webhookUrl) {
    errors.push("Webhook URL is required when Delivery Mode is `webhook`.");
  }
  if (errors.length) {
    throw new Error(errors.join(" "));
  }
}

/** Shape the delivery sub-object (download, cloudStorage, or webhook) from the flat props. */
function deliveryFromProps(props) {
  const mode = props.deliveryMode ?? "download";
  const delivery = {
    mode,
  };
  if (mode === "cloudStorage") {
    delivery.presignedUrl = props.presignedUrl;
  }
  if (mode === "webhook") {
    delivery.webhook = {
      url: props.webhookUrl,
      ...props.webhookOptions ?? {},
    };
  }
  return delivery;
}

/** Extract the props shared by every action into the buildRequestBody param shape. */
export function commonParams(props) {
  return {
    sourceType: props.sourceType,
    url: props.url,
    html: props.html,
    templateId: props.templateId,
    templateData: props.templateData,
    filename: props.filename,
    tag: props.tag,
    timeout: props.timeout,
    advanced: props.advanced,
    delivery: deliveryFromProps(props),
  };
}
