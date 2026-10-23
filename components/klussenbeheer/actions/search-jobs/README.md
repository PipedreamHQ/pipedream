# Search Jobs

## Overview

Searches jobs by title, customer name, address or phone number, newest first. Optionally filter by stage (for example `quote_sent` or `scheduled`) and limit the number of results (1-25, default 25).

# Example Use Cases

1. List all jobs in the "Quote Sent" stage every morning and follow up by email.
2. Find the job ID for **Get Job** or **Add Job Note**.

# Getting Started

1. Connect the Klussenbeheer app with a Klussenbeheer token (Settings in Klussenbeheer).
2. Add the **Search Jobs** action. Leave **Search Term** empty to list the newest jobs, or combine it with a **Stage** filter.

# Troubleshooting

## No results

The search matches on partial values, but only on job title, customer name, address and phone number. Try a shorter search term, or clear the **Stage** filter.
