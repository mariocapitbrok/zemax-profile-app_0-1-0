export default function ( text, number ) {
	let res;
	if ( text ) {
		const lengthText = text.length;

		if ( lengthText > number ) {
			res = text.slice( 0, number ) + "...";
			return res;
		}
	}

	return text;
}
