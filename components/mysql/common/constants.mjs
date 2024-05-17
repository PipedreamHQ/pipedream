const SSL_CONFIG = {
  verify_identity: {
    rejectUnauthorized: true,
    verifyIdentity: true,
  },
  verify_ca: {
    rejectUnauthorized: true,
  },
  skip_verification: {
    rejectUnauthorized: false,
  },
};

export default {
  SSL_CONFIG,
};
