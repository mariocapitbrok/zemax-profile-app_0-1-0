import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@shopify/polaris";
import React from "react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { useAuth0 } from "@auth0/auth0-react";
import AddColleague from "../components/AddColleague";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeComponentAtom,
	colleaguesDataState, editColleagueValue,
	parentcustomeridValue, updateManageUserTableState, updateTableState
} from "../atoms/profileAtom";
import Toaster from "../components/Toaster";
import EditColleague from "../components/EditColleague";
import ResetPasswordConfirmation from "../components/ResetPasswordConfirmation";
import { FormattedMessage } from "react-intl";
import ColleaguesComponent from "../components/ColleaguesComponent";

export default function ManageColleagues () {
	const { user } = useAuth0();
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const [ colleaguesData, setColleaguesData ] = useRecoilState( colleaguesDataState );
	const setParentcustomerid = useSetRecoilState( parentcustomeridValue );
	const [ sendRequestManage, setSendRequestManage ] = useState( false );
	const [ jobFunctionData, setJobFunctionData ] = useState( {} );
	const [ accountManagerData, setAccountManagerData ] = useState( [] );
	const [ loadingPage, setLoadingPage ] = useState( true );
	const updateTable = useRecoilValue( updateTableState );
	const { get } = useAuthorizedApi( azureBaseURL );
	const setEditColleagueId = useSetRecoilState( editColleagueValue );
	const updateManageUserTable = useRecoilValue( updateManageUserTableState );

	useEffect( () => {
		window.history.pushState( { page: 2 }, 'manage colleagues page' );
		// console.log( window.history.state )
	}, [] )

	window.onpopstate = function ( event ) {
		// console.log( window.history.state );
		event.preventDefault();
		window.history.replaceState( { page: 1 }, 'to main' );
		setActiveComponent( "mainPage" );
	}

	useEffect( () => {
		if ( !sendRequestManage ) {
			console.log( 'Send licenses request...' )
			setSendRequestManage( true );
			get( 'dynamics_get_colleagues_manage', { auth0_id: user.sub } ).then( ( { data: val } ) => {
				// console.warn( val );
				setColleaguesData( val.colleagues );
				setJobFunctionData( val.new_jobfunction );
				setAccountManagerData( val.account_manager );
				setParentcustomerid( val.contactid );
				setLoadingPage( false )
				window.scrollTo( 0, 0 );
				setEditColleagueId( '' );
			} ).finally( () => {
				setTimeout(()=>{
					setSendRequestManage(false)
					console.log('Get response licenses request...')
				}, 400)
			} )
		}
		;
	}, [ updateTable, updateManageUserTable ] )

	if ( colleaguesData && !loadingPage && colleaguesData.length ) {
		// console.log( colleaguesData );

		return (
			<>
				<div style={{ paddingTop: "15px", paddingBottom: "15px" }}>
					<a href="https://support.zemax.com/hc/articles/1500008380761" target="_blank" rel="noreferrer">
						<FormattedMessage id="visitKnowledgebase"
										  defaultMessage="Visit the Knowledgebase" />
					</a>
				</div>
				<ColleaguesComponent />
				<AddColleague />
				<EditColleague />
				<ResetPasswordConfirmation />
				<Toaster />
			</>
		)
	}

	return (
		<>
			{loadingPage && <Spinner size="small" />}
		</>
	)
}
