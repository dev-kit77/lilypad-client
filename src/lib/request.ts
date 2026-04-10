import { browser } from "$app/environment";
import { getPosition } from "./geodude.ts";

var lat: number;
var lon: number;
let location: NominatimLatLon | null = null;
//URL to api
const url: string = "http://localhost:3000/api";

//getting POSITION
/**
 * Gets the users location
 * @returns True if it successfully got the users location, False otherwise
 */
async function getLocation() {
	let result = await getPosition();
	try {
		lat = result.coords.latitude;
		lon = result.coords.longitude;
		location = await retrieveGeoLocation(lat, lon);
		if (location == null) {
			throw new Error("Location is null");
		}
		// console.log(
		// 	`Got location: lat: ${location.lat == null ? lat : location.lat}, ${location.lon}`
		// );

		return true;
	} catch (error: any) {
		console.error(`Cannot get Location: ${error}`);
		return false;
	}
}

//CHECK SESSION
/**
 * Refreshes the session token
 * @returns true if the session is active, false if it was unable to refresh the token
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

		return response.status;
	} catch (error: any) {
		console.error(error);
		return error;
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
		const response = await fetch(`${url}/auth/sign-in/email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({ email: email, password: password })
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		document.cookie = response.headers.get("set-cookie") ?? "";
	} catch (error: any) {
		console.error(error);
		return error.cause;
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
		const response = await fetch(`${url}/auth/sign-up/email`, {
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
			throw new Error(`Response status: ${response.statusText}`, {
				cause: response.status
			});
		}

		document.cookie = response.headers.get("set-cookie") ?? "";
	} catch (error: any) {
		console.error(error);
		return error.cause;
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
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(result);
		return response.json;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

//FEED request
/**
 *Return a list of posts filtered by locality.
 * @returns json Promise containing an array of Posts or status code
 */
export async function getFeed() {
	try {
		if (location == null) {
			getLocation();
			if (location == null) {
				throw new Error(`Cannot get location`, { cause: 400 });
			}
		}
		const response = await fetch(
			`${url}/feed-spatial?lat=${location.lat}&lon=${location.lon}`,
			{
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include"
			}
		);

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Retreiving Feed`);

		const result = await response.json();
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

//USER requests
/**
 *
 * @returns current user's profile and settings
 */
export async function getMyUser() {
	try {
		const response = await fetch(`${url}/user`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Export personal data for the authenticated user (GDPR SAR).
 * @returns all data associated with the current user
 */
export async function getUserFull() {
	try {
		const response = await fetch(`${url}/user/gdpr-sar`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(`GDPR get all data status: ${response.status}`);

		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
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
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(result);
		// return result;
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Delete the current user account by anonymising identity while preserving authored content.
 */
export async function deleteUser() {
	try {
		const response = await fetch(`${url}/user`, {
			method: "DELETE",
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(result);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

//REPORTING
/**
 * File a report about the post specified in the path parameter {postId}.
 * @param postId
 * @param reason Reason for the report
 * @param content Detailed explanation of teh reason for the report
 * @param action Optional:
 */
export async function reportPost(
	postId: string,
	params: {
		content: string;
		reason: string;
		action?: string;
	}
) {
	try {
		const response = await fetch(`${url}/content/post/${postId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify(params)
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Report: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * File a report against the user specified in the path parameter {userId}.
 * @param userId
 * @param reason Reason for reporting
 * @param content The detailed explanation of the reason
 * @param action Optional:
 */
export async function reportUser(
	userId: string,
	param: {
		reason: string;
		content: string;
		action?: string;
	}
) {
	try {
		const response = await fetch(`${url}/user/${userId}/report`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify(param)
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Report: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Return the specified user’s profile.
 * @param userId
 * @return the specified user's data
 */
export async function getUser(userId: string) {
	try {
		const response = await fetch(`${url}/user/${userId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Fetch user: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

//CONTENT requests

/**
 * Returns a specified post by its CUID
 *@param postId CUID of the post
 *@returns JSON promise with data on the specified post
 */
export async function getPost(postId: string) {
	try {
		const response = await fetch(`${url}/content/${postId}`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(`Getting post status: ${response.status}`);
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Delete a Post.
 * @param postId
 */
export async function deletePost(postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Getting post status: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Returns the list of posts and comments associated with the current user.
 * @returns Promise of list of posts and comments of current user
 */
export async function getMyPosts() {
	try {
		const response = await fetch(`${url}/content`, {
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(`Get my posts: ${response.status}`);

		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Create a new post
 * @param content Text in the post
 * @returns status code
 */
export async function makePost(content: string) {
	try {
		if (location == null) {
			getLocation();
			if (location == null) {
				throw new Error(`Cannot get location`, { cause: 400 });
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
					lat: location.lat,
					lon: location.lon
				}
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Post: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Update a previously made Post.
 * @param content content of the Post
 * @param postId ID of the Post
 */
export async function updatePost(content: string, postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				content: content
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Updating post status: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Create a new reply to a post object.
 * @param content Text of the reply
 */
export async function reply(content: string, postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}/reply`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include",
			body: JSON.stringify({
				content: content
			})
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		console.log(`Reply: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Return all replies to a post object.
 * @param postId
 * @returns Promise with all replies from the specified post
 */
export async function getReply(postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}/reply`, {
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`, {
				cause: response.status
			});
		}
		const result = await response.json();
		console.log(`Get Replies to ${postId} status: ${response.status}`);
		return result;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

/**
 * Upvote a Post.
 * @param postId
 * @returns status code
 */
export async function makeUpvote(postId: string) {
	try {
		const response = await fetch(`${url}/content/post/${postId}/upvote`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.statusText}`, {
				cause: response.status
			});
		}
		// const result = await response.json();
		console.log(`Make Upvote to ${postId} status: ${response.status}`);
		return response.status;
	} catch (error: any) {
		console.error(error);
		return error.cause;
	}
}

const NOMINATIM_REVERSE_ENDPOINT =
	"https://nominatim.openstreetmap.org/reverse";

export type NominatimLatLon = {
	lat: number;
	lon: number;
};

/**
 * Retrieve geolocation coordinates through the Nominatim API and returns latitude and longitude.
 * API docs: https://nominatim.org/release-docs/latest/api/Reverse/
 */
export async function retrieveGeoLocation(
	lat: number,
	lon: number
): Promise<NominatimLatLon | null> {
	// This makes it possible to retrieve location information
	//  only up to the village / suburb level
	// This makes it possible to retrieve location information
	//  only up to the village / suburb level
	const zoom = 13;
	const params = new URLSearchParams({
		format: "json",
		lat: String(lat),
		lon: String(lon),
		zoom: String(zoom)
	});

	try {
		const response = await fetch(
			`${NOMINATIM_REVERSE_ENDPOINT}?${params}`,
			{
				headers: {
					Accept: "application/json",
					"User-Agent": "Lilypad-client/1.0 (contact: coursework)"
				}
			}
		);
		if (!response.ok) {
			return null;
		}
		const data = (await response.json()) as {
			error?: string;
			lat?: string;
			lon?: string;
		};
		if (data.error != null || data.lat == null || data.lon == null) {
			return null;
		}
		// console.log(`Location: ${data.lat}, ${data.lon}`);

		return {
			lat: Number.parseFloat(data.lat),
			lon: Number.parseFloat(data.lon)
		};
	} catch (error: any) {
		console.error(`NOMINATIM ERROR${error}`);
		return null;
	}
}
