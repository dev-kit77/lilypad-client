// All requests related to the "Special" (admin) actions

//URL to api
const url: string = "http://localhost:3000/api";

//ADMIN USER

/**
 * Return the list of posts and comments associated with the specified user. This is an admin-only endpoint.
 * @param userId
 * @returns
 */
export async function getUserAdmin(userId: string) {
  try {
    const response = await fetch(`${url}/content/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    const result = response.json();
    console.log(`Getting user data status: ${response.status}`);
    return result;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}

//ADMIN MODERATING
/**
 * Ban/Unban the specified user. This is an admin-only endpoint.
 * @param userId
 * @param active set to banned or unbanned
 * @param length Optional legnth of ban in days
 */
export async function banUser(
  userId: string,
  params: { active: boolean; length?: number },
) {
  try {
    const response = await fetch(`${url}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    console.log(`BanHammer: ${response.status}`);
    return response.status;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}

/**
 * @returns List of Reports
 */
export async function getAllReports() {
  try {
    const response = await fetch(`${url}/special`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    const result = response.json();
    console.log(`Get Reports status: ${response.status}`);
    return result;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}

/**
 * Retrieves a single report specified by its ID
 * @param reportId
 * @returns Promise containing the Report
 */
export async function getReport(reportId: string) {
  try {
    const response = await fetch(`${url}/special/${reportId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    const result = response.json();
    console.log(`Get Report status: ${response.status}`);
    return result;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}

/**
 * Update the specified Report status
 * @param reportId
 * @param resolved Optional Mark this Report as resolved or not
 * @param action Optional update the action taken on this Report
 */
export async function updateReport(
  reportId: string,
  params: { resolved?: boolean; action?: string },
) {
  try {
    const response = await fetch(`${url}/special/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    console.log(`Update Report status: ${response.status}`);
    return response.status;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}

// ADMIN CONTENT
/**
 * Return the list of posts and comments associated with the specified user. This is an admin-only endpoint.
 * @param userId
 * @returns Promise with all posts and replies associated with the specified user
 */
export async function getUserPostsAdmin(userId: string) {
  try {
    const response = await fetch(`${url}/content/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw Error(`Response status: ${response.status}`, {
        cause: response.status,
      });
    }
    const result = await response.json();
    console.log(
      `Get Posts and Replies from ${userId} status: ${response.status}`,
    );
    return result;
  } catch (error: any) {
    console.error(error);
    return error.cause;
  }
}
