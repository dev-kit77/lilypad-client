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
		Type: {type}
		<br />
		Post ID: {id}
		<br />
		Content: {content}
		<br />
		User ID: {userID}
		<br />
		Author: {author}
		<br />
		Time: {time}
		<br />
		Updated: {updated}
		<br />
		Upvotes:{upvotes}
		<br />
		Replying to: {replyingTo}
		<br />
		Reply Count: {replyCount}
	</p>
	<!-- TODO: get tag if user has upvoted or not -->
	<div>
		<input id="{id}replyBox" placeholder="Type your reply here" />
		<button id="{id}sendReply" onclick={makeReply}>Send</button>
		<button id="{id}upvote" onclick={upvote}
			>{upvoted ? "Upvote" : "Remove Upvote"}</button>
	</div>
</div>

<!-- Replies -->
{#if replyCount > 0}
	<div>
		<Replies postID={id} {replyCount} />
	</div>
{/if}

<style>
	.post {
		width: fit-content;
		padding: 1rem;
		border: 4px solid blue;
	}
</style>
