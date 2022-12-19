import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	availableAddEndUser,
	colleaguesDataState,
	idLicense,
	modalEndUserState,
	updateTableState
} from '../atoms/profileAtom';
import { DisplayText, Modal, TextContainer, Button } from "@shopify/polaris";
import SimpleIndexTableExample from "./SimpleIndexTableExample";
import { FormattedMessage } from "react-intl";
import AddEndUserTableList from "./AddEndUserTableList";
// import { humanityDate } from "./ZendeskTickets";

export default function AddEndUser () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { get } = useAuthorizedApi( azureBaseURL );
	const setColleaguesData = useSetRecoilState( colleaguesDataState );
	const id = useRecoilValue( idLicense )
	const availableAddUser = useRecoilValue( availableAddEndUser );
	const [ modalActive, setModalActive ] = useRecoilState( modalEndUserState );
	const updateTable = useRecoilValue( updateTableState );
	const [ loading, setLoading ] = useState( true );

	const activator = (
		<div style={{ color: "rgb(0, 112, 192)" }}><Button onClick={() => setModalActive( true )} monochrome outline>
			<FormattedMessage id="addEndUser" defaultMessage="Add End User" />
		</Button></div>);

	useEffect( () => {
		get( 'dynamics_get_colleagues_view', { auth0_id: user.sub } ).then( ( { data: val } ) => {
			// console.warn( val[ 'colleagues' ] );
			setColleaguesData( val[ 'colleagues' ] );
			// console.log( colleaguesData );
			setLoading( false );
		} );
	}, [ updateTable, id ] )

	// console.log(availableAddUser)

	return (
		<div style={{
			display: "flex",
			justifyContent: "space-between",
			marginTop: "40px",
			marginBottom: "20px"
		}}>
			<div>
				<DisplayText size="medium">
					<FormattedMessage id="endUsers"
									  defaultMessage="End Users"
					/>
				</DisplayText>
			</div>
			<Modal
				activator={availableAddUser ? activator : ''}
				loading={loading}
				open={modalActive}
				large={true}
				// onClose={handleChange}
				onClose={() => setModalActive( false )}
				title={<FormattedMessage id="addEndUserToLicense" defaultMessage="Add End User to License" />}
			>
				<Modal.Section>
					<TextContainer>
						{/*<SimpleIndexTableExample />*/}
						<AddEndUserTableList />
					</TextContainer>
				</Modal.Section>
			</Modal>
		</div>
	)
}
