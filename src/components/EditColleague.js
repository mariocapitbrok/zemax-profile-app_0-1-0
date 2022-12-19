import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	colleaguesDataState,
	editColleagueValue,
	modalEditColleagueAtom, toastApiMessageState, toastErrorState, toastState, updateTableState
} from "../atoms/profileAtom";
import { Modal, TextContainer, FormLayout, TextField, Form, Button } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { usePatchApi } from "../api/usePatchApi";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export default function EditColleague () {
	//const [ isInvalid, setIsInvalid ] = useState();
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ modalEditColleague, setModalEditColleague ] = useRecoilState( modalEditColleagueAtom );
	const editColleagueId = useRecoilValue( editColleagueValue );
	const colleaguesData = useRecoilValue( colleaguesDataState );
	const setUpdateTable = useSetRecoilState( updateTableState );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ loading, setLoading ] = useState( true );
	const [ firstname, setFirstname ] = useState( '' );
	const [ lastname, setLastname ] = useState( '' );
	const [ jobTitle, setJobTitle ] = useState( '' );
	const [ email, setEmail ] = useState( '' );
	const [ businessPhone, setBusinessPhone ] = useState( '' );
	const [ mobilePhone, setMobilePhone ] = useState( '' );
	const { user } = useAuth0();
	// const azureBaseURL = 'http://localhost:7071/api/';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	const { patch } = usePatchApi( azureBaseURL );

	/*const handleEmailChange = useCallback(
		( val ) => setEmail( val ),
		[]
	);
	const handleFirstnameChange = useCallback(
		( firstname ) => setFirstname( firstname ),
		[]
	);

	const handleLastnameChange = useCallback(
		( lastname ) => setLastname( lastname ),
		[]
	);*/

	const handleJobTitleChange = useCallback(
		( jobTitle ) => setJobTitle( jobTitle ),
		[]
	);
	const handleBusinessPhoneChange = useCallback(
		( businessPhone ) => setBusinessPhone( businessPhone ),
		[]
	);

	/*const handleMobilePhoneChange = useCallback(
		( mobilePhone ) => setMobilePhone( mobilePhone ),
		[]
	);*/

	useEffect( () => {
		setLoading( false );
		// console.log( colleaguesData )
		const colleagueObj = colleaguesData.find( item => item.contactid === editColleagueId );

		// console.log(editColleagueId);

		if ( editColleagueId.length ) {
			setFirstname( colleagueObj.firstname );
			setLastname( colleagueObj.lastname );
			setJobTitle( colleagueObj.jobtitle );
			setEmail( colleagueObj.emailaddress1 );
			setBusinessPhone( colleagueObj.telephone1 );
			setMobilePhone( colleagueObj.mobilephone );
		}

		//console.log( colleagueObj )
	}, [ editColleagueId ] )

	function validateForm ( e ) {
		e.preventDefault();
		handleSubmit();
	}

	const handleSubmit = function () {
		setLoadingBtn( true );
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
			console.log( 'edited colleague' );
			if ( resp.status === 200 ) {
				setApiMessage( <IntToasterMessage id='informationUpdated' message='Information updated' /> );
				setToastError( false );
				setModalEditColleague( false );
			} else {
				setApiMessage( <IntToasterMessage id='error' message='Error' /> );
				setToastError( true );
			}
		} ).catch( () => {
			setApiMessage( <IntToasterMessage id='error' message='Error' /> );
			setToastError( true );
		} ).finally( () => {
			setLoadingBtn( false );
			setToastActive( true );
			setUpdateTable( updateTable => !updateTable );
		} )
	}

	const handleClose = function () {
		setModalEditColleague( false );
		setUpdateTable( updateTable => !updateTable );
	}

	return (
		<>
			<Modal
				loading={loading}
				open={modalEditColleague}
				large={false}
				onClose={() => handleClose()}
				title={<FormattedMessage id="editColleague" defaultMessage="Edit Colleague" />}
			>
				<Modal.Section>
					<TextContainer>
						<Form onSubmit={handleSubmit}>
							<FormLayout>
								<TextField
									label={<FormattedMessage id="firstName" defaultMessage="First Name" />}
									value={firstname}
									disabled="disabled"
									id="firstname"
									// onChange={handleFirstnameChange}
								/>

								<TextField
									label={<FormattedMessage id="lastName" defaultMessage="Last Name" />}
									value={lastname}
									// onChange={handleLastnameChange}
									disabled="disabled"
								/>

								<TextField
									label={<FormattedMessage id="jobTitle" defaultMessage="Job Title" />}
									onChange={handleJobTitleChange}
									value={jobTitle}
								/>

								<TextField
									type="email"
									label={<FormattedMessage id="email" defaultMessage="Email" />}
									// onChange={handleEmailChange}
									value={email}
									required
									disabled="disabled"
								/>

								<TextField
									type="tel"
									label={<FormattedMessage id="businessPhone" defaultMessage="Business Phone" />}
									onChange={handleBusinessPhoneChange}
									value={businessPhone}
								/>
								<div style={{ color: '#0070c0', display: 'flex', justifyContent: 'flex-end' }}>
									<Button size="slime" monochrome outline loading={loadingBtn} onClick={( e ) => validateForm( e )}>
										{<FormattedMessage id="saveInformation" defaultMessage="Save Information" />}
									</Button>
								</div>
							</FormLayout>
						</Form>
					</TextContainer>
				</Modal.Section>
			</Modal>
		</>
	)
}
