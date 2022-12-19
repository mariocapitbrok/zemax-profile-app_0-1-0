var clientId = "aXGSyJVyrPUo5XFUKlwHcp6GiwFzycq0";
var domain = "dev-983ommz9.us.auth0.com";
var lock = new Auth0Lock(clientId, domain);
var accessToken = null;
var profile = null;

lock.on("authenticated", function(authResult) {
	lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
		if (error) {
			// Handle error
			return;
		}

		accessToken = authResult.accessToken;
		profile = profileResult;

		// Update DOM
	});
});
