import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	colleaguesDataState,
	idLicense, modalEndUserState,
	parentcustomeridValue,
	toastApiMessageState,
	toastErrorState,
	toastState,
	updateTableState
} from "../atoms/profileAtom";
import { usePostApi } from "../api/usePostApi";
import { Button, IndexTable, useIndexResourceState } from "@shopify/polaris";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export default function SimpleIndexTableExample () {
	const { user } = useAuth0();
	const id = useRecoilValue( idLicense )
	// console.log(id)
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { post } = usePostApi( azureBaseURL );
	let rowMarkup = [];
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const colleaguesData = useRecoilValue( colleaguesDataState );
	const setUpdateTable = useSetRecoilState( updateTableState );
	const setParentcustomerid = useSetRecoilState( parentcustomeridValue );
	const setModalActive = useSetRecoilState( modalEndUserState );
	const [ loadingBtn, setLoadingBtn ] = useState( false );

	useIndexResourceState( colleaguesData );
	const [ selectedResource, setSelectedResource ] = useState( null );

	const handleAddUser = () => {
		console.log( selectedResource );
		setLoadingBtn( true );
		let contact = colleaguesData.find( function ( col, index ) {
			if ( col.emailaddress1 === selectedResource ) {
				return colleaguesData[ index ]
			}
		} );
		if ( selectedResource ) {
			let contactId = contact.contactid;
			setParentcustomerid( contactId );
			// console.log( "contactId: " + contactId );
			// console.log( "licenseid: " + id );

			post( 'dynamics_add_end_user', {
				auth0_id: user.sub,
				contactId: contactId,
				licenseid: id
			} ).then( ( { data: val } ) => {

				console.log( val )
				setToastActive( true );
				if ( val.status !== 204 ) {
					setToastError( true )
					setApiMessage( <IntToasterMessage id='errorAddingUser' message='One or more persons you have attempted to add is already an End User of this license. Update your selections and try again.' /> );
				} else {
					setApiMessage( <IntToasterMessage id='userAdded' message='User added successfully' /> );
					setToastError( false );
					setModalActive( false );
				}
				setUpdateTable( updateTable => !updateTable );
				console.warn( val );
				setLoadingBtn( false )
			} ).finally( () => {
				setLoadingBtn( false )
			} );
		}
	}

	if ( colleaguesData && colleaguesData.length ) {
		rowMarkup = colleaguesData.map(
			( { firstname, lastname, jobtitle, emailaddress1, telephone1 }, index ) => (
				<IndexTable.Row
					key={emailaddress1}
					selected={selectedResource === emailaddress1}
					position={index}
					id={emailaddress1}
				>
					<IndexTable.Cell>{firstname + ' ' + lastname}</IndexTable.Cell>
					<IndexTable.Cell>{jobtitle}</IndexTable.Cell>
					<IndexTable.Cell>{emailaddress1}</IndexTable.Cell>
					<IndexTable.Cell>{telephone1}</IndexTable.Cell>
				</IndexTable.Row>
			),
		);
	}


	return (
		<>
			<IndexTable
				itemCount={colleaguesData ? colleaguesData.length : 0}
				selectedItemsCount={selectedResource ? 1 : 0}
				onSelectionChange={( type, _, selection ) => {
					if ( type === "single" ) {
						setSelectedResource( selection );
					} else {
						setSelectedResource( null );
					}
				}}
				headings={[
					{ title: <FormattedMessage id="fullName" defaultMessage="Full Name" /> },
					{ title: <FormattedMessage id="jobTitle" defaultMessage='Job Title' /> },
					{ title: <FormattedMessage id="email" defaultMessage='Email' /> },
					{ title: <FormattedMessage id="businessPhone" defaultMessage='Business Phone' /> },
				]}
			>
				{rowMarkup}
			</IndexTable>
			<div style={{ color: '#0070c0', display: 'flex', justifyContent: 'flex-end' }}>
				<Button onClick={() => handleAddUser()} loading={loadingBtn} monochrome outline disabled={!selectedResource}>
					<FormattedMessage id="addUser" defaultMessage="Add User" />
				</Button>
			</div>
		</>
	);
}
