import { getPosition } from "./geodude";

var lat: number;
var lon: number;

//URL to api
const url: string = "http://localhost:3000/api";

//getting POSITION
async function getLocation() {
	let position = await getPosition();
	try {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
	} catch (error) {
		console.error(`Cannot get Location. Status: ${position.toJSON}`);
	}
}

//CHECK SESSION
/**
 *
 * @returns true if the session is active, false otherwise
 */
export async function checkSession() {
	try {
		const res = await fetch(`${url}/auth/get-session`, {
			credentials: "include"
		});
		return res.ok;
	} catch {
		return false;
	}
}

//LOGGING OUT
/**
 * Logs the user out
 */
export async function logOut() {
	try {
		const response = await fetch(`${url}/auth/sign-out`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
	} catch (error) {
		console.error(error);
	}
}

//LOGGING IN
/**
 *
 * @param email
 * @param password
 * @returns data of the user
 */
export async function logIn(email: string, password: string) {
	try {
		const response = await fetch(`${url}/auth/sign-in`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({ email: email, password: password })
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

//SIGNING UP
/**
 *
 * @param email string
 * @param password string
 * @param username string
 * @returns data of the user
 */
export async function signUp(
	email: string,
	password: string,
	username: string
) {
	try {
		const response = await fetch(`${url}/auth/sign-up`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				email: email,
				password: password,
				name: username
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// PING the api
/**
 * pings the api and logs the status code (like ok: 200)
 */
export async function ping() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		console.log(result);
	} catch (error: any) {
		console.error(error.message);
	}
}

//FEED request
/**
 *Return a list of posts filtered by locality.
 * @returns json Promise containing an array of Posts
 */
export async function getFeed() {
	try {
		if (!lat || !lon) {
			getLocation();
		}
		const response = await fetch(
			`${url}/feed-spatial?lat=${lat}&lon=${lon}`
		);

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		return result;
	} catch (error: any) {
		console.error(error.message);
		return null;
	}
}

//USER requests
/**
 *
 * @returns current user's profile and settings
 */
export async function getUser() {
	try {
		const response = await fetch(`${url}/user`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		return result;
	} catch (error) {
		console.error(error);
	}
}

/**
 * Export personal data for the authenticated user (GDPR SAR).
 * @returns all data associated with the current user
 */
async function getUserFull() {
	try {
		const response = await fetch(`${url}/user/gdpr-sar`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		console.log(`GDPR get all data status: ${response.status}`);

		return result;
	} catch (error) {
		console.error(error);
	}
}

/**
 *Update the current user's profile and settings
 * @param Object containing user settings to be updated (each setting is optional): {username: string, bio: string, status: string , settings: {dark:bool, anon:bool}}
 */
export async function updateUser(params: {
	username?: string;
	bio?: string;
	status?: string;
	settings?: { dark?: boolean; anon?: boolean };
}) {
	try {
		const response = await fetch(`${url}/user`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify(params)
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		console.log(result);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Deletes the current user and all of its associated data
 */
export async function deleteUser() {
	try {
		const response = await fetch(`${url}/user`, {
			method: "DELETE",
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		console.log(result);
	} catch (error) {
		console.error(error);
	}
}

/**
 * File a report against the user specified in the path parameter {userId}.
 * @param userId
 * @param reason
 * @param content
 * @param action
 */
export async function reportUser(
	userId: string,
	reason: string,
	content: string,
	action: string
) {
	try {
		if (!lat || !lon) {
			getLocation();
		}
		const response = await fetch(`${url}/user/${userId}/report`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				reason: reason,
				content: content,
				action: action
			})
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log(`Report: ${response.status}`);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Return the specified user’s profile.
 * @param userId
 * @return the specified user's data
 */
async function getOtherUser(userId: string) {
	try {
		const response = await fetch(`${url}/user/${userId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log(`Fetch user: ${response.status}`);
	} catch (error) {
		console.error(error);
	}
}

//ADMIN USER
/**
 * Ban/Unban the specified user. This is an admin-only endpoint.
 * @param userId
 * @param length legnth of ban in days
 * @param active set to banned or unbanned
 */
async function banAdmin(userId: string, length: number, active: boolean) {
	try {
		const response = await fetch(`${url}/user/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				active: active,
				lengthOfBanInDays: length
			})
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log(`BanHammer: ${response.status}`);
	} catch (error) {
		console.error(error);
	}
}

//CONTENT requests

/**
 * Returns a specified post by its ID
 *@param postId ID of the post
 *@returns JSON promise with data on the specified post
 */
async function getPost(postId: string) {
	try {
		const response = await fetch(`${url}/content/${postId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		console.log(`Getting post status: ${response.status}`);
		return result;
	} catch (error) {
		console.error(error);
	}
}

/**
 * Returns the list of posts and comments associated with the current user.
 * @returns Promise of list of posts and comments of current user
 */
async function getMyPosts() {
	try {
		const response = await fetch(`${url}/content`, {
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		console.log(`Get my posts: ${response.status}`);

		return result;
	} catch (error) {
		console.error(error);
	}
}

/**
 * Create a new post
 * @param content Text in the post
 * @returns status code
 */
async function makePost(content: string) {
	try {
		if (!lat || !lon) {
			getLocation();
			if (!lat || !lon) {
				throw new Error("Cannot get Location to make post.");
			}
		}

		const response = await fetch(`${url}/content/post`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				content: content,
				locality: {
					lat: lat,
					lon: lon
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log(`Post: ${response.status}`);
	} catch (error) {
		console.error(error);
	}
}

/**
 *
 * @param content Text of the reply
 * @returns
 */
async function reply(content: string, postId: string) {
	try {
		if (!lat || !lon) {
			getLocation();
			if (!lat || !lon) {
				throw new Error("Cannot get location to make reply");
			}
		}

		const response = await fetch(`${url}/content/post/${postId}/reply`, {
			method: "POST",
			headers: {
				"Content-Type": "aLplication/json"
			},
			credentials: "include",
			body: JSON.stringify({
				content: content
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log(`Reply: ${response.status}`);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Return all replies to a post object.
 * @param postId
 * @returns Promise with all replies from the specified post
 */
async function getReply(postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}/reply`, {
			headers: {
				"Content-Type": "aLplication/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		console.log(`Get Replies to ${postId} status: ${response.status}`);
		return result;
	} catch (error) {
		console.error(error);
	}
}

// ADMIN CONTENT
/**
 * Return the list of posts and comments associated with the specified user. This is an admin-only endpoint.
 * @param userId
 * @returns Promise with all posts and replies associated with the specified user
 */
async function getPostsAdmin(userId: string) {
	try {
		const response = await fetch(`${url}/content/${userId}`, {
			headers: {
				"Content-Type": "aLplication/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const result = response.json();
		console.log(
			`Get Posts and Replies from ${userId} status: ${response.status}`
		);
		return result;
	} catch (error) {
		console.error(error);
	}
}
