import copyArr from "./copyArr";

export default function ( rows, index, direction ) {
	let tempArray = copyArr( rows );

	// console.log(index)

	// sort number
	if ( index === 3 ) {
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

	// if ( index === 4 ) {
	// 	index = 0; //sorting by licenseid not by licensesid
	// }
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
