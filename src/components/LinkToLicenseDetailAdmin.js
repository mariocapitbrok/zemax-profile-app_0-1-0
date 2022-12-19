import React from "react";
import { activeComponentAtom, idLicense } from "../atoms/profileAtom";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function LinkToLicenseDetailAdmin ( { id, name } ) {
	const [ activeComponent, setActiveComponent ] = useRecoilState( activeComponentAtom )
	const setIdlic = useSetRecoilState( idLicense )
	// console.log(id)

	function handleClick ( e ) {
		e.preventDefault();
		console.log(id);
		window.location.hash = '';
		setActiveComponent( 'LicenseDetailAdmin' );
		setIdlic( id );
		console.log( activeComponent )
	}

	return (
		<a href="#"
		   style={{
			   fontWeight: "bold",
			   color: "#0070C0",
			   borderBottom: "none",
			   textDecoration: "none",
			   "&:hover": {
				   textDecoration: "underline !important"
			   }
		   }}
		   onClick={( e ) => {
			   handleClick( e )
		   }}
		>{name}</a>
	)
}
