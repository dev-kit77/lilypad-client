<script lang="ts">
    import { getReply } from "./request.ts";
    import Post from "./Post.svelte";
    import { onMount } from "svelte";

    let { postID, replyCount } = $props();
    let repliesLoaded: boolean = $state(false);
    let replies: {
        id: string;
        content: string;
        author: string;
        userID?: string;
        replyingTo: string;
        time: string;
        updated: string;
        upvotes: number;
        replyCount: number;
    }[] = $state([]);

    async function getReplies(postID: string) {
        repliesLoaded = false;
        const result = await getReply(postID);
        //check for error
        if (typeof result == "number") {
            console.error(`Getting replies: ${result}`);

            return result;
        }
        repliesLoaded = true;
        replies = result.replies;
        console.log(`Replies received: ${JSON.stringify(result)}`);
        console.log(`Replies received: 200`);
        return 200;
    }
    function updateReplies() {
        if (replyCount > 0) {
            getReplies(postID);
        }
    }
</script>

{#if replyCount > 0}
    <div class="get-reply">
        <button class="button" id="{postID}replyFeed" onclick={updateReplies}
            >Get Replies</button
        >
    </div>
{/if}
<div id="Feed">
    <!-- check if replies have been loaded empty -->
    {#if replies.length == 0 && repliesLoaded}
        <div>
            <p>No Replies yet, maybe you could be the first.</p>
        </div>
        <!-- if the replies have tried to load once more and failed -->
    {:else if !repliesLoaded && replies.length > 0}
        <div>
            <p>Failed to get Replies, try again later.</p>
        </div>
    {/if}
    <!-- load the Replies -->
    {#each replies as reply (reply.id)}
        <div style="margin-left: 100px;">
            <Post type={"reply"} {...reply} />
            <br />
        </div>
    {/each}
</div>

<style>
    @import "./app.css";
</style>
