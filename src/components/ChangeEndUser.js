import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useRecoilState, useSetRecoilState } from "recoil";
import { colleaguesDataState, modalChangeUserState } from '../atoms/profileAtom';
import {  Modal, TextContainer } from "@shopify/polaris";
// import Link from "./Link";
import ChangeEndUserTable from "./ChangeEndUserTable";
import { FormattedMessage } from "react-intl";

export default function ChangeEndUser () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
// const azureBaseURL = 'http://localhost:7071/api/';
	const { get } = useAuthorizedApi( azureBaseURL );
	const setColleaguesData = useSetRecoilState( colleaguesDataState );
	const [ modalChangeActive, setModalChangeActive ] = useRecoilState( modalChangeUserState );
	const [ loading, setLoading ] = useState( true );
	// const toggleModalActive = useCallback( () => setModalActive( modalActive => !modalActive ), [ modalActive ] );


	useEffect( () => {
		get( 'dynamics_get_colleagues_view', { auth0_id: user.sub } ).then( ( { data: val } ) => {
			// console.warn( val );
			setColleaguesData( val[ 'colleagues' ] );
			// console.log( colleaguesData );
			setLoading( false );
		} );
	}, [] )

	const handleChange = () =>{
		setModalChangeActive( false )
	}

	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between"
		}}>
			<Modal
				loading={loading}
				open={modalChangeActive}
				large={true}
				// small={true}
				onClose={handleChange}
				title={<FormattedMessage id="chooseUser" defaultMessage="Choose a User"/>}
			>
				<Modal.Section>
					<TextContainer>
						<ChangeEndUserTable />
					</TextContainer>
				</Modal.Section>
			</Modal>
		</div>
	)
}
