<template><h1 id="replay-events" tabindex="-1"><a class="header-anchor" href="#replay-events" aria-hidden="true">#</a> Replay Events</h1>
<p>Any events you've previously sent to a workflow, you can replay through your workflow, sending the same event again. Once you select an event in the Inspector, you'll see an icon at the far right of the row:</p>
<div>
<img alt="Edit test event" width="350" src="@source/workflows/events/replay/images/replay.png">
</div>
<p>Clicking on that icon replays the event.</p>
<h2 id="keyboard-shortcut" tabindex="-1"><a class="header-anchor" href="#keyboard-shortcut" aria-hidden="true">#</a> Keyboard Shortcut</h2>
<p>You can replay the <strong>last event</strong> sent to your workflow using the keyboard shortcut <code>⌘</code> + Shift + E or <code>Ctrl</code> + Shift + E.</p>
<h2 id="step-exports-for-replayed-events" tabindex="-1"><a class="header-anchor" href="#step-exports-for-replayed-events" aria-hidden="true">#</a> Step Exports for replayed events</h2>
<p>The step exports will be the same for the replayed event (note: the contents of <code>steps.trigger.context</code>, will contain a different event <code>id</code> and <code>ts</code>, to represent the fact that this is a different execution of the same event).</p>
<Footer />
</template>
