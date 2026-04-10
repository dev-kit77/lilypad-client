<script lang="ts">
	import { updateFeed } from "./Feed.svelte";
	import Replies from "./Replies.svelte";
	import { makeUpvote, getPost, reply, updatePost } from "./request.ts";

	let upvoted: boolean = $state(false);

	// Properties of (Post) Object
	let {
		type = $bindable("post"),
		id = $bindable(),
		content = $bindable(),
		author = $bindable(),
		userID = $bindable(""),
		replyingTo = $bindable(""),
		time = $bindable(),
		upvotes = $bindable(),
		updated = $bindable(),
		replyCount = $bindable(0)
	} = $props();

	async function makeReply() {
		const content = <HTMLInputElement>(
			document.getElementById(`${id}replyBox`)
		);
		content.blur();
		if (content.value == "") {
			alert("Reply cannot be empty.");
			return;
		}
		const result = await reply(content.value, id);
		if (result == 200) {
			console.log(`Making reply: 200 ok`);
			content.value = "";
			return 200;
		} else {
			console.error(`Making reply: ${result}`);
			content.value = "";

			return;
		}
	}

	async function upvote() {
		const result = await makeUpvote(id);
		if (result == 200) {
			upvoted = !upvoted;
			setTimeout(() => {
				updateFeed();
			}, 100);
			console.log(`Upvoting ${id}: 200 ok`);
			return 200;
		} else {
			console.error(`Upvoting: ${result}`);
			return;
		}
	}
</script>

<div class="post">
	<p>
		Content: {content}
		<br />
		Author: {author}
		<br />
		Posted on: {new Date(time).toLocaleString()}
		<br />
		{#if updated != "" && updated != time}
			Last updated on: {new Date(updated).toLocaleString()}
			<br />
		{/if}
		Upvotes: {upvotes}
		<br />
		{#if replyingTo != ""}
			Replying to: {replyingTo}
			<br />
		{/if}
		Replies: {replyCount}
	</p>
	<!-- TODO: get tag if user has upvoted or not -->

	<input id="{id}replyBox" placeholder="Type your reply here" />
	<button class="button" id="{id}sendReply" onclick={makeReply}>Send</button>
	<button class="button" id="{id}upvote" onclick={upvote}
		>{upvoted ? "Upvote" : "Remove Upvote"}</button>
</div>

<!-- Replies -->
{#if replyCount > 0}
	<div>
		<Replies postID={id} {replyCount} />
	</div>
{/if}

<style>
	@import "./src/app.css";
</style>
