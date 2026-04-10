<script lang="ts">
	import { updateFeed } from "./Feed.svelte";
	import Replies, { getReplies } from "./Replies.svelte";
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

	/**
	 * Gets the Replies to this Post
	 */
	async function getTheReplies() {
		console.log("Getting Replies");

		getReplies(id);
		return 200;
	}

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
			//refresh replies feed
			setTimeout(() => {
				getReplies(id);
			}, 2000);
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

<!-- TODO FIX REPLIES -->
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
		{#if replyCount > 0}
			<button id="{id}getReplies" onclick={getTheReplies}
				>Get Replies</button>
		{/if}
		<button id="{id}upvote" onclick={upvote}
			>{upvoted ? "Upvote" : "Remove Upvote"}</button>
	</div>
</div>

<!-- Replies -->
{#if replyCount > 0}
	<div>
		<Replies />
	</div>
{/if}

<style>
	.post {
		width: fit-content;
		padding: 1rem;
		border: 4px solid blue;
	}
</style>
