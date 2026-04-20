<script lang="ts" module>
    import { myPosts } from "./feed/feed.svelte";

    //TODO implement user
    import { getMyUser } from "./ts-lib/request";

    let user: {
        userId: string;
        username: string;
        status: string;
        bio: string;
        settings: {
            dark: boolean;
            anon: boolean;
        };
        flagged: [string];
        active: number;
    } = $state({
        userId: "",
        username: "",
        status: "",
        bio: "",
        settings: {
            dark: false,
            anon: false,
        },
        flagged: [""],
        active: 0,
    });

    export async function loadMyUser() {
        try {
            const res = await getMyUser();
            user = res.user;
        } catch (e: any) {
            console.error(`Failed to get my user: ${e}, status: ${e.status}`);
        }
    }

    export async function clearUser() {
        user = {
            userId: "",
            username: "",
            status: "",
            bio: "",
            settings: {
                dark: false,
                anon: false,
            },
            flagged: [""],
            active: 0,
        };
    }
</script>

<button class="button" onclick={loadMyUser}>Refresh User</button>
{#if !(user.username == "")}
    <div class="user">
        <h3 id="user-name">Name: {user.username}</h3>
        <p id="user-status">Status: {user.status}</p>
        <p id="user-bio">Bio: {user.bio}</p>
        <button id="getMyPosts" onclick={myPosts} class="button"
            >My Posts</button
        >
    </div>
{/if}

<style>
    @import "./css/app.css";
</style>
