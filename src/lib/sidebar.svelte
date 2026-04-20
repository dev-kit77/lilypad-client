<script lang="ts">
    import { logOut } from "./ts-lib/request";
    import SignInPopup from "./popups/login.svelte";
    import User, { clearUser } from "./user.svelte";

    let visible = $state(false); // is the logout message visible

    async function handleLogOut() {
        try {
            await logOut(); //make the request
        } catch (e: any) {
            console.error(`Failed to log out: ${e}, status: ${e.status}`);
        }

        //clear user
        clearUser();

        // show that the user has logged out for 3 seconds
        visible = true;
        setTimeout(() => {
            visible = false;
        }, 3000);
    }
</script>

<!-- The Sidebar -->
<div class="sidebar">
    <User />
    <SignInPopup />

    <button id="logout" onclick={handleLogOut} class="button"> LogOut </button>
    {#if visible}
        <p style="color: red; background-color: darkslategrey;">
            You have been logged out
        </p>
    {/if}
</div>

<style>
    @import "./css/app.css";
</style>
