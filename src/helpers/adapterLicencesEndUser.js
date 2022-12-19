export default function adapterLicencesEndUser ( raw ) {
	return raw.map( r => {

		return ([
				r[ 'new_licenses1.new_licenseid' ],
				r[ 'new_licenses1.new_supportexpires' ],
				r[ 'new_licenses1.new_supportexpires' ],
				r[ 'new_licenses1.new_product@OData.Community.Display.V1.FormattedValue' ],
				r[ 'new_licenses1.new_registereduser@OData.Community.Display.V1.FormattedValue' ],
				r[ 'new_licenses1.zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
				r[ 'new_licenses1.new_usercount' ],
				r[ 'new_licenses1.new_endusercount' ],
				r.createdon
			]
		)
	} )
}
