import forge from "node-forge";

export const forgeToken = ({
  headers, bodyRaw,
}, token) => {
  const receivedToken = headers["x-wisepops-signature"];
  var hmac = forge.hmac.create();
  hmac.start("sha256", token);
  hmac.update(bodyRaw);
  const hmacDigest = hmac.digest().toHex();
  return receivedToken === hmacDigest;
};
