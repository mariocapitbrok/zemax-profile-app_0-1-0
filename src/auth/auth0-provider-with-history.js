import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ( { children } ) => {
	const history = useHistory();
	const domain = process.env.REACT_APP_AUTH0_DOMAIN;
	const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
	const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
	const algorithm = process.env.REACT_APP_AUTH0_ALGORITHM;

	const onRedirectCallback = ( appState ) => {
		history.push( appState?.returnTo || window.location.pathname );
	};
	// console.log( window.location.origin );

	let endLink = ''
	if ( window.location.origin !== 'http://localhost:3000' ) {
		endLink = '/pages/profile';
	}

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizeTimeoutInSeconds={60}
			redirectUri={window.location.origin + endLink}
			onRedirectCallback={onRedirectCallback}
			// useCookiesForTransactions={true}
			audience={audience}
			algorithm={algorithm}
		>
			{children}
		</Auth0Provider>
	);
};

export default Auth0ProviderWithHistory;
