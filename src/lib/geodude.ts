/**
 *
 * @returns Promise containing the geolocationof the user
 */
export function getPosition(): Promise<GeolocationPosition> {
	// Simple wrapper
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error(`no geolocation`));
			return;
		}
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			timeout: 5000
		});
	});
}
