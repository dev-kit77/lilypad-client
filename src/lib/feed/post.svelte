<script lang="ts">
    import { findUser, updateFeed } from "./feed.svelte";
    import Replies from "./replies.svelte";
    import { makeUpvote, reply, updatePost } from "../ts-lib/request";

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
        replyCount = $bindable(0),
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

        try {
            await reply(content.value, id);
        } catch (e: any) {
            console.error(`Failed to make reply: ${e}, status: ${e.status}`);
        }
    }

    async function upvote() {
        try {
            await makeUpvote(id);
            upvoted = !upvoted;
            setTimeout(() => {
                updateFeed();
            }, 100);
        } catch (e: any) {
            console.error(`Failed to upvote: ${e}, status: ${e.status}`);
        }
    }

    //TODO updating post

    /**
     * Find user of this post
     */
    async function getUserFromPost() {
        findUser(userID);
    }

    //TODO implement reporting
    async function report() {}
</script>

<div class="post">
    <p>
        Content: {content}
        <br />
        Author:
        <button id="findUser" onclick={getUserFromPost}>{author}</button>
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
        >{upvoted ? "Upvote" : "Remove Upvote"}</button
    >
</div>

<!-- Replies -->
{#if replyCount > 0}
    <div>
        <Replies postID={id} {replyCount} />
    </div>
{/if}

<style>
    @import "../css/app.css";
</style>
