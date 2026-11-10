# Create Job

## Overview

Creates a new job. Depending on the organization settings, creating a job can send a notification to the account owner or admin.

The customer fields (name, phone number, email address) identify who the job is for: Klussenbeheer links the job to the existing customer with those details, or creates the customer. All fields are optional; empty fields are not sent.

# Example Use Cases

1. Turn website contact form submissions into jobs automatically.
2. Create follow-up jobs from a spreadsheet of inspections.

# Getting Started

1. Connect the Klussenbeheer app with a Klussenbeheer token (Settings in Klussenbeheer).
2. Add the **Create Job** action, fill in the customer and job details and run it. Use **Get Job** afterwards for the full created job.

# Troubleshooting

## The job lands on the wrong customer

The job is linked by the customer details you provide. Match on phone number or email address to link to an existing customer reliably — use **Search Customers** to check first.
