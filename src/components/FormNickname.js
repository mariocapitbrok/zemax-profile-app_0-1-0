import React, { useCallback, useState } from "react";
import { TextField, Button } from "@shopify/polaris";
import { usePatchApi } from "../api/usePatchApi";
import { useAuth0 } from "@auth0/auth0-react";
import { idLicense, toastApiMessageState, toastErrorState, toastState } from "../atoms/profileAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FormattedMessage } from "react-intl";
import IntToasterMessage from "../helpers/IntlToasterMessage";

export default function FormNickname ( nickname ) {
	const { user } = useAuth0();
	const [ value, setValue ] = useState( nickname.nickname );
	const [ loadingSaveBtn, setLoadingSaveBtn ] = useState( false );
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { patch } = usePatchApi( azureBaseURL );
	const setToastActive = useSetRecoilState( toastState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const setToastError = useSetRecoilState( toastErrorState );
	const idLic = useRecoilValue( idLicense )

	const handleChange = useCallback( newValue => setValue( newValue ), [] );

	const saveNickname = () => {
		setLoadingSaveBtn( true );
		if ( value !== 'undefined' ) {
			patch( 'dynamics_set_license_nickname', { id: idLic, nickname: value, auth0_id: user.sub } ).then( () => {
				setLoadingSaveBtn( false );
				setToastActive( true );
				setToastError( false );
				// setApiMessage( "Saved" );
				setApiMessage( <IntToasterMessage id='save' message='Save' /> );
				setValue( value );
			} );
		}
	}

	return (
		<>
			<TextField label='' value={value} placeholder='License nickname' onChange={handleChange} maxLength='30' />
			<div style={{ color: '#0070c0' }}>
				<Button onClick={() => saveNickname( value )} loading={loadingSaveBtn} monochrome outline>
					<FormattedMessage id="save"
									  defaultMessage="Save" />
				</Button>
			</div>
		</>
	)
}
