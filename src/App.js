import React, { useEffect, useState } from 'react';
import './App.css';
import './polaris-styles.css';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Profile';
import { Spinner, Frame, AppProvider } from '@shopify/polaris';
import enTranslations from './locales/en.json';
import {
	RecoilRoot,
} from 'recoil';

function App () {
	const [ isLocal, setIsLocal ] = useState( false );

	useEffect( () => {
		if ( window.location.origin === 'http://localhost:3000' ) {
			setIsLocal( true )
		}
		if ( window.location.hash === '#software-downloads' ) {
			localStorage.setItem( "hash", window.location.hash );
		}
	}, [] )

	/*useEffect( () => {
		if ( localStorage.getItem( "hash" ) === '#software-downloads' ) {


		}

	}, [] )*/

	// console.log(window.location.search)

	const {
		isLoading,
		isAuthenticated,
		error,
		user,
		loginWithRedirect,
		logout,
	} = useAuth0();

	function initialName ( fullName ) {
		const name = fullName.split( ' ' );
		const first = name[ 0 ];
		const second = name[ 1 ].charAt( 0 ) + '.';
		return first + ' ' + second;
	}

	if ( isLoading ) {
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
				<Spinner accessibilityLabel="Large spinner" size="Large" />
			</div>
		);
	}
	if ( error ) {

		//
		if ( !isLocal ) {
			console.log(error);
			let hashUrl = localStorage.getItem( "hash" ) ?? '';
			console.log('hashUrl: ' + hashUrl)
			// window.location.search = '';
			if ( error.message === 'Invalid state' ) {
				window.history.replaceState( {}, document.title, "/pages/profile/" + hashUrl );
			}
			setTimeout( () => {
				document.location.reload();
				console.log( 'invalid state' )
			}, 10000 )
		}
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
				<Spinner accessibilityLabel="Large spinner" size="Large" />
			</div>
		)
		//return <div>Oops... {error.message}</div>;
	}

	if ( isAuthenticated ) {
		localStorage.setItem( 'auth0_zemax', 'true' );
		let initial = initialName( user.name );

		try {
			const login_mobile = document.getElementById( 'login_mobile' );
			const mobileNavIcon = login_mobile.querySelectorAll( '.mobile-nav__icon' );
			const mobileNavDropdown = login_mobile.parentElement.querySelectorAll( '.mobile-nav__dropdown' );

			localStorage.setItem( 'zemax_login_name', initialName( user.name ) );
			const login_mobileParent = login_mobile.parentElement;
			login_mobileParent.classList.add( "active" );
			const loginName = document.querySelectorAll( ".login-name" );
			loginName.forEach( item => {
				item.textContent = localStorage.getItem( 'zemax_login_name' );
				item.textContent = initial;
			} )
			const loginContainer = document.querySelector( ".login-container" );
			const software = document.querySelector( ".software-downloads-container" );
			software.style.display = "flex";
			loginContainer.classList.add( "active" );
			localStorage.setItem( 'zemax_login_name', initial );
		} catch ( e ) {

		}

		return (
			<RecoilRoot>
				<AppProvider i18n={enTranslations}>
					<Frame>
						<Profile />
						{isLocal && <button id="logout-btn" onClick={() => logout( { returnTo: window.location } )}>
							.
						</button>}
					</Frame>
				</AppProvider>
			</RecoilRoot>
		);
	} else {

		return (<>
			<button style={{ display: "none" }} onClick={loginWithRedirect( { appState: { targetUrl: window.location.pathname } } )}> </button>
		</>)
	}
}

export default App;
