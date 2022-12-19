import ProfileInfo from "../components/ProfileInfo";
import ZendeskTickets from "../components/ZendeskTickets";
import LicensesAdministrator from "../components/LicenseAdministrator";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeComponentAtom, getRolesState, tradeInStateButton, webRoleStudent, webRoleTemp } from "../atoms/profileAtom";
import { FormattedMessage } from "react-intl";
import Link from "../components/Link";
import TradeInButton from "../components/TradeInButton";

export default function MainPage () {
	//window.history.pushState( { page: 1 }, 'main page' );
	const isStudent = useRecoilValue( webRoleStudent );
	const isTemp = useRecoilValue( webRoleTemp );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const getRoles = useRecoilValue( getRolesState );
	const [ tradeIsTradeIn, setTradeIsTradeIn ] = useRecoilState( tradeInStateButton );

	useEffect( () => {
		// console.log( window.history.state )
		if ( window.history.state === null ) {
			window.history.pushState( { page: 1 }, 'main page' )
		}
		if ( window.history.state && window.history.state.page !== 1 ) {
			window.history.pushState( { page: 1 }, 'main page' )
		}
		// console.log( window.history.state )
	}, [] )

	window.onpopstate = function ( event ) {
		window.history.pushState( { page: 1 }, 'main page' );
		event.preventDefault();
		window.history.replaceState( { page: 1 }, 'main page' )
		setActiveComponent( "mainPage" );
		//console.log( window.history.state );
	}

	return (
		<>
			<h1 style={{
				fontSize: "48px",
				color: "#002f6d",
				lineHeight: "60px",
				fontFamily: "MyriadPro-Semibold"
			}}>
				<FormattedMessage id="myAccount.title"
								  defaultMessage="My Account" />
			</h1>
			<div style={{ padding: "10px" }} />
			<div>
				{tradeIsTradeIn && <TradeInButton />}
			</div>
			<ProfileInfo />
			{getRoles && <ZendeskTickets />}
			<div style={{ padding: "30px" }} />
			<LicensesAdministrator />
		</>
	)
}
