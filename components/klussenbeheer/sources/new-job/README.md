# New Job

## Overview

Emits an event when a new job appears in Klussenbeheer. The source polls the newest jobs on the configured interval (15 minutes by default) and emits jobs it has not seen before. On the first run, the most recent jobs are emitted so the workflow immediately has events to work with.

# Example Use Cases

1. Send a welcome message to the customer whenever a new job comes in.
2. Add every new job to a Google Sheets overview or project tool.

# Getting Started

1. Connect the Klussenbeheer app with a Klussenbeheer token (Settings in Klussenbeheer).
2. Deploy this source and pick a polling interval.

# Troubleshooting

## Many events on first deploy

On the first run the source emits the most recent jobs so you can reference real events while building the workflow. Subsequent runs only emit jobs that appear after that.
