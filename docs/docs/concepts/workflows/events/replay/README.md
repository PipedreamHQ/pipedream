# Replay Events

Any events you've previously sent to a workflow, you can replay through your workflow, sending the same event again. Once you select an event in the Inspector, you'll see an icon at the far right of the row: 

<div>
<img alt="Edit test event" width="350" src="./images/replay.png">
</div>

Clicking on that icon replays the event.

## Keyboard Shortcut

You can replay the **last event** sent to your workflow using the keyboard shortcut `⌘` + Shift + E or `Ctrl` + Shift + E.

## Step Exports for replayed events

The step exports will be the same for the replayed event (note: the contents of `steps.trigger.context`, will contain a different event `id` and `ts`, to represent the fact that this is a different execution of the same event).

<Footer />
