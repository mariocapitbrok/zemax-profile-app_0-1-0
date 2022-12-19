import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeComponentAtom,
	colleaguesDataState, editColleagueValue, modalEditColleagueAtom, modalResetPasswordAtom,
	resetPasswordColleagueValue,
	toastApiMessageState,
	toastErrorState,
	toastState, updateManageUserTableState,
	updateTableState
} from "../atoms/profileAtom";
import { useAuth0 } from "@auth0/auth0-react";
import { usePatchApi } from "../api/usePatchApi";
import { Button, Card, Tabs } from "@shopify/polaris";
import { FormattedMessage } from "react-intl";
import adapterColleaguesManage from "../helpers/adapterColleaguesManage";
import usePagination from "./usePagination";
import ColleaguesTableManage from "./ColleaguesTableManage";
import copyArr from "../helpers/copyArr";
import IntToasterMessage from "../helpers/IntlToasterMessage";

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );
	// sort number
	if ( index === 7 ) {
		index = 6;

		return tempArray.sort( ( rowA, rowB ) => {
			const amountA = rowA[ index ];
			const amountB = rowB[ index ];

			if ( direction === 'ascending' ) {
				return amountA - amountB
			} else {
				return amountB - amountA
			}
		} );
	}

	return tempArray.sort( ( rowA, rowB ) => {
		const amountA = rowA[ index ];
		const amountB = rowB[ index ];

		if ( amountB < amountA ) {
			return direction === 'descending' ? -1 : 1;
		}
		if ( amountB > amountA ) {
			return direction === 'ascending' ? -1 : 1;
		}

		return 0
	} );
}

export default function ColleaguesComponent () {
	const [ adaptedColleaguesData, setAdaptedColleaguesData ] = useState( [] );
	const colleaguesData = useRecoilValue( colleaguesDataState );
	const { user } = useAuth0();
	const [ loadingAction, setLoadingAction ] = useState( null );
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { patch } = usePatchApi( azureBaseURL );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const setUpdateManageUserTable = useSetRecoilState( updateManageUserTableState );
	const setResetPasswordColleagueId = useSetRecoilState( resetPasswordColleagueValue );
	const setModalResetPassword = useSetRecoilState( modalResetPasswordAtom );
	const setEditColleagueId = useSetRecoilState( editColleagueValue );
	const setModalEditColleague = useSetRecoilState( modalEditColleagueAtom );
	const setActiveComponent = useSetRecoilState( activeComponentAtom );
	const updateManageUserTable = useRecoilValue( updateManageUserTableState );
	const updateTable = useRecoilValue( updateTableState );
	const [ rows, setRows ] = useState( [] );
	const [filterByStatus, setFilterByStatus ] = useState(0);
	const [ selectedTab, setSelectedTab ] = useState( 0 );
	const handleTabChange = useCallback(
		( selectedTabIndex ) => {
			setSelectedTab( selectedTabIndex )
			setFilterByStatus( selectedTabIndex )
		},
		[ adaptedColleaguesData ],
	);

	let tabsColleagues = [
		{
			id: 'active_colleagues',
			content: <FormattedMessage id="activeColleagues" defaultMessage="Active Colleagues" />,
			element: <></>
		},
		{
			id: 'deactivated_colleagues',
			content: <FormattedMessage id="deactivatedColleagues" defaultMessage="Deactivated Colleagues" />,
			element: <></>
		}
	]

	function ActionButton ( props ) {
		let { contactid, statecode } = props;
		//console.log( loadingAction )
		let colorCode;
		statecode ? colorCode = '#005800' : colorCode = "#ae0404";
		let buttonStyle = {
			color: colorCode,
			marginRight: "10px"
		}

		return (
			<div style={buttonStyle}>
				{!statecode ?
					<Button size="slime" monochrome outline onClick={() => deactivateUser( contactid )} loading={loadingAction === contactid}><FormattedMessage id="deactivateUser" defaultMessage="Deactivate User" />
					</Button> :
					<Button size="slime" monochrome outline onClick={() => activateUser( contactid )} loading={loadingAction === contactid}>
						<FormattedMessage id="activateUser" defaultMessage="Activate User" />
					</Button>}
			</div>
		)
	}

	function editUser ( contactid ) {
		setModalEditColleague( true );
		setEditColleagueId( contactid );
		// console.log("Edit user: "+ contactid)
	}

	function manageUser ( contactid ) {
		setActiveComponent( 'ManageColleague' );
		setEditColleagueId( contactid );
		// console.log("Manage user: "+ contactid)
	}

	function EditButton ( props ) {
		let { contactid } = props;
		return (<Button size="slime" monochrome outline onClick={() => editUser( contactid )}>
			<FormattedMessage id="edit" defaultMessage="Edit" />
		</Button>)
	}

	function ManageButton ( props ) {
		let { contactid } = props;
		return (<Button size="slime" monochrome outline onClick={() => manageUser( contactid )}>
			<FormattedMessage id="manage" defaultMessage="Manage" />
		</Button>)
	}

	function ResetButton ( props ) {
		let { contactid } = props;
		return (<Button size="slime" monochrome outline onClick={() => resetPassword( contactid )}>
			<FormattedMessage id="resetPassword" defaultMessage="Reset Password" />
		</Button>)
	}


	function deactivateUser ( contactid ) {
		setterLoading( contactid );
		patch( 'dynamics_deactivate_userid', { auth0_id: user.sub, contact_id: contactid } ).then( ( { data: val } ) => {
			// console.log( val );
			setToastError( false );
			setToastActive( true );
			setApiMessage( <IntToasterMessage id='userWasDeactivated' message='User was deactivated successfully' />  );
		} ).finally( () => {
			setUpdateManageUserTable( updateManageUserTable => !updateManageUserTable );
			// setterLoading( -1 )
		} )
		// console.log( 'remove event ' + contactid );
	}

	function activateUser ( contactid ) {
		setterLoading( contactid );
		patch( 'dynamics_activate_userid', { auth0_id: user.sub, contact_id: contactid } ).then( ( { data: val } ) => {
			// console.log( val );
			setToastError( false );
			setToastActive( true );
			setApiMessage( <IntToasterMessage id='userWasActivated' message='User was activated successfully' />  );
			//console.log( 'loadingAction' + loadingAction )
		} ).finally( () => {
			setUpdateManageUserTable( updateManageUserTable => !updateManageUserTable );
			// setterLoading( -1 )
		} )
		// console.log( 'activate event' + contactid );
	}

	function resetPassword ( contactid ) {
		setResetPasswordColleagueId( contactid );
		setModalResetPassword( true );
		// console.log( 'Reset modal open for ' + contactid );
	}

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesData( adaptedColleaguesData => sortTable( adaptedColleaguesData, index, direction ) ),
		[ adaptedColleaguesData ],
	);

	useEffect( () => {
		setAdaptedColleaguesData( sortTable( adapterColleaguesManage( colleaguesData ), 0, 'descending' ) );
		// setLoadingAction( -1 )
	}, [ updateTable, updateManageUserTable, colleaguesData ] )

	useEffect( () => {
		setterLoading( -1 )
	}, [ updateManageUserTable ] )

	function setterLoading ( id ) {
		// console.log( id )
		setLoadingAction( id );
	}

	const
		{ paged, handlePagination, page, maxPages, handleViewAll }
			= usePagination( rows, 10 )

	useEffect( () => {
		// console.log( colleaguesData )

		setRows( adaptedColleaguesData
			.filter((row)=> row[6] === filterByStatus)
			.map( row => ([
			row[ 0 ],
			row[ 1 ],
			row[ 2 ],
			row[ 3 ],
			row[ 4 ],
			<EditButton contactid={row[ 5 ]} />,
			<ResetButton contactid={row[ 5 ]} />,
			<ActionButton contactid={row[ 5 ]} statecode={row[ 6 ]} />,
			<ManageButton contactid={row[ 5 ]} />,
		]) ) )
	}, [ adaptedColleaguesData, updateManageUserTable, colleaguesData, filterByStatus ] )

	return (
		<Card>
			<Tabs selected={selectedTab}
				  onSelect={handleTabChange}
				  tabs={tabsColleagues}
				  title={tabsColleagues[ selectedTab ].content}
			>
			</Tabs>
			<ColleaguesTableManage
				adaptedColleaguesData={adaptedColleaguesData}
				rows={paged}
				handleSort={handleSort}
				page={page}
				maxPages={maxPages}
				handlePagination={handlePagination}
				handleViewAll={handleViewAll}
			/>
		</Card>
	)
}
