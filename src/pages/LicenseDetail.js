import { Fragment, useEffect, useState } from "react";
import { DataTable, Card, Spinner, DisplayText, Layout, Heading, TextContainer } from "@shopify/polaris";
import React from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeComponentAtom, endUserDateState, idLicense } from "../atoms/profileAtom";
import Toaster from "../components/Toaster";
import { FormattedMessage } from "react-intl";

function LicenseDetailTable () {
	const [ endUsersData, setEndUsersData ] = useRecoilState( endUserDateState );
	const [ isLoaded, setIsLoaded ] = useState( false );

	if ( endUsersData && endUsersData.license_detail && endUsersData.license_detail.length ) {
		const license = endUsersData.license_detail.map( ( row, i ) => (
			<Fragment key={i}>
				<Layout>
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
				</Layout>
				<hr />
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
				</Layout>
				<br />
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
				</Layout>
				<hr />
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
							<Heading>
								<FormattedMessage id="nickname"
												  defaultMessage="Nickname"
								/>
							</Heading>
							<p>{row[ 'zemax_nickname' ]}</p>
						</TextContainer>
					</Layout.Section>
				</Layout>
			</Fragment>
		) )
		//console.log( endUsersData.license_detail )

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
			{isLoaded ?? (<Spinner size="small" />)}
		</>
	)
}

function EndUsers () {
	const [ endUsersData, setEndUsersData ] = useRecoilState( endUserDateState );
	const [ isLoaded, setIsLoaded ] = useState( false );

	if ( endUsersData && endUsersData.users && endUsersData.users.length ) {
		const rowsUsers = endUsersData.users.map( ( row, id ) => ([
			row[ 'contact1.fullname' ],
			row[ 'contact1.emailaddress1' ],
			row[ 'contact1.jobtitle' ],
			row[ 'contact1.telephone1' ]
		]) )

		return (
			<>
				<DisplayText size="small">
					<FormattedMessage id="endUsers"
									  defaultMessage="End Users"
					/>
				</DisplayText>
				<Card>
					<DataTable
						columnContentTypes={[
							'text',
							'text',
							'text',
							'text',
						]}
						headings={[
							<FormattedMessage id="fullName"
											  defaultMessage="Name"
							/>,
							<FormattedMessage id="email"
											  defaultMessage="Email"
							/>,
							<FormattedMessage id="jobTitle"
											  defaultMessage="Job Title"
							/>,
							<FormattedMessage id="phone"
											  defaultMessage="Phone"
							/>
						]} rows={rowsUsers}
					/>
				</Card>
			</>
		)
	}
	return (
		<>
			<DisplayText>
				<FormattedMessage id="endUsers"
								  defaultMessage="End Users"
				/>
			</DisplayText>
			<DisplayText size="small">
				<FormattedMessage id="licenseNotHaveEndUser"
								  defaultMessage="This license does not currently have an end user." />
			</DisplayText>
		</>
	)
}

export default function LicenseDetail () {
	const { user } = useAuth0();
	// console.log(navigationContext.id)
	// let id = 'b7a292a8-6389-ea11-a812-000d3a329613';
	const id = useRecoilValue( idLicense )
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const [ endUsersData, setEndUsersData ] = useRecoilState( endUserDateState );
	const [ licenseIdData, setLicenseIdData ] = useState( '' );
	const [ isLoaded, setIsLoaded ] = useState( false );
	const { get } = useAuthorizedApi( azureBaseURL );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	//console.log( id );

	useEffect( () => {
		get( 'dynamics_get_end_users_for_license', { license_id: id, auth0_id: user.sub } ).then( ( { data: val } ) => {
			console.warn( val );
			setEndUsersData( val );
			setLicenseIdData( val.licenseid )
			setIsLoaded( true );
			window.scrollTo( 0, 0 );
			// window.location.hash = '';
		} );
	}, [] )

	useEffect( () => {
		window.history.pushState( { page: 2 }, 'license admin' );
		// console.log( window.history.state )
	}, [] )

	window.onpopstate = function ( event ) {
		event.preventDefault();
		window.history.replaceState( { page: 1 }, 'to main' );
		setActiveComponent( "mainPage" );
	}

	return (
		<>
			<br />
			<DisplayText size="medium"><FormattedMessage id="licenseNumber" defaultMessage="License #" /> {licenseIdData}</DisplayText>
			<LicenseDetailTable />
			<br />
			{!isLoaded && <Spinner size="small" />}
			{isLoaded && <EndUsers />}
			<Toaster />
		</>
	)
}
