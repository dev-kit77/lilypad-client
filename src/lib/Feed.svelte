<script lang="ts" module>
    import Post from "./Post.svelte";
    import { getFeed, getMyPosts, getPost, getUser } from "./request.ts";

    let feedPosts: boolean = $state(true); // whether the feed shows posts or user information

    let feedLoaded: boolean = $state(false);

    let user: {
        username: string;
        status: string;
        bio: string;
    } = $state({
        username: "",
        status: "",
        bio: "",
    });

    let feed: {
        id: string;
        content: string;
        author: string;
        userID?: string;
        time: string;
        updated: string;
        upvotes: number;
        replyingTo: string;
        replyCount: number;
    }[] = $state([]);

    /**
     * Finds the post by its CUID
     * @param postID
     */
    export async function findPost(postID: string) {
        feedPosts = true;
        feedLoaded = false;
        feed = [];
        let result = await getPost(postID);
        //check for error
        if (typeof result == "number") {
            console.error(`Getting the post: ${result}`);

            return result;
        }
        feedLoaded = true;
        feed.push(result.posts);
        console.log("Post received: 200");
        return 200;
    }

    /**
     * Get all current users posts.
     */
    export async function myPosts() {
        feedPosts = true;
        feedLoaded = false;
        let result = await getMyPosts();
        //check for error
        if (typeof result == "number") {
            console.error(`Getting my posts: ${result}`);

            return result;
        }

        feedLoaded = true;
        console.log(result);

        feed = result.posts;
        console.log("My posts received: 200");
        return 200;
    }

    /**
     * Refreshes the feed
     */
    export async function updateFeed() {
        feedPosts = true;
        feedLoaded = false;
        let result = await getFeed();
        //check for error
        if (result == 401) {
            alert("You need to be logged in to see the feed");
            console.error(`Getting feed: Not logged in`);

            return result;
        }
        feedLoaded = true;
        feed = result.posts;
        // console.log(`Feed received: ${JSON.stringify(result.posts)}`);
        console.log(`Feed received: 200`);
        return 200;
    }

    /**
     * Show the user found by their ID
     * @param userID
     */
    export async function findUser(userID: string) {
        const result = await getUser(userID);

        //check for error
        if (typeof result == "number") {
            console.error(`Cannot obtain user.`);
            feedPosts = true;
            return 400;
        }
        console.log("Fetched User");
        user = result;
        feedPosts = false; //set feed to show users
        return 200;
    }
</script>

<div class="refresh">
    <button onclick={updateFeed} class="button">Refresh feed</button>
</div>

{#if feedPosts}
    <div>
        <!-- check if feed has been loaded empty -->
        {#if feed == undefined && feedLoaded}
            <div>
                <p>No Posts yet, maybe you could be the first.</p>
            </div>
            <!-- if the feed tried to load once more and failed -->
        {:else if !feedLoaded && feed.length > 0}
            <div>
                <p>Failed to refresh page, try again later.</p>
            </div>
        {/if}

        <!-- load the feed -->
        {#each feed as post (post.id)}
            <Post {...post} />
            <hr />
        {/each}
    </div>
{:else if !(user.username == "")}
    <h3>Name: {user.username}</h3>
    <p>Bio: {user.bio}</p>
    <p>Status: {user.status}</p>
{/if}

<style>
    @import "./app.css";
</style>
