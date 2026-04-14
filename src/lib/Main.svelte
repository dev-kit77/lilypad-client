<!-- User Page -->
<script lang="ts">
    import Feed from "./feed/feed.svelte";
    import ReportPopup from "./popups/reportCreate.svelte";
    import SendBox from "./popups/postCreate.svelte";
    import SettingsPopup from "./popups/settings.svelte";
    import Sidebar from "./sidebar.svelte";
    import SignInPopup from "./popups/login.svelte";

    // let user;
</script>

<div class="container">
    <Sidebar />
    <div class="main">
        <SendBox />

        <Feed />
    </div>
</div>

<style>
    @import "./css/app.css";
</style>
