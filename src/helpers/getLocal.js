export default function getLocal () {
	const html = document.getElementsByTagName( 'html' )[ 0 ];
	//console.log(locale);

	return html.getAttribute( 'lang' );
}
