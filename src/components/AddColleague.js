import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	modalAddColleagueAtom,
	toastApiMessageState,
	toastErrorState, toastShowDuration,
	toastState, updateTableState,
	userDetailsState
} from "../atoms/profileAtom";
import { Modal, TextContainer, FormLayout, TextField, Form, Button, InlineError } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { usePostApi } from "../api/usePostApi";
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";
// import { useAuthorizedApi } from "../api/useAuthorizedApi";

export default function AddColleague () {
	const [ isInvalid, setIsInvalid ] = useState();
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ modalAddColleague, setModalAddColleague ] = useRecoilState( modalAddColleagueAtom )
	// const [ colleaguesData, setColleaguesData ] = useRecoilState( colleaguesDataState )
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ showDuration, setShowDuration ] = useRecoilState( toastShowDuration );
	const setUpdateTable = useSetRecoilState( updateTableState );
	const parentcustomerid = useRecoilValue( userDetailsState )
	const [ loading, setLoading ] = useState( true );
	const [ firstname, setFirstname ] = useState( '' );
	const [ firstnameError, setFirstnameError ] = useState( false );
	const [ lastname, setLastname ] = useState( '' );
	const [ lastnameError, setLastnameError ] = useState( false );
	const [ jobTitle, setJobTitle ] = useState( '' );
	const [ jobtitleError, setJobtitleError ] = useState( false );
	const [ email, setEmail ] = useState( '' );
	const [ emailError, setEmailError ] = useState( false );
	const [ businessPhone, setBusinessPhone ] = useState( '' );
	const [ businessPhoneError, setBusinessPhoneError ] = useState( false );
	const [ mobilePhone, setMobilePhone ] = useState( '' );
	//const [ isEmpty, setIsEmpty ] = useState( false ); // @TODO need to implement checker
	const { user } = useAuth0();
	// const azureBaseURL = 'http://localhost:7071/api/';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	const { post } = usePostApi( azureBaseURL );

	const handleEmailChange = useCallback(
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
	);
	const handleJobTitleChange = useCallback(
		( jobTitle ) => setJobTitle( jobTitle ),
		[]
	);
	const handleBusinessPhoneChange = useCallback(
		( businessPhone ) => setBusinessPhone( businessPhone ),
		[]
	);
	const handleMobilePhoneChange = useCallback(
		( mobilePhone ) => setMobilePhone( mobilePhone ),
		[]
	);

	useEffect( () => {
		setLoading( false );
		//console.log( parentcustomerid )
	}, [] )

	function validateForm ( e ) {
		e.preventDefault();

		firstname.length ? setFirstnameError( false ) : setFirstnameError( true );
		lastname.length ? setLastnameError( false ) : setLastnameError( true );
		jobTitle.length ? setJobtitleError( false ) : setJobtitleError( true );
		email.length ? setEmailError( false ) : setEmailError( true );
		businessPhone.length ? setBusinessPhoneError( false ) : setBusinessPhoneError( true );

		if ( firstname.length * lastname.length * jobTitle.length * email.length * businessPhone.length ) {
			setIsInvalid( false );
			setLoadingBtn( true );
			handleSubmit();
		} else {
			setIsInvalid( true )
			console.log( "isInvalid: " + isInvalid );
		}
	}

	const handleCancel = ()=> {
		setFirstnameError( false );
		setLastnameError( false );
		setJobtitleError( false );
		setEmailError( false );
		setBusinessPhoneError( false );
		setModalAddColleague( false )
	}

	const handleSubmit = function () {
		// console.log( isInvalid );
		setLoadingBtn( true );
		// console.log( 'correct' );

		post( 'dynamics_add_colleague', {
			auth0_id: user.sub,
			firstname: firstname,
			lastname: lastname,
			emailaddress1: email,
			jobtitle: jobTitle,
			telephone1: businessPhone,
			mobilephone: mobilePhone,
			parentcustomerid_account: parentcustomerid[ '_parentcustomerid_value' ]

		} ).then( ( resp ) => {
			console.log( resp );
			// console.log( 'add colleague' )
			if ( resp.data.status === 204 ) {
				// setApiMessage( 'Colleague was added successfully' );
				setApiMessage( <IntToasterMessage id='userAdded' message='Colleague was added successfully' /> );
				setUpdateTable( updateTable => !updateTable );
				setToastError( false );
				setTimeout( () => {
					setModalAddColleague( false );
					setFirstname( '' );
					setLastname( '' );
					setJobTitle( '' );
					setBusinessPhone( '' );
					setMobilePhone( '' );
					setEmail( '' );
				}, 3000 )
			} else if(resp.data.message === 'Email is already used, please enter another email.') {
				setShowDuration(15000);
				setApiMessage( <IntToasterMessage duration="10000" id='emailAlreadyExist' message='A user with this email address already exists. Please check your Deactivated Colleagues tab and re-activate the user. If the user does not appear as an active or deactivated colleague, contact Zemax support for assistance.' /> );
				setToastError( true )
			} else {
				setApiMessage( <IntToasterMessage id='somethingWentWrong' message='Something went wrong!' /> );
				setToastError( true )
			}
		} ).finally( () => {
			setLoadingBtn( false );
			setToastActive( true );
		} ).catch( ( resp ) => {
			setApiMessage( <IntToasterMessage id='somethingWentWrong' message='Something went wrong!' /> );
			setToastError( true )
		} )
	}

	return (
		<>
			<Modal
				loading={loading}
				open={modalAddColleague}
				large={false}
				onClose={handleCancel}
				title={<FormattedMessage id="addColleague"
										 defaultMessage="Add Colleague" />}
			>
				<Modal.Section>
					<TextContainer>
						<Form>
							<FormLayout>
								<TextField
									label={<FormattedMessage id="firstName"
															 defaultMessage="First Name" />}
									onChange={handleFirstnameChange}
									value={firstname}
									id="firstname"
									error={firstnameError}
								/>
								{firstnameError && <InlineError message="First Name is required" fieldID="firstname" />}

								<TextField
									label={<FormattedMessage id="lastName"
															 defaultMessage="Last Name" />}
									onChange={handleLastnameChange}
									value={lastname}
									error={lastnameError}
								/>
								{lastnameError && <InlineError message="Last Name is required" fieldID="lastname" />}

								<TextField
									label={<FormattedMessage id="jobTitle"
															 defaultMessage="Job Title" />}
									onChange={handleJobTitleChange}
									value={jobTitle}
									error={jobtitleError}
								/>
								{jobtitleError && <InlineError message="Job Title is required" fieldID="jobTitle" />}

								<TextField
									type="email"
									label={<FormattedMessage id="email"
															 defaultMessage="Email" />}
									onChange={handleEmailChange}
									value={email}
									required
									error={emailError}
								/>
								{emailError && <InlineError message="Email is required" fieldID="email" />}


								<TextField
									type="tel"
									label={<FormattedMessage id="businessPhone"
															 defaultMessage="Business Phone" />}
									onChange={handleBusinessPhoneChange}
									value={businessPhone}
									error={businessPhoneError}
								/>
								{businessPhoneError && <InlineError message="Business Phone is required" fieldID="businessPhone" />}

								<TextField
									type="tel"
									label={<FormattedMessage id="mobilePhone"
															 defaultMessage="Mobile Phone" />}
									onChange={handleMobilePhoneChange}
									value={mobilePhone}
								/>
								<div style={{ color: '#0070c0', justifyContent: "flex-end", display: "flex" }}>
									<Button size="slime" monochrome outline loading={loadingBtn} onClick={( e ) => validateForm( e )}>
										<FormattedMessage id="addColleague"
														  defaultMessage="Add Colleague" />
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
