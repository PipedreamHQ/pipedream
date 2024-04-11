# Overview

The Dock Certs API provides a means for issuing verifiable credentials and decentralized identities, which are essential for managing digital proofs of various qualifications, memberships, or certifications. Using Pipedream's integration capabilities, you can automate the process of creating, revoking, and verifying these credentials. With Pipedream's serverless architecture, you can set up triggers and actions that respond to events in real-time, orchestrate data flow between Dock Certs and other services, and manage credentials with minimal manual intervention.

# Example Use Cases

- **Automate Credential Issuance on User Registration**: When a user completes registration on your platform, automatically issue a verifiable credential using Dock Certs API. This can be integrated with a user management app like Auth0 or a form service like Typeform to trigger the workflow.

- **Credential Verification on Login**: Verify user credentials during the login process by integrating Dock Certs API with your authentication system. This ensures only users with valid, unrevoked credentials can access certain services or platforms.

- **Revoke Credentials upon Subscription Cancellation**: When a user cancels their subscription, use the Dock Certs API to revoke their credentials. This workflow could be connected to a payment platform like Stripe to trigger the revocation.
