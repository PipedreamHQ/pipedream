# Get Job

## Overview

Fetches the full details of one job by its **Job ID**: contact details, description, stage, scheduling, notes, checklist, quotes, timeline and more.

Use **Search Jobs** or the **New Job** source to find job IDs.

# Example Use Cases

1. After a **New Job** event, fetch the full details before notifying the team.
2. Check the stage and notes of a job before sending a customer message from the workflow.

# Getting Started

1. Connect the Klussenbeheer app with a Klussenbeheer token (Settings in Klussenbeheer).
2. Add the **Get Job** action and pass a job ID.

# Troubleshooting

## Job not found

The job ID is the numeric `id` from **Search Jobs** or a **New Job** event. Check for typos — the ID is numeric, e.g. `7367195`.
