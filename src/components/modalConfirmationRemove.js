import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	modalConfirmationDeleteState, removedIdUserValue,
	toastApiMessageState, toastErrorState,
	toastState, updateTableState,
	userDetailsState
} from "../atoms/profileAtom";
import { Modal, TextContainer, DisplayText, Button } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
// import { usePostApi } from "../api/usePostApi";
import { useAuth0 } from "@auth0/auth0-react";
import { NotificationMessage } from "../pages/LicenseDetailAdmin"
import { useDeleteApi } from "../api/useDeleteApi";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export default function RemoveConfirmation () {
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ confirmationDelete, setConfirmationDelete ] = useRecoilState( modalConfirmationDeleteState )
	// const [ resetPasswordColleagueId, setResetPasswordColleagueId ] = useRecoilState( resetPasswordColleagueValue );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	// const [ seatType, setSeatType ] = useRecoilState( seatTypeValue );
	const removedIdUser = useRecoilValue( removedIdUserValue )
	const [ updateTable, setUpdateTable ] = useRecoilState( updateTableState );
	const [ loading, setLoading ] = useState( true );
	const { user } = useAuth0();
	// const azureBaseURL = 'http://localhost:7071/api/';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	const { deleteRecord } = useDeleteApi( azureBaseURL );
	useEffect( () => {
		setLoading( false );
		// console.log( resetPasswordColleagueId )
	}, [] )

	const handleCancel = function () {
		setConfirmationDelete( false )
	}
	const handleSubmit = function () {

		setLoadingBtn( true );

		if ( typeof removedIdUser !== 'undefined' ) {
			deleteRecord( 'dynamics_remove_enduser_from_license', {
				new_productuserid: removedIdUser,
				auth0_id: user.sub
			} ).then( ( { data: val } ) => {
				console.warn( val );
				setUpdateTable( updateTable => !updateTable );
				setApiMessage( <IntToasterMessage id='userWasRemoved' message='User was removed from License' /> );
				setToastActive( true );
				setToastError( false );
				setUpdateTable( true );

				return true;
			} ).finally( () => {
				// setLoadingRemoveBtn( false );
				// setDeleted( -1 )
				setLoadingBtn( false );
				setTimeout( () => {
					setConfirmationDelete( false )
				}, 2000 )
			} );
			// console.log( removedIdUser )
		}
	}

	return (
		<>
			<Modal
				loading={loading}
				open={confirmationDelete}
				large={false}
				onClose={() => setConfirmationDelete( false )}
				title={<FormattedMessage id="confirmationRequired"
										 defaultMessage="Confirmation Required" />}
				secondaryActions={{
					content: <FormattedMessage id="yesRemoveEndUser"
											   defaultMessage="Yes, remove End User" />,
					destructive: true,
					loading: loadingBtn,
					outline: true,
					onAction: handleSubmit,
				}}
				primaryAction={[
					{
						content: <FormattedMessage id="cancel"
												   defaultMessage="Cancel" />,
						outline: true,
						onAction: handleCancel,
					},
				]}
			>
				<Modal.Section>
					<TextContainer>
						<DisplayText size="medium">
							<FormattedMessage id="confirmationRemoveUserText"
											  defaultMessage="Please confirm this action to remove end user" />
						</DisplayText>
						<NotificationMessage />
					</TextContainer>
				</Modal.Section>
			</Modal>
		</>
	)
}
