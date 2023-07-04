---
next: false
prev: false
---

# Privacy and Security at Pipedream

Pipedream is committed to the privacy and security of your data. Below, we outline how we handle specific data and what we do to secure it. This is not an exhaustive list of practices, but an overview of key policies and procedures.

It is also your responsibility as a customer to ensure you're securing your workflows' code and data. See our [security best practices](/privacy-and-security/best-practices/) for more information.

Pipedream has demonstrated SOC 2 compliance and can provide a SOC 2 Type 2 report upon request (please reach out to <span style="font-weight: bold">support@pipedream.com</span>).

If you have any questions related to data privacy, please email <span style="font-weight: bold">privacy@pipedream.com</span>. If you have any security-related questions, or if you'd like to report a suspected vulnerability, please email <span style="font-weight: bold">security@pipedream.com</span>.

[[toc]]

## Reporting a Vulnerability

If you'd like to report a suspected vulnerability, please contact <span style="font-weight: bold">security@pipedream.com</span>.

If you need to encrypt sensitive data as part of your report, you can use our [PGP key](/privacy-and-security/pgp-key/).

## Reporting abuse

If you suspect Pipedream resources are being used for illegal purposes, or otherwise violate [the Pipedream Terms](https://pipedream.com/terms), [report it here](/abuse/).

## Compliance

### SOC 2

Pipedream undergoes regular third-party audits. We have demonstrated SOC 2 compliance and can provide a SOC 2 Type 2 report upon request. Please reach out to <span style="font-weight: bold">support@pipedream.com</span> to request that report.

We use [Drata](https://drata.com) to continuosly monitor our infrastructure's compliance with standards like SOC 2, and you can visit our [Security Report](https://app.drata.com/security-report/b45c2f79-1968-496b-8a10-321115b55845/27f61ebf-57e1-4917-9536-780faed1f236) to see a list of policies and processes we implement and track within Drata.

### GDPR

#### Data Protection Addendum

Pipedream is considered both a Controller and a Processor as defined by the GDPR. As a Processor, Pipedream implements policies and practices that secure the personal data you send to the platform, and includes a [Data Protection Addendum](https://pipedream.com/dpa) as part of our standard [Terms of Service](https://pipedream.com/terms).

The Pipedream Data Protection Addendum includes the [Standard Contractual Clauses (SCCs)](https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en). These clarify how Pipedream handles your data, and they update our GDPR policies to cover the latest standards set by the European Commission.

You can find a list of Pipedream subprocessors [here](/subprocessors/).

#### Submitting a GDPR deletion request

When you [delete your account](/user-settings/#delete-account), Pipedream deletes all personal data we hold on you in our system and our vendors.

If you need to delete data on behalf of one of your users, you can delete the event data yourself in your workflow or event source (for example, by deleting the events, or by removing the data from data stores). Your customer event data is automatically deleted from Pipedream subprocessors.

## Hosting Details

Pipedream is hosted on the [Amazon Web Services](https://aws.amazon.com/) (AWS) platform. The physical hardware powering Pipedream, and the data stored by our platform, is hosted in data centers controlled and secured by AWS. You can read more about AWS’s security practices and compliance certifications [here](https://aws.amazon.com/security/).

Pipedream further secures access to AWS resources through a series of controls, including but not limited to: using multi-factor authentication to access AWS, hosting services within a private network inaccessible to the public internet, and more.

## Intrustion Detection and Prevention

Pipedream uses AWS WAF, GuardDuty, and Datadog to monitor and block suspected attacks against Pipedream infrastructure, including DDoS attacks.

Pipedream implements a number of industry-standard and custom alerts to detect anomalous activity on the platform, and reacts to potential threats quickly based on [our incident response policy](#incident-response).

## User Accounts, Authentication and Authorization

When you sign up for a Pipedream account, you can choose to link your Pipedream login to either an existing [Google](https://google.com) or [Github](https://github.com) account, or create an account directly with Pipedream.

When you link your Pipedream login to an existing identity provider, Pipedream does not store any passwords tied to your user account — that information is secured with the identity provider. We recommend you configure two-factor authentication in the provider to further protect access to your Pipedream account.

When you create an account on Pipedream directly, with a username and password, Pipedream implements best account security practices (for example: Pipedream hashes your password, and the hashed password is encrypted in our database, which resides in a private network accessible only to select Pipedream employees).

## Third party OAuth grants, API keys, and environment variables

When you link an account from a third party application, you may be asked to either authorize a Pipedream OAuth application access to your account, or provide an API key or other credentials. This section describes how we handle these grants and keys.

When a third party application supports an [OAuth integration](https://oauth.net/2/), Pipedream prefers that interface. The OAuth protocol allows Pipedream to request scoped access to specific resources in your third party account without you having to provide long-term credentials directly. Pipedream must request short-term access tokens at regular intervals, and most applications provide a way to revoke Pipedream's access to your account at any time.

Some third party applications do not provide an OAuth interface. To access these services, you must provide the required authorization mechanism (often an API key). As a best practice, if your application provides such functionality, Pipedream recommends you limit that API key's access to only the resources you need access to within Pipedream.

Pipedream encrypts all OAuth grants, key-based credentials, and environment variables at rest in our production database. That database resides in a private network. Backups of that database are encrypted. The key used to encrypt this database is managed by [AWS KMS](https://aws.amazon.com/kms/) and controlled by Pipedream. KMS keys are 256 bit in length and use the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). Access to administer these keys is limited to specific members of our team. Keys are automatically rotated once a year. KMS has achieved SOC 1, 2, 3, and ISO 9001, 27001, 27017, 27018 compliance. Copies of these certifications are available from Amazon on request.

When you link credentials to a specific source or workflow, the credentials are loaded into that program's [execution environment](#execution-environment), which runs in its own virtual machine, with access to RAM and disk isolated from other users' code.

No credentials are logged in your source or workflow by default. If you log their values or [export data from a step](/workflows/steps/#step-exports), you can always delete the data for that execution from your source or workflow. These logs will also be deleted automatically based on the [event retention](https://pipedream.com/docs/limits/#event-execution-history) for your account.

You can delete your OAuth grants or key-based credentials at any time by visiting [https://pipedream.com/accounts](https://pipedream.com/accounts). Deleting OAuth grants within Pipedream **do not** revoke Pipedream's access to your account. You must revoke that access wherever you manage OAuth grants in your third party application.

## Execution Environment

The **execution environment** refers to the environment in which your sources, workflows, and other Pipedream code is executed.

Each version of a source or workflow is deployed to its own virtual machine in AWS. This means your execution environment has its own RAM and disk, isolated from other users' environments. You can read more about the details of the virtualization and isolation mechanisms used to secure your execution environment [here](https://firecracker-microvm.github.io/).

Instances of running VMs are called **workers**. If Pipedream spins up three VMs to handle multiple, concurrent requests for a single workflow, we're running three **workers**. Each worker runs the same Pipedream execution environment. Workers are ephemeral — AWS will shut them down within ~5 minutes of inactivity — but you can configure [dedicated workers](/workflows/settings/#eliminate-cold-starts) to ensure workers are always available to handle incoming requests.

## Encryption of data in transit, TLS (SSL) Certificates

When you use the Pipedream web application at [https://pipedream.com](https://pipedream.com), traffic between your client and Pipedream services is encrypted in transit. When you create an HTTP interface in Pipedream, the Pipedream UI defaults to displaying the HTTPS endpoint, which we recommend you use when sending HTTP traffic to Pipedream so that your data is encrypted in transit.

All Pipedream-managed certificates used to protect user data in transit are created using [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/). This eliminates the need for our employees to manage certificate private keys: these keys are managed and secured by Amazon.

## Encryption of data at rest

Pipedream encrypts customer data at rest in our databases and data stores. We use [AWS KMS](https://aws.amazon.com/kms/) to manage encryption keys, and all keys are controlled by Pipedream. KMS keys are 256 bit in length and use the Advanced Encryption Standard (AES) in Galois/Counter Mode (GCM). Access to administer these keys is limited to specific members of our team. Keys are automatically rotated once a year. KMS has achieved SOC 1, 2, 3, and ISO 9001, 27001, 27017, 27018 compliance. Copies of these certifications are available from Amazon on request.

## Email Security

Pipedream delivers emails to users for the purpose of email verification, error notifications, and more. Pipedream implements [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) and [DMARC](https://en.wikipedia.org/wiki/DMARC) DNS records to guard against email spoofing / forgery. You can review these records by using a DNS lookup tool like `dig`:

```bash
# SPF
dig pipedream.com TXT +short
# DMARC
dig _dmarc.pipedream.com TXT +short
```

## Incident Response

Pipedream implements incident response best practices for identifying, documenting, resolving and communicating incidents. Pipedream publishes incident notifications to a status page at [status.pipedream.com](https://status.pipedream.com/) and to the [@PipedreamStatus Twitter account](https://twitter.com/pipedreamstatus).

Pipedream notifies customers of any data breaches according to our [Data Protection Addendum](https://pipedream.com/dpa).

## Software Development

Pipedream uses GitHub to store and version all production code. Employee access to Pipedream's GitHub organization is protected by multi-factor authentication.

Only authorized employees are able to deploy code to production. Deploys are tested and monitored before and after release.

## Vulnerability Management

Pipedream monitors our code, infrastructure and core application for known vulnerabilities and addresses critical vulnerabilities in a timely manner.

## Corporate Security

### Background Checks

Pipedream performs background checks on all new hires.

### Workstation Security

Pipedream provides hardware to all new hires. These machines run a local agent that sets configuration of the operating system to hardened standards, including:

- Automatic OS updates
- Hard disk encryption
- Anti-malware software
- Screen lock

and more.

### System Access

Employee access to systems is granted on a least-privilege basis. This means that employees only have access to the data they need to perform their job. System access is reviewed quarterly, on any change in role, or upon termination.

### Security Training

Pipedream provides annual security training to all employees. Developers go through a separate, annual training on secure software development practices.

## Data Retention

Pipedream retains data only for as long as necessary to provide the core service. Pipedream stores your workflow code, data in data stores, and other data indefinitely, until you choose to delete it.

Event data and the logs associated with workflow executions are stored according to [the retention rules on your account](/limits/#event-execution-history).

Pipedream deletes most internal application logs and logs tied to subprocessors within 30 days. We retain a subset of logs for longer periods where required for security investigations.

## Data Deletion

If you choose to delete your Pipedream account, Pipedream deletes all customer data and event data associated with your account. We also make a request to all subprocessors to delete any data those vendors store on our behalf.

Pipedream deletes customer data in backups within 30 days.

## Payment Processor

Pipedream uses [Stripe](https://stripe.com) as our payment processor. When you sign up for a paid plan, the details of your payment method are transmitted to and stored by Stripe [according to their security policy](https://stripe.com/docs/security/stripe). Pipedream stores no information about your payment method.
