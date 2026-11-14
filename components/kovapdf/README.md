# Overview

KovaPDF sends PDF documents for electronic signature and checks the digital signatures in any PDF. With KovaPDF on Pipedream you can send a contract for signature when a deal closes, save the signed copy when everyone has signed, or check the signatures of every PDF that arrives.

# Example Use Cases

- **Send a contract when a deal closes**: when a deal moves to "won" in your CRM, send the generated PDF to the customer for signature.
- **File the signed copy**: check a signature request on a schedule and, once it is completed, download the final PDF and upload it to cloud storage.
- **Check incoming signed PDFs**: verify the signatures of every PDF that arrives by email and post the result to a team channel.

# Getting Started

Make an API key in your KovaPDF dashboard at [www.kovapdf.com/dashboard/api](https://www.kovapdf.com/dashboard/api). A test key, which starts with `kova_test_`, is free: its emails go only to your own address and its documents are stamped TEST. For live access, ask at [www.kovapdf.com/developers/request-access](https://www.kovapdf.com/developers/request-access).

Connect your KovaPDF account in Pipedream and paste the key.

# Troubleshooting

A call over a limit fails with status 429 and says when to try again. Every error has a plain sentence and a stable code; the codes are listed at [www.kovapdf.com/developers/errors](https://www.kovapdf.com/developers/errors).
