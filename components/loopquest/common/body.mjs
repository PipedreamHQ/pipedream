/** Build the POST /api/v1/tasks body from action props. Pure — unit tested. */
export function buildTaskBody(p = {}) {
  const payload = { content: p.content, body: p.content };
  if (p.claim) payload.claim = p.claim;
  if (p.sourceText) payload.source = p.sourceText;

  const body = {
    module: p.module || "swiper",
    mode: p.mode || "monitor",
    payload,
    card: { title: p.title || "Review", body: p.content },
  };
  if (p.source) body.source = p.source;
  if (p.externalId) body.external_id = p.externalId;
  if (p.callbackUrl) body.callback_url = p.callbackUrl;
  if (p.timeoutSeconds) body.timeout_seconds = p.timeoutSeconds;
  if (p.onTimeout) body.on_timeout = p.onTimeout;
  if (p.reviewsRequired) body.reviews_required = p.reviewsRequired;
  return body;
}
