import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Card,
	Tabs,
	Spinner,
	DisplayText
} from "@shopify/polaris";
import { useAuthorizedApi } from '../api/useAuthorizedApi';
import { useAuth0 } from "@auth0/auth0-react";
import TableCompanyLicenses from "./TableCompanyLicenses";
import TableMyLicensesAdmin from "./TableMyLicensesAdmin";
import TableMyLicenses from "./TableMyLicenses";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	contactidValue,
	dateLockBannerState, endUserDateState,
	licensesObjectAtom, lockTransferState, showLockBannerState, tradeInStateButton,
	updateLicensesTable, webRoleAdministrator
} from "../atoms/profileAtom";
import { FormattedMessage } from "react-intl";
import TableAcademicLicenses from "./TableAcademicLicenses";
import TableMyLicensesEndUserAdmin from "./TableMyLicensesEndUserAdmin";
import TableAcademicESPLicenses from "./TableAcademicESPLicenses";

// data: <><>, licenses: string[]
// const hasValidLicense = ( data, validLicenses ) => !!(
// 	[ 'company_licenses', 'company_licenses_commercial', 'my_licenses', 'my_licenses_admin', 'my_licenses_commercial' ]
// 		.find( licenses => {
// 			return !!((data[ licenses ] || []).find( license => {
// 					return Object.values( license ).find( str => validLicenses.includes( str ) )
// 				} )
// 			)
// 		} )
// )


export default function LicenseTable () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { get } = useAuthorizedApi( azureBaseURL );
	// const [ active, setActive ] = useState( false );
	const [ isLoaded, setIsLoaded ] = useState( false );
	const [ sendRequest, setSendRequest ] = useState( false );
	const [ licensesObject, setLicensesObject ] = useRecoilState( licensesObjectAtom );
	const updateLicenses = useRecoilValue( updateLicensesTable );
	const contactid = useRecoilValue( contactidValue );
	const [ endUsersData, setEndUsersData ] = useRecoilState( endUserDateState );
	const setLockTransfer = useSetRecoilState( lockTransferState );
	const setDateLockBanner = useSetRecoilState( dateLockBannerState );
	const setShowLockBanner = useSetRecoilState( showLockBannerState );
	// const [ tradeIsTradeIn, setTradeIsTradeIn ] = useRecoilState( tradeInStateButton );
	const isAdmin = useRecoilValue( webRoleAdministrator );

	useEffect( () => {
		//console.log( contactid )
		if (!sendRequest) {
			console.log('Send licenses request...')
			setSendRequest(true);
			get( 'dynamics_get_licenses_by_auth0id', { auth0_id: user.sub } ).then( ( { data: val } ) => {
				console.warn( val );
				// console.log( value['new_jobfunction'] );
				setLicensesObject( val );
			} ).finally( () => {
				setIsLoaded( true );
				setTimeout(()=>{
					setSendRequest(true)
					console.log('Get response licenses request...')
				}, 200)
			} );
		}

		setEndUsersData( {
			license_detail: {},
			users: {},
			licenseid: ''
		} )
		setDateLockBanner( '' );
		setShowLockBanner( false )

	}, [ contactid, updateLicenses ] );

	// useEffect( () => {
	// 	if ( ___valid ) {
	// 		setTradeIsTradeIn( true )
	// 	}
	//
	// }, [ licensesObject ] )
	// disabled trade in banner


	// const ___valid = useMemo( () => {
	// 	if ( !licensesObject ) return false;
	//
	// 	// OpticStudio-Professional-NET-GLOBAL
	// 	// OpticStudio-Premium Perpetual GLOBAL Network
	// 	// OpticStudio-Professional-NET
	// 	// OpticStudio-Premium Perpetual-NET-Single Region
	// 	// OpticStudio-Standard
	// 	// OpticStudio-Premium Perpetual-SUL
	// 	// OpticStudio-Professional Perpetual-SUL
	// 	return hasValidLicense( licensesObject, [
	// 		'f7f5a7dc-e322-eb11-a813-000d3a329613',
	// 		'e734a9e1-e422-eb11-a813-000d3a329613',
	// 		'b01718ab-b51f-4b2b-b753-454cc91bc1f5',
	// 		'ffabf75c-7e94-47d0-8b7b-756a7e04a6f8',
	// 		'427d459e-8896-40db-83e0-9174518ebdd8',
	// 		'8f8f5cbc-85a5-47c1-8ff5-ee7a078eaec6',
	// 		'df39cb42-af1f-4e92-be8d-ad10fe206d36'
	// 	] )
	// }, [ licensesObject ] )


	useEffect( () => {
		setLockTransfer( false );
		setDateLockBanner( '' );

	}, [ endUsersData, licensesObject ] )


	function TabsLicenses () {
		const [ selectedTab, setSelectedTab ] = useState( 0 );
		const handleTabChange = useCallback(
			( selectedTabIndex ) => setSelectedTab( selectedTabIndex ),
			[ licensesObject ],
		);

		let tabsLicense = [];
		// console.warn(licensesObject)
		if ( licensesObject.my_licenses_admin && licensesObject.my_licenses_admin.length ) {
			tabsLicense = tabsLicense.concat(
				{
					id: 'tab1',
					title: <FormattedMessage id="myLicenseAdmin" defaultMessage="My Licenses (Admin)" />,
					content: <FormattedMessage id="myLicenseAdmin" defaultMessage="My Licenses (Admin)" />,
					element: <TableMyLicensesAdmin />
				}
			)
		}
		if ( licensesObject.my_licenses && licensesObject.my_licenses.length ) {
			tabsLicense = tabsLicense.concat(
				{
					id: 'tab2',
					title: <FormattedMessage id="myLicense" defaultMessage="My Licenses (End User)" />,
					content: <FormattedMessage id="myLicense" defaultMessage="My Licenses (End User)" />,
					element: isAdmin ? <TableMyLicenses /> : <TableMyLicensesEndUserAdmin />
				}
			)
		}

		if ( licensesObject.company_licenses && licensesObject.company_licenses.length ) {
			tabsLicense = tabsLicense.concat(
				{
					id: 'tab3',
					title: <FormattedMessage id="companyLicense" defaultMessage="Company Licenses" />,
					content: <FormattedMessage id="companyLicense" defaultMessage="Company Licenses" />,
					element: <TableCompanyLicenses />
				}
			)
		}

		if ( licensesObject.academic_licenses && licensesObject.academic_licenses.length ) {
			tabsLicense = tabsLicense.concat(
				{
					id: 'tab4',
					title: <FormattedMessage id="academicLicense" defaultMessage="Academic Licenses" />,
					content: <FormattedMessage id="academicLicense" defaultMessage="Academic Licenses" />,
					element: <TableAcademicLicenses />
				}
			)
		}

		if ( licensesObject.academic_esp_licenses && licensesObject.academic_esp_licenses.length ) {
			tabsLicense = tabsLicense.concat(
				{
					id: 'tab5',
					title: <FormattedMessage id="academicESPLicense" defaultMessage="Academic ESP Licenses" />,
					content: <FormattedMessage id="academicESPLicense" defaultMessage="Academic ESP Licenses" />,
					element: <TableAcademicESPLicenses />
				}
			)
		}

		if ( tabsLicense && tabsLicense.length ) {
			return <Card>
				<Tabs selected={selectedTab}
					  onSelect={handleTabChange}
					  tabs={tabsLicense}
					  title={tabsLicense[ selectedTab ].content}
				>
				</Tabs>
				{tabsLicense[ selectedTab ].element}
			</Card>
		}

		return (
			<DisplayText size="small">
				<FormattedMessage id="noRecords" defaultMessage="There are no records to display." />
			</DisplayText>
		)
	}

	return (
		<>
			{!isLoaded ? <Spinner size="small" /> : <TabsLicenses />}
			<div style={{ marginBottom: "20px" }} />
		</>
	);
}
