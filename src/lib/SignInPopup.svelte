<script lang="ts">
	import { signUp, logIn } from "./request.ts";
	import { loadMyUser } from "./User.svelte";
	let signingIn: boolean = $state(true); //

	async function signUpHandler() {
		const username = <HTMLInputElement>(
			document.getElementById("usernamesign")
		);
		const email = <HTMLInputElement>document.getElementById("emailsign");
		const password = <HTMLInputElement>(
			document.getElementById("passwordsign")
		);
		// check for empty
		if (username.value == "" || email.value == "" || password.value == "") {
			alert("All fields must be filled to sign up");
			return;
		}
		let result = await signUp(email.value, password.value, username.value);
		if (result == 401) {
			alert("Unable to Sign Up");
			username.value = "";
			email.value = "";
			password.value = "";
			return;
		}

		username.value = "";
		email.value = "";
		password.value = "";
		return 200;
	}

	async function logInHandler() {
		const email = <HTMLInputElement>document.getElementById("emaillog");
		const password = <HTMLInputElement>(
			document.getElementById("passwordlog")
		);
		if (email.value == "" || password.value == "") {
			alert("All fields must be filled to log in");
			return;
		}
		if ((await logIn(email.value, password.value)) == 403) {
			alert("Unable to Login");
			return;
		}
		await loadMyUser();
		email.value = "";
		password.value = "";
		return 200;
	}
</script>

<!-- HTML -->
<div id="auth-card" class="sign-in-card">
	<div id="authSelector">
		<button
			onclick={() => {
				signingIn = !signingIn;
			}}>Sign Up</button>

		<button
			onclick={() => {
				signingIn = !signingIn;
			}}>Log In</button>
	</div>
	<div>
		<form
			id="signIn"
			onsubmit={signUpHandler}
			class={signingIn ? "" : "hidden"}>
			<label>
				<input type="text" id="usernamesign" placeholder="Username" />
			</label>
			<label>
				<input type="text" id="emailsign" placeholder="Email" />
			</label>
			<label>
				<input type="text" id="passwordsign" placeholder="Password" />
			</label>
			<label>
				<input type="submit" value="Submit" />
			</label>
		</form>
		<form
			id="logIn"
			onsubmit={logInHandler}
			class={signingIn ? "hidden" : ""}>
			<label>
				<input type="text" id="emaillog" placeholder="Email" />
			</label>
			<label>
				<input type="text" id="passwordlog" placeholder="Password" />
			</label>
			<label>
				<input type="submit" value="Submit" />
			</label>
		</form>
	</div>
</div>

<style>
	/* Do not remove this, doesnt work with import */
	.hidden {
		display: none;
	}
</style>
