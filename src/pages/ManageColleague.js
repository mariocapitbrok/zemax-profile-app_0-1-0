import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, DisplayText, Layout, TextContainer, Heading, TextField } from "@shopify/polaris";
import React from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeComponentAtom,
	colleaguesDataState, editColleagueValue,
	toastApiMessageState,
	toastErrorState,
	toastState, updateLicensesTable, updateTableState
} from "../atoms/profileAtom";
import { usePatchApi } from "../api/usePatchApi";
import Toaster from "../components/Toaster";
import AssignLicense from "../components/AssignLicense";
import { FormattedMessage } from "react-intl";
import LicenseDetailsAdmin from "../components/LicenseDetailsAdmin";
import LicensesEndUser from "../components/LicensesEndUser";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export function ColleagueDetails () {
	const [ colleaguesData, setColleaguesData ] = useRecoilState( colleaguesDataState );
	const [ loading, setLoading ] = useState( true );
	const [ statecode, setStatecode ] = useState( 0 );
	const [ firstname, setFirstname ] = useState( '' );
	const [ lastname, setLastname ] = useState( '' );
	const [ jobTitle, setJobTitle ] = useState( '' );
	const [ email, setEmail ] = useState( '' );
	const [ businessPhone, setBusinessPhone ] = useState( '' );
	const [ mobilePhone, setMobilePhone ] = useState( '' );
	const [ loadingJobSaveBtn, setLoadingJobSaveBtn ] = useState( false );
	const [ loadingPhoneSaveBtn, setLoadingPhoneSaveBtn ] = useState( false );
	const editColleagueId = useRecoilValue( editColleagueValue );
	// const [ userDetails, setUserDetails ] = useRecoilState( userDetailsState );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ sendRequestColleague, setSendRequestColleague ] = useState( false );
	const [ updateColleagueDetail, setColleagueDetail ] = useState( false );
	const [ loadingDeactivate, setLoadingDeactivate ] = useState( false );
	const [ colleagueObj, setColleagueObj ] = useState( [] );
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { user } = useAuth0();
	const { get } = useAuthorizedApi( azureBaseURL );
	const { patch } = usePatchApi( azureBaseURL );

	useEffect( () => {
		if ( !sendRequestColleague ) {
			console.log( 'Sending licenses request...' )
			setSendRequestColleague( true );
			get( 'dynamics_get_colleagues_manage', { auth0_id: user.sub } ).then( ( { data: val } ) => {
				console.warn( val );
				setColleaguesData( val.colleagues );
				window.scrollTo( 0, 0 );

			} ).finally( () => {
				console.log('Getting response licenses request...')
				setTimeout(()=>{
					setSendRequestColleague(false)
				}, 400)
			} )
		}
	}, [ updateColleagueDetail ] )

	useEffect( () => {
		setLoading( false );
		console.log( colleaguesData )
		if ( colleaguesData && colleaguesData.length ) {
			setColleagueObj( colleaguesData.find( item => item.contactid === editColleagueId ) );
		}

		if ( editColleagueId.length && colleagueObj) {
			setFirstname( colleagueObj.firstname );
			setLastname( colleagueObj.lastname );
			setJobTitle( colleagueObj.jobtitle );
			setEmail( colleagueObj.emailaddress1 );
			setBusinessPhone( colleagueObj.telephone1 );
			setMobilePhone( colleagueObj.mobilephone );
			setStatecode( colleagueObj.statecode )
		}
		// console.log( userDetails );
		// console.log( colleagueObj )
	}, [ editColleagueId, colleaguesData, colleagueObj, updateColleagueDetail ] )

	const handleChangeJobtitle = useCallback(
		( val ) => setJobTitle( val ),
		[]
	);
	const handleChangeBusinessPhone = useCallback(
		( val ) => setBusinessPhone( val ),
		[]
	);

	function patchBaseInfo () {
		patch( 'dynamics_edit_colleague', {
			auth0_id: user.sub,
			// firstname: firstname,
			// lastname: lastname,
			// emailaddress1: email,
			jobtitle: jobTitle,
			telephone1: businessPhone,
			mobilephone: mobilePhone,
			contactid: editColleagueId

		} ).then( ( resp ) => {
			// console.log( resp.status );
			if ( resp.status === 200 ) {
				setApiMessage( <IntToasterMessage id='informationUpdated' message='Information updated' /> );
				setToastError( false );
			} else {
				setApiMessage( <IntToasterMessage id='error' message='Error' /> );
				setToastError( true );
			}
		} ).catch( () => {
			setApiMessage( <IntToasterMessage id='error' message='Error' /> );
			setToastError( true );
		} ).finally( () => {
			setLoadingPhoneSaveBtn( false );
			setLoadingJobSaveBtn( false );
			setToastActive( true );
			// setUpdateTable( updateTable => !updateTable );
		} )
	}

	function ActionButton ( props ) {
		let { contactid, statecode } = props;
		let colorCode;
		statecode ? colorCode = '#005800' : colorCode = "#b50000";
		let buttonStyle = {
			color: colorCode,
			marginRight: "0px",
			display: "flex",
			justifyContent: "flex-end"
		}

		return (
			<div style={buttonStyle}>
				{!statecode ?
					<Button size="slime" monochrome outline onClick={() => deactivateUser( contactid )} loading={loadingDeactivate === contactid}>
						<FormattedMessage id="deactivateColleague"
										  defaultMessage="Deactivate Colleague" />
					</Button> :
					<Button size="slime" monochrome outline onClick={() => activateUser( contactid )} loading={loadingDeactivate === contactid}>
						<FormattedMessage id="activateColleague"
										  defaultMessage="Activate Colleague" />
					</Button>}
			</div>
		)
	}

	function deactivateUser ( contactid ) {
		setLoadingDeactivate( contactid );
		patch( 'dynamics_deactivate_userid', { auth0_id: user.sub, contact_id: contactid } ).then( ( { data: val } ) => {
			// console.log( val );
			setToastError( false );
			setToastActive( true );
			setApiMessage( <IntToasterMessage id='userWasDeactivated' message='User was deactivated successfully' /> );
			setColleagueDetail( updateColleagueDetail => !updateColleagueDetail );
		} ).finally( () => {
			setLoadingDeactivate( -1 );
		} )
		//console.log( 'remove event' + contactid );
	}

	function activateUser ( contactid ) {
		setLoadingDeactivate( contactid );

		patch( 'dynamics_activate_userid', { auth0_id: user.sub, contact_id: contactid } ).then( ( { data: val } ) => {
			// console.log( val );
			setToastError( false );
			setToastActive( true );
			setApiMessage( <IntToasterMessage id='userWasActivated' message='User was activated successfully' /> );
			setColleagueDetail( updateColleagueDetail => !updateColleagueDetail);
		} ).finally( () => {
			setLoadingDeactivate( -1 );
		} )
		//console.log( 'activate event ' + contactid );
	}

	function handleSubmitPhone () {
		setLoadingPhoneSaveBtn( true );
		patchBaseInfo();
	}

	function handleSubmitJob () {
		setLoadingJobSaveBtn( true );
		patchBaseInfo();
	}

	return (
		<>
			<DisplayText size="large">
				<FormattedMessage id="colleagueDetail"
								  defaultMessage="Colleague Details" />
			</DisplayText>
			<Fragment>
				<Layout>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="fullName"
												  defaultMessage="Full Name" />
							</Heading>
							<p>{firstname + " " + lastname}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="jobTitle"
												  defaultMessage="Job Title" />
							</Heading>
							<TextField label='' value={jobTitle} placeholder='Job Title' onChange={handleChangeJobtitle} maxLength='30' />
							<div style={{ color: '#0070c0' }}>
								<Button onClick={handleSubmitJob} loading={loadingJobSaveBtn} monochrome outline>
									<FormattedMessage id="save"
													  defaultMessage="Save" />
								</Button>
							</div>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight" style={{ textAlign: "right" }}>
							<ActionButton contactid={editColleagueId} statecode={statecode} />
						</TextContainer>
					</Layout.Section>
				</Layout>
				<br />
				<Layout>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="email"
												  defaultMessage="Email" />
							</Heading>
							<p>{email}</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">
							<Heading>
								<FormattedMessage id="businessPhone"
												  defaultMessage="Business Phone" />
							</Heading>
							<TextField label='' value={businessPhone} placeholder='' onChange={handleChangeBusinessPhone} maxLength='30' />
							<div style={{ color: '#0070c0' }}>
								<Button onClick={handleSubmitPhone} loading={loadingPhoneSaveBtn} monochrome outline>
									<FormattedMessage id="save"
													  defaultMessage="Save" />
								</Button>
							</div>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneThird>
						<TextContainer spacing="tight">

						</TextContainer>
					</Layout.Section>
				</Layout>
			</Fragment>
		</>
	)
}

export default function ManageColleague () {
	const [ activeComponent, setActiveComponent ] = useRecoilState( activeComponentAtom );
	useEffect( () => {
		window.history.pushState( { page: 3 }, 'colleague details' );
		// console.log(window.history.state)
	}, [] )

	window.onpopstate = function ( event ) {
		event.preventDefault();
		window.history.replaceState( { page: 2 }, 'to colleagues' );
		setActiveComponent( "manageColleaguesPage" );
	}

	return (
		<div id="ColleagueDetails">
			<ColleagueDetails />
			<br />
			<DisplayText size="large"><FormattedMessage id="licenseDetail"
														defaultMessage="License Details" />
			</DisplayText>
			<DisplayText size="small">
				<FormattedMessage id="colleagueIsLicenseAdmin"
								  defaultMessage="Licenses (Colleague is the License Administrator)" />
			</DisplayText>
			<LicenseDetailsAdmin />
			<div style={{
				position: "relative"
			}}>
				<DisplayText size="small">
					<FormattedMessage id="colleagueIsEndUser"
									  defaultMessage="Licenses (Colleague is End User)" />
				</DisplayText>
				<AssignLicense />
				<LicensesEndUser />
			</div>

			<Toaster />
		</div>
	)

}
