import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	modalResetPasswordAtom,
	resetPasswordColleagueValue, toastApiMessageState, toastErrorState,
	toastState
} from "../atoms/profileAtom";
import { Modal, TextContainer, DisplayText } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { usePostApi } from "../api/usePostApi";
import { useAuth0 } from "@auth0/auth0-react";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export default function ResetPasswordConfirmation () {
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ modalResetPassword, setModalResetPassword ] = useRecoilState( modalResetPasswordAtom );
	const resetPasswordColleagueId = useRecoilValue( resetPasswordColleagueValue );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ loading, setLoading ] = useState( true );
	const { user } = useAuth0();
	// const azureBaseURL = 'http://localhost:7071/api/';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	const { post } = usePostApi( azureBaseURL );

	useEffect( () => {
		setLoading( false );
		// console.log( resetPasswordColleagueId )
	}, [] )

	const handleCancel = function () {
		setModalResetPassword( false )
	}

	const handleSubmit = function () {

		setLoadingBtn( true );
		post( 'dynamics_resetpassword_contactid', {
			auth0_id: user.sub,
			contactid: resetPasswordColleagueId

		} ).then( ( resp ) => {
			// console.log( resp.data );
			if ( resp.data.status === 200 ) {
				setToastError( false );
				setApiMessage( <IntToasterMessage id='resetPassword' message='Reset Email was sent successfully' /> );
				setTimeout( () => setModalResetPassword( false ), 2000 )
			} else {
				setToastError( true );
				setApiMessage( <IntToasterMessage id='somethingWentWrong' message='Something went wrong!' /> ) //<IntToasterMessage id='save' message='Save' />
			}
		} ).catch( () => {
			setToastError( true );
			setApiMessage( <IntToasterMessage id='somethingWentWrong' message='Something went wrong!' /> )
		} ).finally( () => {
			setLoadingBtn( false );
			setToastActive( true );
		} )
	}

	return (
		<>
			<Modal
				loading={loading}
				open={modalResetPassword}
				large={false}
				onClose={() => setModalResetPassword( false )}
				title={<FormattedMessage id="confirmationRequired" defaultMessage="Confirmation Required" />}
				primaryAction={{
					content: <FormattedMessage id="sendPassword" defaultMessage="Send Password Reset Email" />,
					destructive: true,
					loading: loadingBtn,
					outline: true,
					onAction: handleSubmit,
				}}
				secondaryActions={[
					{
						content: <FormattedMessage id="cancel" defaultMessage="Cancel" />,
						onAction: handleCancel,
					},
				]}
			>
				<Modal.Section>
					<TextContainer>
						<DisplayText size="medium">
							<FormattedMessage id="confirmResetPasswordText" defaultMessage="Please confirm this action to generate the password reset email" />
						</DisplayText>
					</TextContainer>
				</Modal.Section>
			</Modal>
		</>
	)
}
