import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	activeComponentAtom,
	changeUserValue,
	colleaguesDataState,
	modalChangeUserState,
	toastApiMessageState,
	toastErrorState,
	toastState,
	updateTableState
} from "../atoms/profileAtom";
import { usePatchApi } from "../api/usePatchApi";
import { Button, DataTable } from "@shopify/polaris";
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

export default function ChangeEndUserTable () {
	const { user } = useAuth0();
	// const id = useRecoilValue( idLicense )
	// console.log(id)
	// let id = 'b7a292a8-6389-ea11-a812-000d3a329613';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { patch } = usePatchApi( azureBaseURL );

	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const colleaguesData = useRecoilValue( colleaguesDataState );
	const [ adaptedColleaguesData, setAdaptedColleaguesData ] = useState( [] );
	const setUpdateTable = useSetRecoilState( updateTableState );
	const changeUser = useRecoilValue( changeUserValue );
	const setModalChangeActive = useSetRecoilState( modalChangeUserState );
	const [ loadingBtn, setLoadingBtn ] = useState( false );
	const [ selectedResource, setSelectedResource ] = useState( null );
	const [ rows, setRows ] = useState( [] );

	// useIndexResourceState( colleaguesData );

	const handleSort = useCallback(
		( index, direction ) => setAdaptedColleaguesData( adaptedColleaguesData => sortTable( adaptedColleaguesData, index, direction ) ),
		[ adaptedColleaguesData ],
	);
	const { paged, handlePagination, page, maxPages, handleViewAll } = usePagination( rows, 10 );
	const [ activeComponent, setActiveComponent ] = useRecoilState( activeComponentAtom );

	useEffect( () => {
		console.log(colleaguesData)
		setAdaptedColleaguesData( sortTable( adapterColleague( colleaguesData ), 4, 'descending' ) );
	}, [colleaguesData] )

	const handleChangeUser = () => {
		// console.log( selectedResource );
		// setLoadingBtn( true );
		let contact = colleaguesData.find( function ( col, index ) {
			if ( col.emailaddress1 === selectedResource ) {
				return colleaguesData[ index ]
			}
		} );
		if ( selectedResource ) {
			setLoadingBtn( true );
			// console.log( "contactId: " + contactId );
			// console.log( "licenseid: " + id );
			// console.log( "productuser_id: " + changeUser )

			patch( 'dynamics_change_enduser_license', {
				auth0_id: user.sub,
				contact_id: selectedResource,
				new_productuserid: changeUser
			} ).then( ( { data: val } ) => {

				// console.log( val )
				setToastActive( true );
				if ( val.status !== 204 ) {
					setToastError( true )
					// setApiMessage( val.message );
					setApiMessage( <IntToasterMessage id='somethingWentWrong' message='Something went wrong!' /> );
				} else {
					setApiMessage( <IntToasterMessage id='userWasChanged' message='User was changed successfully' /> );
					setToastError( false );
				}
				setUpdateTable( updateTable => !updateTable );
				setTimeout( () => {
					setModalChangeActive( false )
				}, 3000 )
				console.warn( val );
			} ).finally( () => {
				setLoadingBtn( false );
			} ).catch( ( error ) => {
				setToastError( true );
				console.log(error.message)
				setApiMessage( <IntToasterMessage id='error' message='Error' /> )
			} );
		}
	}

	function handleCheck ( contactid ) {
		setSelectedResource( contactid );
		// setSelectedItemsCount( selectedResource ? 1 : 0 )
		// console.log( contactid )
	}

	function handleAddUserBtn() {
		setModalChangeActive( false );
		setActiveComponent( "manageColleaguesPage" )
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
	}, [ adaptedColleaguesData, colleaguesData, selectedResource ] )


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
				<div style={{display: "flex", justifyContent: "flex-end"}}>
					<div style={{ color: '#202223', marginRight: "15px" }}>
						<Button onClick={() => setModalChangeActive( false )} monochrome outline>
							<FormattedMessage id="cancel" defaultMessage="Cancel" />
						</Button>
					</div>
					<div style={{ color: '#0070c0', display: "flex", justifyContent: "flex-end" }}>
						<Button
							onClick={() => handleChangeUser()}
							loading={loadingBtn}
							disabled={!selectedResource}
							monochrome
							outline>
							<FormattedMessage id="changeEndUser"
											  defaultMessage="Change User"
							/>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
