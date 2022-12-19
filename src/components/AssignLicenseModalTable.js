import copyArr from "../helpers/copyArr";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	editColleagueValue,
	licensesObjectAssignValue,
	modalAssignLicenseState, toastApiMessageState, toastErrorState,
	toastState,
	updateLicensesTable
} from "../atoms/profileAtom";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthorizedApi } from "../api/useAuthorizedApi";
import { usePostApi } from "../api/usePostApi";
import usePagination from "./usePagination";
import IntToasterMessage from "../helpers/IntlToasterMessage";
import { Button, DataTable, Modal, TextContainer } from "@shopify/polaris";
import { FormattedMessage } from "react-intl";
import Paginator from "./Paginator";

function sortTable ( rows, index, direction ) {
	let tempArray = copyArr( rows );
	// console.log( index )

	// sort number
	if ( index === 6 || index === 7 ) {
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

const adapterLicenseAssign = ( raw ) => {
	return raw.map( r => {

		return ([
				r.new_licenseid,
				r.new_licenseid,
				r.new_supportexpires,
				r[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
				r[ '_new_registereduser_value@OData.Community.Display.V1.FormattedValue' ],
				r[ "new_durationtype@OData.Community.Display.V1.FormattedValue" ],
				r.new_usercount,
				r.new_endusercount,
				r.new_licensesid,
			]

		)
	} )
}

export default function AssignLicenseModalTable () {
	const [ modalAssignLicenseActive, setModalAssignLicenseActive ] = useRecoilState( modalAssignLicenseState );
	const [ licensesObjectAssign, setLicensesObjectAssign ] = useRecoilState( licensesObjectAssignValue );
	const [ adaptedLicensesObjectAssign, setAdaptedLicensesObjectAssign ] = useState( [] );
	const [ selectedResource, setSelectedResource ] = useState( null );
	const [ rows, setRows ] = useState( [] );
	const editColleagueId = useRecoilValue( editColleagueValue );
	const setUpdateLicenses = useSetRecoilState( updateLicensesTable );
	const setToastActive = useSetRecoilState( toastState );
	const setToastError = useSetRecoilState( toastErrorState );
	const setApiMessage = useSetRecoilState( toastApiMessageState );
	const [ loadingBtn, setLoadingBtn ] = useState( false )
	const [ loading, setLoading ] = useState( false );
	const [ sendRequestAssign, setSendRequestAssign ] = useState( false );
	const { user } = useAuth0();
	// console.log(id)
	// let id = 'b7a292a8-6389-ea11-a812-000d3a329613';
	const azureBaseURL = process.env.REACT_APP_AZURE_BASE_URL;
	// const azureBaseURL = 'http://localhost:7071/api/';
	const { get } = useAuthorizedApi( azureBaseURL );
	const { post } = usePostApi( azureBaseURL );

	useEffect( () => {
		setLoading( true );
		if (!sendRequestAssign) {
			console.log( 'Send licenses request...' )
			setSendRequestAssign( true );
			get( 'dynamics_get_licenses_for_assign', { auth0_id: user.sub, contactid: editColleagueId } ).then( ( { data: val } ) => {
				console.warn( val );
				if ( val && val.length ) {
					setLicensesObjectAssign( val );
				}
				//setUpdateLicenses( updateLicenses => !updateLicenses )
			} ).finally( () => {
				setLoading( false );
				setTimeout(()=>{
					setSendRequestAssign(false)
					console.log('Get response licenses request...')
				}, 400)
			} );
		}

	}, [ editColleagueId ] )

	const handleSort = useCallback(
		( index, direction ) => setAdaptedLicensesObjectAssign( adaptedLicensesObjectAssign => sortTable( adaptedLicensesObjectAssign, index, direction ) ),
		[ adaptedLicensesObjectAssign ],
	);

	useEffect( () => {
		setAdaptedLicensesObjectAssign( sortTable( adapterLicenseAssign( licensesObjectAssign ), 1, 'descending' ) );
	}, [ licensesObjectAssign ] );

	function handleCheck ( id ) {
		setSelectedResource( id );
		// console.log( contactid )
	}

	const { paged, handlePagination, page, maxPages, handleViewAll } = usePagination( rows, 10 )

	useEffect( () => {
		if ( adaptedLicensesObjectAssign && adaptedLicensesObjectAssign.length ) {
			// console.log(adaptedLicensesObjectAssign)
			setRows( adaptedLicensesObjectAssign.map(
				( row ) => ([
						<input id={row[ 8 ]} type="checkbox" checked={selectedResource === row[ 8 ]} onChange={() => handleCheck( row[ 8 ] )} />,
						row[ 0 ],
						row[ 2 ],
						row[ 3 ],
						row[ 4 ],
						row[ 5 ],
						row[ 6 ],
						row[ 7 ],
					]
				),
			) );
		}
	}, [ adaptedLicensesObjectAssign, selectedResource ] )

	function handleSubmit ( licenseid ) {
		console.log( "license: " + licenseid )
		console.log( "colleage id: " + editColleagueId )
		if ( licenseid && editColleagueId ) {
			post( 'dynamics_add_end_user', {
				auth0_id: user.sub,
				contactId: editColleagueId,
				licenseid: licenseid
			} ).then( ( { data: val } ) => {

				console.log( val )
				setToastActive( true );
				if ( val.status !== 204 ) {
					setToastError( true )
					setApiMessage( <IntToasterMessage id='error' message='Error' /> );
				} else {
					setApiMessage( <IntToasterMessage id='licenseAdded' message='License added successfully' /> );
					setToastError( false );
					setTimeout( () => setModalAssignLicenseActive( false ), 2000 )
				}
				setUpdateLicenses( updateLicenses => !updateLicenses );
				// console.warn( val );
				setLoadingBtn( false );
			} ).finally( () => {
				setLoadingBtn( false )
			} );
		}
	}

	const handleCloseAssignModal = () => {
		setModalAssignLicenseActive( false )
		setSelectedResource( null )
	}

	return (
		<Modal
			loading={loading}
			open={modalAssignLicenseActive}
			large={true}
			onClose={handleCloseAssignModal}
			title={<FormattedMessage id="assignLicense"
									 defaultMessage="Assign License"
			/>}
		>
			<Modal.Section>
				<TextContainer>
					<DataTable
						hideScrollIndicator="true"
						headings={[
							'',
							<FormattedMessage id="licenseNumber"
											  defaultMessage="License #" />,
							<FormattedMessage id="supportExpiry"
											  defaultMessage="Support Expiry" />,
							<FormattedMessage id="product"
											  defaultMessage="Product" />,
							<FormattedMessage id="licenseAdministrator"
											  defaultMessage="License Administrator" />,
							<FormattedMessage id="durationType"
											  defaultMessage="Duration Type" />,
							<FormattedMessage id="userCount"
											  defaultMessage="User Count" />,
							<FormattedMessage id="endUserCount"
											  defaultMessage="End User Count" />,
						]}
						columnContentTypes={[
							'text',
							'text',
							'text',
							'text',
							'text'
						]}
						rows={paged}
						sortable={[
							false, true, true, true, true, true, true, true
						]}
						onSort={handleSort}
						efaultSortDirection="descending"
					>
					</DataTable>
					<Paginator
						maxPages={maxPages}
						page={page}
						handlePagination={handlePagination}
						handleViewAll={handleViewAll}
					/>
					<div style={{ display: "flex", justifyContent: "flex-end" }}>
						<div style={{ color: '#202223', marginRight: "15px" }}>
							<Button onClick={handleCloseAssignModal} monochrome outline>
								<FormattedMessage id="cancel" defaultMessage="Cancel" />
							</Button>
						</div>
						<div style={{ color: '#0070c0', display: 'flex', justifyContent: 'flex-end' }}>
							<Button onClick={() => handleSubmit( selectedResource )} loading={loadingBtn} disabled={!selectedResource} monochrome outline>
								<FormattedMessage id="assignLicense"
												  defaultMessage="Assign License"
								/>
							</Button>
						</div>
					</div>
				</TextContainer>
			</Modal.Section>
		</Modal>
	)
}
