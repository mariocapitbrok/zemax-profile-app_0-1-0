import { Button, Card, DataTable, Spinner, DisplayText } from "@shopify/polaris";
import AddEndUser from "./AddEndUser";
import React, { useEffect, useState } from "react";
import {
	availableAddEndUser,
	changeUserValue,
	endUserDateState,
	idLicense,
	lockTransferState,
	modalChangeUserState,
	modalConfirmationDeleteState,
	modifiedOnValue,
	removedIdUserValue, updateTableState,
} from "../atoms/profileAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
// import { useDeleteApi } from "../api/useDeleteApi";
// import { useAuth0 } from "@auth0/auth0-react";
import ChangeEndUser from "./ChangeEndUser";
import RemoveConfirmation from "./modalConfirmationRemove";
import { FormattedMessage } from "react-intl";

export default function EndUsers () {
	const endUsersData = useRecoilValue( endUserDateState );
	const id = useRecoilValue( idLicense )
	const [ isLoaded, setIsLoaded ] = useState( false );
	const setChangeUser = useSetRecoilState( changeUserValue );
	const setAvailableAddUser = useSetRecoilState( availableAddEndUser );
	const setModalChangeActive = useSetRecoilState( modalChangeUserState );
	const setConfirmationDelete =  useSetRecoilState( modalConfirmationDeleteState )
	const setRemovedIdUser =  useSetRecoilState( removedIdUserValue )
	const setLast_change = useSetRecoilState( modifiedOnValue );
	const lockTransfer = useRecoilValue( lockTransferState );
	const updateTable = useRecoilValue( updateTableState );
	let endUsers = 0;
	let seatCount;
	//console.log('lockTransfer ' + lockTransfer);

	function removeProductUser ( productuserid, lockTransfer ) {
		if (!lockTransfer) {
			setRemovedIdUser( productuserid )
			// setLoadingRemoveBtn( true );
			setConfirmationDelete(true);
		}
	}

	function changeProductUser ( productuserid, lockTransfer ) {
		console.log( productuserid )
		if (!lockTransfer) {
			setChangeUser( productuserid );
			setModalChangeActive( true );

			return true;
		}
	}

	useEffect( () => {
		if ( endUsersData.license_detail && endUsersData.license_detail.length) {
			seatCount = endUsersData.license_detail[ 0 ].new_usercount;
			endUsers = endUsersData.users.length || 0;

			//console.log(endUsersData)
			let seatTypeIndividual = endUsersData.license_detail[ 0 ].zemax_seattype !== 555030001;
			if ( seatTypeIndividual ) {
				setAvailableAddUser( endUsers < seatCount )
				// console.log(endUsers > seatCount )
				// setAvailableAddUser( true )
			} else {
				setAvailableAddUser( true )
			}
		}
		setIsLoaded(true);

	}, [ endUsersData, id, updateTable, lockTransfer ] )

	useEffect( () => {
		if ( endUsersData.users && endUsersData.users.length ) {
			seatCount = endUsersData.license_detail[ 0 ].new_usercount
			endUsers = endUsersData.users.length;

			if (endUsers !== 0 ) {
				setLast_change( endUsersData.users[ 0 ][ 'zemax_lastassigned' ] )
			}
		}
	},[ endUsersData, id, updateTable, lockTransfer ] )

	if ( endUsersData.users && endUsersData.users.length ) {
		/*seatCount = endUsersData.license_detail[ 0 ].new_usercount
		endUsers = endUsersData.users.length;
		// console.log(endUsersData.license_detail[ 0 ])
		//console.log(endUsersData.users[0]['contact1.modifiedon'])
		if (endUsers !== 0 ) {
			setLast_change( endUsersData.users[ 0 ][ 'modifiedon' ] )
		}*/

		// console.log( 'seatTypeIndividual: ' + seatTypeIndividual )
		// console.log(endUsers > seatCount && seatTypeIndividual);
		//console.log( 'availableAddUser: ' + availableAddUser )

		const rowsUsers = endUsersData.users.map( ( row, id ) => ([
			row[ 'contact1.fullname' ],
			row[ 'contact1.emailaddress1' ],
			row[ 'contact1.jobtitle' ],
			row[ 'contact1.telephone1' ],
			<div style={{ color: '#bf0711' }}>
				<Button size="slime" disabled={lockTransfer} lockTransfer={lockTransfer} monochrome outline onClick={() => {removeProductUser( row[ 'new_productuserid' ] )}}>
					<FormattedMessage id="removeUser"
									  defaultMessage="Remove User"
					/>
				</Button>
			</div>,
			<div style={{ color: '#0070c0' }}>
				<Button size="slime" disabled={lockTransfer} lockTransfer={lockTransfer} monochrome outline onClick={() => {changeProductUser( row[ 'new_productuserid' ] )}}>
					<FormattedMessage id="changeEndUser"
									  defaultMessage="Change End User"
					/>
				</Button>
			</div>
		]) )

		return (
			<>
				<AddEndUser />
				<ChangeEndUser />
				<RemoveConfirmation />
				<Card>
					<DataTable
						columnContentTypes={[
							'text',
							'text',
							'text',
							'text',
							'text',
							'text',
						]}
						headings={[
							<FormattedMessage id="fullName"
											  defaultMessage="Name" />,
							<FormattedMessage id="email"
											  defaultMessage="Email" />,
							<FormattedMessage id="jobTitle"
											  defaultMessage="Job Title" />,
							<FormattedMessage id="phone"
											  defaultMessage="Phone" />,
							'',
							''
						]} rows={rowsUsers}
					/>
				</Card>
			</>
		)
	}
	return (
		<>
			<AddEndUser />
			{!isLoaded && (<Spinner size="small" />)
			}
			<DisplayText size="small">
				<FormattedMessage id="licenseNotHaveEndUser"
								  defaultMessage="This license does not currently have an end user. To add and end user, please click the Add End User button." />
			</DisplayText>
		</>
	)
}
