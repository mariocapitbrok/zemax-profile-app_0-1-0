import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import enTranslations from '../locales/en.json';
import {
	AppProvider,
	Spinner,
} from '@shopify/polaris';
import Colleagues from "../pages/Colleagues";
import ManageColleagues from "../pages/ManageColleagues";
import LicenseDetail from "../pages/LicenseDetail";
import LicenseDetailAdmin from "../pages/LicenseDetailAdmin";
import Link from "./Link";
import {
	activeComponentAtom,
	modalAddColleagueAtom, preferredLanguageValue
} from "../atoms/profileAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ManageColleague from "../pages/ManageColleague";
import MainPage from "../pages/MainPage";
import { FormattedMessage, IntlProvider } from "react-intl";
import messages_ja from "../locales/ja.json";
import messages_zh from "../locales/zh-TW.json";
import messages_en from "../locales/en.json";
import getLocal from "../helpers/getLocal";


const Profile = () => {
	const { isAuthenticated, isLoading, user } = useAuth0();
	const [ activeComponent, setActiveComponent ] = useRecoilState( activeComponentAtom );
	const setModalAddColleague = useSetRecoilState( modalAddColleagueAtom );
	let [ preferredLanguage, setPreferredLanguage ] = useRecoilState( preferredLanguageValue );
	let [ lang, setLang ] = useState( 'en' );

	// console.log( 'activeComponent: ' + activeComponent );
	// console.log( 'isStudent: ' + isStudent );

	/*if ( isLoading ) {
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
				<Spinner accessibilityLabel="Large spinner" size="Large" />
			</div>
		);
	}*/

	const navigateToLicense = () => {
		window.location.hash = '#license-table';
		setActiveComponent( "mainPage" );
	}

	useEffect( () => {
		setLang( getLocal() );
		setPreferredLanguage( lang );
	}, [ isAuthenticated, lang ] )

	useEffect( () => {
		window.localStorage.setItem( 'auth0_id', user.sub )
	}, [ user.sub ] )

	if ( isAuthenticated ) {

		let messages = {
			'ja': messages_ja,
			'en': messages_en,
			'zh-TW': messages_zh
		};

		return (
			<IntlProvider locale={lang} messages={messages[ lang ]} defaultLocale="en">
				<AppProvider i18n={enTranslations}>
					{activeComponent === "mainPage" && <MainPage />}
					{activeComponent === "colleaguesPage" && <>

						<Link onClick={() => navigateToLicense()}>
							<FormattedMessage id="navigateButton.back"
											  defaultMessage="Back to Account" />
						</Link>
						<div style={{ paddingBottom: "30px" }} />
						<Colleagues />
					</>}
					{activeComponent === "manageColleaguesPage" && <>
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							<Link onClick={() => navigateToLicense()}>
								<FormattedMessage id="navigateButton.back"
												  defaultMessage="Back to Account" />
							</Link>
							<Link onClick={() => setModalAddColleague( true )}>
								<FormattedMessage id="addColleague"
												  defaultMessage="Add Colleague" />
							</Link>
						</div>
						<div style={{ paddingBottom: "30px" }} />
						<ManageColleagues />
					</>}
					{activeComponent === "LicenseDetail" && <>
						<Link onClick={() => navigateToLicense()}>
							<FormattedMessage id="navigateButton.back"
											  defaultMessage="Back to Account" />
						</Link>
						<div style={{ paddingBottom: "30px" }} />
						<LicenseDetail />
					</>}
					{activeComponent === "ManageColleague" && <>
						<Link onClick={() => setActiveComponent( "manageColleaguesPage" )}>
							<FormattedMessage id="navigateButton.backToColleagues"
											  defaultMessage="Back to Colleagues" />
						</Link>
						<div style={{ paddingBottom: "30px" }} />
						<ManageColleague />
					</>}
					{activeComponent === "LicenseDetailAdmin" && <>
						<Link onClick={() => navigateToLicense()}>
							<FormattedMessage id="navigateButton.back"
											  defaultMessage="Back to Account" />
						</Link>
						<div style={{ paddingBottom: "30px" }} />
						<LicenseDetailAdmin />
					</>}
				</AppProvider>
			</IntlProvider>
		);
	}
};

export default Profile;
