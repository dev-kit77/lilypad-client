<!-- The "Posting" box -->

<script lang="ts">
    import { updateFeed } from "./Feed.svelte";
    import { makePost } from "./request.ts";

    /**
     * Make a Post
     */
    async function send() {
        const content: HTMLInputElement = <HTMLInputElement>(
            document.getElementById("sendBox")
        );
        content.blur();
        if (content.value == "") {
            console.error("Post must contain content.");
            return;
        }
        makePost(content.value);
        content.value = "";
        setTimeout(() => {
            updateFeed();
        }, 1000);
    }
</script>

<div class="sendField">
    <input placeholder="Write your post here." id="sendBox" /><br />
    <button class="button" id="sendButton" onclick={send}>Send</button>
</div>

<style>
    @import "./app.css";
</style>
