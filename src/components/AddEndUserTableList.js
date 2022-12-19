import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeComponentAtom,
	colleaguesDataState,
	idLicense, modalEndUserState,
	parentcustomeridValue,
	toastApiMessageState,
	toastErrorState,
	toastState,
	updateTableState
} from "../atoms/profileAtom";
import { usePostApi } from "../api/usePostApi";
import { Button, DataTable, useIndexResourceState } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import copyArr from "../helpers/copyArr";
import usePagination from "./usePagination";
import Paginator from "./Paginator";
import IntToasterMessage from "../helpers/IntlToasterMessage";

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );

	return tempArray.sort( ( rowA, rowB ) => {
		const amountA = rowA[ index ] ? rowA[ index ].toLowerCase() : null;
		const amountB = rowB[ index ] ? rowB[ index ].toLowerCase() : null;

		if ( amountB < amountA ) {
			return direction === 'descending' ? -1 : 1;
		}
		if ( amountB > amountA ) {
			return direction === 'ascending' ? -1 : 1;
		}

		return 0
	} );
}

const adapterColleague = ( raw ) => {
	return raw.map( r => {

		return ([
				r.emailaddress1,
				r.firstname + ' ' + r.lastname,
				r.jobtitle,
				r.emailaddress1,
				r.telephone1,
				r.contactid,
			]
		)
	} )
}

export default function AddEndUserTableList () {
	const { user } = useAuth0();
	const id = useRecoilValue( idLicense )
	// console.log(id)
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { post } = usePostApi( azureBaseURL );
	const [ rows, setRows ] = useState( [] );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ colleaguesData, setColleaguesData ] = useRecoilState( colleaguesDataState );
	const [ adaptedColleaguesData, setAdaptedColleaguesData ] = useState( [] );
	const setUpdateTable = useSetRecoilState( updateTableState );
	const setParentcustomerid = useSetRecoilState( parentcustomeridValue );
	const setModalActive = useSetRecoilState( modalEndUserState );
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ activeComponent, setActiveComponent ] = useRecoilState( activeComponentAtom );

	// useIndexResourceState( colleaguesData );
	const [ selectedResource, setSelectedResource ] = useState( null );
	const [ selectedItemsCount, setSelectedItemsCount ] = useState( 0 );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesData( adaptedColleaguesData => sortTable( adaptedColleaguesData, index, direction ) ),
		[ adaptedColleaguesData ],
	);

	const { paged, handlePagination, page, maxPages, handleViewAll } = usePagination( rows, 10 )

	useEffect( () => {
		setAdaptedColleaguesData( sortTable( adapterColleague( colleaguesData ), 4, 'descending' ) );
	}, [colleaguesData] )


	const handleAddUser = () => {
		// console.log( selectedResource );
		setLoadingBtn( true );
		let contact = colleaguesData.find( function ( col, index ) {
			if ( col.emailaddress1 === selectedResource ) {
				return colleaguesData[ index ]
			}
		} );
		if ( selectedResource ) {
			// let contactId = contact.contactid;
			let contactId = selectedResource;
			setParentcustomerid( contactId );

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

	function handleCheck ( contactid ) {
		setSelectedResource( contactid );
		setSelectedItemsCount( selectedResource ? 1 : 0 )
		// console.log( contactid )
	}

	useEffect( () => {
		if ( adaptedColleaguesData && adaptedColleaguesData.length ) {
			setRows( adaptedColleaguesData.map(
				( row, i ) => ([
						<input id={row[ 5 ]} type="checkbox" checked={selectedResource === row[ 5 ]} onChange={() => handleCheck( row[ 5 ] )} />,
						row[ 1 ],
						row[ 2 ],
						row[ 3 ],
						row[ 4 ]
					]
				),
			) );
		}
	}, [ adaptedColleaguesData, selectedResource ] )

	function handleAddUserBtn() {
		setModalActive( false );
		setActiveComponent( "manageColleaguesPage" )
	}

	return (
		<>
			<DataTable
				selectedItemsCount={selectedResource ? 1 : 0}
				hideScrollIndicator="true"
				columnContentTypes={
					[
						'text',
						'text',
						'text',
						'text',
						'text'
					]
				}
				headings={
					[
						'',
						<FormattedMessage id="fullName" defaultMessage="Full Name" />,
						<FormattedMessage id="jobTitle" defaultMessage='Job Title' />,
						<FormattedMessage id="email" defaultMessage='Email' />,
						<FormattedMessage id="businessPhone" defaultMessage='Business Phone' />,
					]
				}
				sortable={
					[
						false,
						true,
						true,
						true,
						true,
					]
				}
				rows={paged}
				defaultSortDirection="descending"
				onSort={handleSort}
				initialSortColumnIndex={3}
			/>
			<Paginator
				maxPages={maxPages}
				page={page}
				handlePagination={handlePagination}
				handleViewAll={handleViewAll}
			/>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<div style={{ color: '#202223', marginRight: "15px" }}>
						<Button onClick={() => handleAddUserBtn()} monochrome outline>
							<FormattedMessage id="createUser" defaultMessage="Create User" />
						</Button>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<div style={{ color: '#202223', marginRight: "15px" }}>
						<Button onClick={() => setModalActive( false )} monochrome outline>
							<FormattedMessage id="cancel" defaultMessage="Cancel" />
						</Button>
					</div>
					<div style={{ color: '#0070c0' }}>
						<Button onClick={() => handleAddUser()} loading={loadingBtn} monochrome outline disabled={!selectedResource}>
							<FormattedMessage id="addUser" defaultMessage="Add User" />
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
