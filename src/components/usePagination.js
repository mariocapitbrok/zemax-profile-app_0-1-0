import { useCallback, useEffect, useMemo, useState } from "react";


export default function usePagination ( data, perPage = 5 )
{
	const [_perPage, _setPerPage] = useState(perPage)
	const [viewAll, setViewAll] = useState(false)

	useEffect(()=>{
		if ( viewAll ) {
			_setPerPage( data.length)
		}
	}, [viewAll])

	const [ page, setPage ] = useState( 1 )
	const maxPages = Math.ceil( data.length / _perPage )
	const paged = useMemo( () => {
		return data.slice(
			(page - 1) * _perPage,
			page * _perPage
		)
	}, [ page, data, viewAll ] )

	useEffect( () => {
		if ( page > maxPages && maxPages > 0 ) {
			setPage( maxPages )
		}
	}, [ maxPages, viewAll ] )

	const handlePagination = useCallback( ( direction ) => {
		if ( direction === 'next' ) {
			setPage( curr => Math.min( curr + 1, maxPages ) )
		} else {
			setPage( curr => Math.max( curr - 1, 1 ) )
		}
	}, [ maxPages, viewAll ] )

	const handleViewAll = useCallback((state) => {
		console.warn("View state: " + state)
		if(state) {
			setViewAll(true)
			_setPerPage( data.length)
		}
	}, [_perPage, maxPages])


	return {
		paged,
		page,
		maxPages,
		handlePagination,
		handleViewAll
	}
}
