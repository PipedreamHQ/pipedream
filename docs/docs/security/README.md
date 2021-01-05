---
next: false
prev: false
---

# Security at Pipedream

Pipedream is committed to the security of your data. Below, we outline how we handle specific data and what we do to secure it. This is not an exhaustive list of security practices, but an overview of key policies and procedures.

If you have any questions that aren't covered below, or if you'd like to report a suspected vulnerability, please contact us at <span style="font-weight: bold">security@pipedream.com</span>.

[[toc]]

## Reporting a Vulnerability

If you'd like to report a suspected vulnerability, please contact <span style="font-weight: bold">security@pipedream.com</span>.

If you need to encrypt sensitive data as part of your report, you can use our [PGP key](/security/pgp-key/).

## Hosting Details

Pipedream is hosted on the [Amazon Web Services](https://aws.amazon.com/) (AWS) platform. The physical hardware powering Pipedream, and the data stored by our platform, is hosted in data centers controlled and secured by AWS. You can read more about AWS’s security practices and compliance certifications [here](https://aws.amazon.com/security/).

Pipedream further secures access to AWS resources through a series of controls, including but not limited to: using multi-factor authentication to access AWS, hosting services within a private network inaccessible to the public internet, and more.

## User Accounts, Authentication and Authorization

When you sign up for a Pipedream account, you can choose to link your Pipedream login to either an existing [Google](https://google.com) or [Github](https://github.com) account. Pipedream relies on these third-party identity providers for login, and therefore does not store passwords tied to your user account.

We recommend you configure two-factor authentication in your third party identity provider to further protect access to your Pipedream account.

## Third party OAuth grants and API keys

When you link an account from a third party application, you may be asked to either authorize a Pipedream OAuth application access to your account, or provide an API key or other credentials. This section describes how we handle these grants and keys.

When a third party application supports an [OAuth integration](https://oauth.net/2/), Pipedream prefers that interface. The OAuth protocol allows Pipedream to request scoped access to specific resources in your third party account without you having to provide long-term credentials directly. Pipedream must request short-term access tokens at regular intervals, and most applications provide a way to revoke Pipedream's access to your account at any time.

Some third party applications do not provide an OAuth interface. To access these services, you must provide the required authorization mechanism (often an API key). As a best practice, if your application provides such functionality, Pipedream recommends you limit that API key's access to only the resources you need access to within Pipedream.

Pipedream encrypts all OAuth grants and key-based credentials at rest in our production database. That database resides in a private network. Backups of that database are encrypted. The key used to encrypt this database is managed by [AWS KMS](https://aws.amazon.com/kms/) and controlled by Pipedream. KMS keys are 256 bit in length and use the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). Access to administer these keys is limited to specific members of our team. Keys are automatically rotated once a year. KMS has achieved SOC 1, 2, 3, and ISO 9001, 27001, 27017, 27018 compliance. Copies of these certifications are available from Amazon on request.

When you link credentials to a specific source or workflow, the credentials are loaded into that program's [execution environment](#execution-environment), which runs in its own virtual machine, with access to RAM and disk isolated from other users' code.

No credentials are logged in your source or workflow by default. If you log their values or [export data from a step](/workflows/steps/#step-exports), you can always delete the data for that invocation from your source or workflow.

You can delete your OAuth grants or key-based credentials at any time by visiting [https://pipedream.com/accounts](https://pipedream.com/accounts). Deleting OAuth grants within Pipedream **do not** revoke Pipedream's access to your account - you must revoke that access wherever you manage OAuth grants in your third party application.

## Execution Environment

The **execution environment** refers to the environment in which your sources, workflows, and other Pipedream code is executed.

Each version of a source or workflow is deployed to its own virtual machine. This means your execution environment has its own RAM and disk, isolated from other users's environments. You can read more about the details of the virtualization and isolation mechanisms used to secure your execution environment [here](https://firecracker-microvm.github.io/).

## Encryption of data in transit, TLS (SSL) Certificates

When you use the Pipedream web application at [https://pipedream.com](https://pipedream.com), traffic between your client and Pipedream services is encrypted in transit. All Pipedream-managed certificates used to protect user data in transit are created using [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/). This eliminates the need for our employees to manage certificate private keys: these keys are managed and secured by Amazon.

## Payment Processor

Pipedream uses [Stripe](https://stripe.com) as our payment processor. When you sign up for a paid plan, the details of your payment method are transmitted to and stored by Stripe [according to their security policy](https://stripe.com/docs/security/stripe). Pipedream stores no information about your payment method.
