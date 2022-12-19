import { AppProvider, DisplayText } from "@shopify/polaris";
import Link from "./Link";
import LicensesTable from "./LicensesTable";
import React, { useEffect, useRef } from "react";
import enTranslations from '@shopify/polaris/locales/en.json';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeComponentAtom, contactidValue, webRoleAdministrator, webRoleTemp, tradeInStateButton } from "../atoms/profileAtom";
import { FormattedMessage } from "react-intl";
import TradeInButton from "./TradeInButton";

export default function LicensesAdministrator () {
	const licenseRef = useRef();
	const isAdmin = useRecoilValue( webRoleAdministrator );
	const isTemp = useRecoilValue( webRoleTemp );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const [ tradeIsTradeIn, setTradeIsTradeIn ] = useRecoilState( tradeInStateButton );
	let contactidLocal = window.localStorage.getItem( 'contactid' );
	const [ contactid, setContactid ] = useRecoilState( contactidValue );

	useEffect( () => {
		console.log(contactid)
		if (contactidLocal) {
			setContactid( contactidLocal );
		}
	}, [ contactid, isAdmin ] )

	useEffect( () => {
		if ( window.location.hash === '#license-table' && licenseRef.current ) {

			setTimeout( () => {
				const { offsetTop } = licenseRef.current || 0;
				//console.log( offsetTop )
				window.scrollTo( 0, offsetTop );
			}, 2500 )
		}
	}, [] )

	const handleGoPage = ( page, e ) => {
		e.preventDefault();
		window.location.hash = '';
		setActiveComponent( page )
	}

	return (
		<AppProvider i18n={enTranslations}>
			<div id="license-table" ref={licenseRef}>
				<DisplayText size="large">
					<FormattedMessage id="licenses"
									  defaultMessage="Licenses" />
				</DisplayText>
				<div className="licenses-manage-buttons" style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "20px",
					padding: "dfk",
					// flexWrap: "wrap"
				}}>
					<div></div>
					<div style={{ textAlign: "right", marginRight: "0", marginLeft: "15px", width: "auto", minWidth: "200px", marginTop: "12px" }}>
						{contactid && !isAdmin && !isTemp &&
						<Link onClick={( e ) => handleGoPage( 'colleaguesPage', e )}>
							<FormattedMessage id="viewColleagues"
											  defaultMessage="View all Colleagues" />
						</Link>}
						{contactid && isAdmin && !isTemp &&
						<Link onClick={( e ) => handleGoPage( 'manageColleaguesPage', e )}>
							<FormattedMessage id="manageColleagues"
											  defaultMessage="Manage Colleagues" />
						</Link>}
					</div>
				</div>
				<LicensesTable />
				<div style={{ textAlign: "right", paddingTop: "10px", paddingBottom: "15px" }}>
					<a href="https://support.zemax.com/hc/sections/1500001481261" target="_blank" rel="noreferrer">
						<FormattedMessage id="moreInfoAboutLicenseManagement"
										  defaultMessage="More information about license management" />
					</a>
				</div>
			</div>
		</AppProvider>
	);
}
