<template><h1 id="event" tabindex="-1"><a class="header-anchor" href="#event" aria-hidden="true">#</a> <code>$event</code></h1>
<p>When you select an event from the <a href="/workflows/events/inspect/" target="_blank" rel="noopener noreferrer">Inspector<ExternalLinkIcon/></a>, you can see its contents in the <strong><code>$event</code></strong> tab attached to your source.</p>
<p><code>$event</code> (&quot;dollar event&quot;) is a JavaScript object that contains the event that triggered your workflow, formatted here for easy inspection.</p>
<p>For <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP sources<ExternalLinkIcon/></a>, <code>$event</code> contains data from the HTTP request and Pipedream-provided metadata. For example, <code>$event.body</code> contains the HTTP payload; <code>$event.headers</code> contains the HTTP request headers.</p>
<p>For <a href="/workflows/steps/triggers/#cron-scheduler" target="_blank" rel="noopener noreferrer">Cron triggers<ExternalLinkIcon/></a>, <code>$event</code> contains the schedule of your cron job and the time the current job was triggered.</p>
<p><strong>You can save any data in the <code>$event</code> object in a code or an action. This allows you to share data across the steps of your workflow.</strong> <a href="https://docs.pipedream.com/notebook/dollar-event/#modifying-event" target="_blank" rel="noopener noreferrer">Just save the data as a new property of <code>$event</code><ExternalLinkIcon/></a>, or change the value of an existing property, referencing it in a later step.</p>
<p><code>$event</code> is a global variable. You can access or mutate it in any <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">code<ExternalLinkIcon/></a> or <a href="/workflows/steps/actions/" target="_blank" rel="noopener noreferrer">action<ExternalLinkIcon/></a> steps of your workflow.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#referencing-event-in-code-steps">Referencing $event in code steps</RouterLink></li><li><RouterLink to="#shape-contents">Shape / Contents</RouterLink></li><li><RouterLink to="#copying-the-dot-notation-path-to-a-specific-value">Copying the dot-notation path to a specific value</RouterLink></li><li><RouterLink to="#modifying-event">Modifying $event</RouterLink></li><li><RouterLink to="#restrictions">Restrictions</RouterLink></li></ul></nav>
<h2 id="referencing-event-in-code-steps" tabindex="-1"><a class="header-anchor" href="#referencing-event-in-code-steps" aria-hidden="true">#</a> Referencing <code>$event</code> in code steps</h2>
<p>In Node.js code steps, <strong><code>$event</code> is a <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics#Object_basics" target="_blank" rel="noopener noreferrer">JavaScript object<ExternalLinkIcon/></a></strong>. This is just a collection of key-value pairs surrounded by curly braces — {} — like so:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>{
    age: 50,
    name: {
        first: "Luke",
        last: "Skywalker",
    }
}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Every key — for example <code>age</code> — has an associated value (here, the number 50). In JavaScript, the value of a key can be an object itself, like <code>name</code> above.</p>
<p>Within a code cell, you can reference the data in <code>$event</code> like you would any other JavaScript object, using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties" target="_blank" rel="noopener noreferrer">dot-notation<ExternalLinkIcon/></a>.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// Prints "Luke"</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$event<span class="token punctuation">.</span>name<span class="token punctuation">.</span>first<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Prints "Skywalker"</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$event<span class="token punctuation">.</span>name<span class="token punctuation">.</span>last<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="shape-contents" tabindex="-1"><a class="header-anchor" href="#shape-contents" aria-hidden="true">#</a> Shape / Contents</h2>
<p>The initial contents of <code>$event</code> differ depending on the source you've chosen for your workflow.</p>
<p>Clicking on an event in the Inspector reveals the contents of <code>$event</code> for that workflow execution under the <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">source<ExternalLinkIcon/></a> to the right:</p>
<div>
<img alt="Dollar event under source" src="@source/notebook/dollar-event/images/complex-dollar-event.png">
</div>
<h2 id="copying-the-dot-notation-path-to-a-specific-value" tabindex="-1"><a class="header-anchor" href="#copying-the-dot-notation-path-to-a-specific-value" aria-hidden="true">#</a> Copying the dot-notation path to a specific value</h2>
<p>When you send an event with a complex shape to a workflow, it can be difficult to construct the correct dot-notation to access a specific value from <code>$event</code>. For example, in this example below:</p>
<div>
<img alt="Complex dollar event" src="@source/notebook/dollar-event/images/complex-dollar-event.png">
</div>
<p>if I want to get the name of the homeworld of the person, I've got to scan down many levels of nested objects to construct <code>$event.body.person.homeworld.name</code>.</p>
<p><strong>Instead, I can find the property I'm interested in, hold the <code>Cmd</code> or <code>Windows</code> key, and click. This will copy the dot-notation path to that property to my clipboard.</strong></p>
<div>
<img alt="Cmd click to get dot-notation" src="@source/notebook/dollar-event/images/cmd-click-to-get-path.png">
</div>
<h2 id="modifying-event" tabindex="-1"><a class="header-anchor" href="#modifying-event" aria-hidden="true">#</a> Modifying <code>$event</code></h2>
<p>Any changes you make to <code>$event</code> persist across code steps. Typically, we scope variables to the step they were created in, so you wouldn't have access to a variable outside of that step. <strong>Any data you need to use across steps should be stored in properties of <code>$event</code></strong>.</p>
<p>You can add, delete, or update the value of any key in <code>$event</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// Add a new key-value pair</span>
$event<span class="token punctuation">.</span>currentTimestamp <span class="token operator">=</span> <span class="token operator">+</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Delete a key-value pair</span>
<span class="token keyword">delete</span> $event<span class="token punctuation">.</span>url<span class="token punctuation">;</span>
<span class="token comment">// Update a value of an existing key</span>
$event<span class="token punctuation">.</span>body<span class="token punctuation">.</span>person<span class="token punctuation">.</span>job <span class="token operator">=</span> <span class="token string">"Retired Jedi"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>If you modify <code>$event</code>, we'll also display the changes you made clearly below the step, under the <strong>Diff</strong> header:</p>
<div>
<img alt="Dollar event diff" width="450" src="@source/notebook/dollar-event/images/diff.png">
</div>
<h2 id="restrictions" tabindex="-1"><a class="header-anchor" href="#restrictions" aria-hidden="true">#</a> Restrictions</h2>
<p>You cannot completely re-assign the value of the <code>$event</code> variable. That is, you cannot do this:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>$event <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">prop</span><span class="token operator">:</span> <span class="token string">"value"</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><Footer />
</template>
