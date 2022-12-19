import { useEffect, useState } from "react";
import { Card, Spinner, DisplayText, Layout, Heading, TextContainer, Banner } from "@shopify/polaris";
import React from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import FormNickname from '../components/FormNickname';
import { useAuth0 } from "@auth0/auth0-react";
import {
	createdOnValue,
	idLicense,
	namedUserValue,
	updateTableState,
	seatTypeValue,
	modifiedOnValue,
	showLockBannerState,
	dateLockBannerState,
	lockTransferState,
	endUserDateState,
	activeComponentAtom
} from "../atoms/profileAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Toaster from "../components/Toaster";
import EndUsers from "../components/EndUsers";
import humanityDate from "../helpers/humanityDate";
import { BannerLock } from "../components/BannerLock";
import { FormattedMessage } from "react-intl";

function LicenseDetailTable ( { isLoaded } ) {
	const endUsersData = useRecoilValue( endUserDateState );
	// const [ isLoaded, setIsLoaded ] = useState( false );

	// console.log(endUsersData);
	if ( isLoaded && endUsersData.license_detail && endUsersData.license_detail.length ) {
		const license = endUsersData.license_detail.map( ( row, i ) => ([
				<Layout key={i}>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="licenseAdministrator"
												  defaultMessage="License Administrator" />
							</Heading>
							<p>{row[ '_new_registereduser_value@OData.Community.Display.V1.FormattedValue' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="account"
												  defaultMessage="Account"
								/>
							</Heading>
							<p>{row[ '_new_account_value@OData.Community.Display.V1.FormattedValue' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="renewalDate"
												  defaultMessage="Renewal Date"
								/>
							</Heading>
							<p>{row[ 'new_supportexpires@OData.Community.Display.V1.FormattedValue' ]}</p>
						</TextContainer>
					</Layout.Section>
				</Layout>,
				<hr />,
				<Layout>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="keySerialNumber"
												  defaultMessage="Key Serial Number"
								/>
							</Heading>
							<p>{row[ 'new_licenseid' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="product"
												  defaultMessage="Product"
								/>
							</Heading>
							<p>{row[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="licenseType"
												  defaultMessage="License Type"
								/>
							</Heading>
							<p>{row[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ] || 'Individual'}</p>
						</TextContainer>
					</Layout.Section>
				</Layout>,
				<Layout>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="zpaSupport"
												  defaultMessage="ZPA Support"
								/>
							</Heading>
							<p>{row[ 'new_premiumsupport@OData.Community.Display.V1.FormattedValue' ]}</p>
						</TextContainer>
					</Layout.Section>
				</Layout>,
				<hr />,
				<Layout>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="seatCount"
												  defaultMessage="Seat Count"
								/>
							</Heading>
							<p>{row[ 'new_usercount' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="endUserCount"
												  defaultMessage="End User Count"
								/>
							</Heading>
							<p>{row[ 'new_endusercount' ]}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<FormNickname nickname={row[ 'zemax_nickname' ]} />
						</TextContainer>
					</Layout.Section>
				</Layout>
			]
		) )

		return (
			<Card>
				<Card.Section>
					{license}
				</Card.Section>
			</Card>
		);
	}


	return (
		<>
			{isLoaded && (<Spinner size="small" />)}
		</>
	)
}

export function NotificationMessage ( { text } ) {
	const [ seatType, setSeatType ] = useRecoilState( seatTypeValue );
	// console.log(seatType);
	text = text ??
		<FormattedMessage id="notification30Days" defaultMessage="Note: A new end user can only be assigned to this license once every 30 calendar days." />;

	if ( seatType === 555030000 ) {
		return (
			<div style={{
				display: "flex",
				marginTop: "20px"
			}}>
				<Banner>{text}</Banner>
			</div>
		)
	}
	return (<></>)
}

export default function LicenseDetailAdmin () {
	const id = useRecoilValue( idLicense )
	const { user } = useAuth0();
	// let id = 'b7a292a8-6389-ea11-a812-000d3a329613';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const [ endUsersData, setEndUsersData ] = useRecoilState( endUserDateState );
	const [ licenseIdData, setLicenseIdData ] = useState( '' );
	const updateTable = useRecoilValue( updateTableState );
	const [ createdon, setCreatedon ] = useRecoilState( createdOnValue );
	const last_change = useRecoilValue( modifiedOnValue );
	const [ namedUser, setNamedUser ] = useRecoilState( namedUserValue );
	const setLockTransfer = useSetRecoilState( lockTransferState );
	const setShowLockBanner = useSetRecoilState( showLockBannerState );
	const setDateLockBanner = useSetRecoilState( dateLockBannerState );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const [ seatType, setSeatType ] = useRecoilState( seatTypeValue );
	const [ isLoaded, setIsLoaded ] = useState( false );
	const { get } = useAuthorizedApi( azureBaseURL );

	useEffect( () => {
		window.history.pushState( { page: 2 }, 'license admin' );
		// console.log( window.history.state )
	}, [] )

	window.onpopstate = function ( event ) {
		event.preventDefault();
		window.history.replaceState( { page: 1 }, 'to main' );
		setActiveComponent( "mainPage" );
	}
	//console.log( id );

	useEffect( () => {
		get( 'dynamics_get_end_users_for_license', { license_id: id, auth0_id: user.sub } ).then( ( { data: val } ) => {
			setEndUsersData( val );
			setLicenseIdData( val.licenseid )
			console.warn( val );
			if(val.license_detail) {
				setCreatedon( val.license_detail[ 0 ].createdon )
				//setLast_change( val.users[ 0 ].contact1.modifiedon )
				setNamedUser( val.license_detail[ 0 ].zemax_nameduser )
				setSeatType( val.license_detail[ 0 ].zemax_seattype )
			}
			//console.warn(val.license_detail[ 0 ].createdon );
			window.scrollTo( 0, 0 );
			// window.location.hash = '';
			// checkAvailableTransfer();
			setIsLoaded( true );
		} );
	}, [ licenseIdData, updateTable ] )

	useEffect( () => {
		//setLockTransfer( false );
		checkAvailableTransfer();
	}, [ licenseIdData, endUsersData, updateTable ] )

	function checkAvailableTransfer () {
		try {
			// console.log( 'createdon ' + createdon )
			// console.log( 'modifiedon ' + last_change )
			let present_date = new Date();
			let created = new Date( createdon )
			// let created = new Date( 'Fri Oct 30 2021 23:32:38 GMT+0300' )
			let last_changed = new Date( last_change )
			let delta_change = Math.floor( (present_date - last_changed) / 86400000 );
			// console.log( 'changed ' + delta_change )
			// console.log( 'createdon ' + created )
			let delta = Math.ceil( (present_date - created) / 86400000 );
			console.log( 'created more than ' + delta )
			if ( delta < 30  ) {
				// console.log( 'available' )
				setLockTransfer( false );
				return
			}

			//console.log(seatType)
			if ( delta_change < 30 && seatType === 555030000 ) {
				// console.log( present_date )
				// let dd = last_changed + 30;
				last_changed.setDate( last_changed.getDate() + 30 );
				let possible_change = last_changed.toISOString().split( 'T' )[ 0 ];
				setShowLockBanner( true );
				setDateLockBanner( humanityDate( possible_change ) );
				setLockTransfer( true );
				// console.log( 'namedUser:  ' + namedUser )
			} else {
				setLockTransfer( false );
			}
		} catch ( e ) {
			console.log( e )
		}
	}

	return (
		<>
			<br />
			<DisplayText size="medium">
				<FormattedMessage id="fullName"
								  defaultMessage="Manage License #" />
				{licenseIdData}
			</DisplayText>
			<LicenseDetailTable isLoaded={isLoaded} />
			<br />
			<EndUsers />
			<NotificationMessage />
			<BannerLock />
			<div style={{ textAlign: "right", paddingTop: "15px" }}>
				<a href="https://support.zemax.com/hc/sections/1500001481261" target="_blank">
					<FormattedMessage id="moreInfoAboutLicenseManagement"
									  defaultMessage="More information about license management" />
				</a>
			</div>
			<Toaster />
		</>
	)
}
