<script lang="ts" module>
    import Post from "./post.svelte";
    import { getFeed, getMyPosts, getPost, getUser } from "../ts-lib/request";

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
        try {
            const res = await getPost(postID);
            //TODO: fix the rest of this function so it actually does what its supposed to??
        } catch (e: any) {
            console.error(`Failed to get post: ${e}, status: ${e.status}`);
        }
    }

    /**
     * Get all current users posts.
     */
    export async function myPosts() {
        feedPosts = true;
        feedLoaded = false;
        try {
            const res = await getMyPosts();
            feedLoaded = true;
            feed = res.posts;
        } catch (e: any) {
            console.error(`Failed to get my posts: ${e}, status: ${e.status}`);
        }
    }

    /**
     * Refreshes the feed
     */
    export async function updateFeed() {
        feedPosts = true;
        feedLoaded = false;
        try {
            const res = await getFeed();
            feedLoaded = true;
            feed = res.posts;
        } catch (e: any) {
            console.error(`Failed to get feed: ${e}, status: ${e.status}`);
        }
    }

    /**
     * Show the user found by their ID
     * @param userID
     */
    export async function findUser(userID: string) {
        try {
            const res = await getUser(userID);
            user = res.user;
            feedPosts = false; //set feed to show users
        } catch (e: any) {
            console.error(`Failed to get user: ${e}, status: ${e.status}`);
        }
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
    @import "../css/app.css";
</style>
