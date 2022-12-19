export default function adapterLicenseStudent ( raw ) {
	return raw.map( r => {

		return ([
				r.new_supportexpires,
				r.new_supportexpires,
				r.new_licenseid,
				r.zemax_nickname,
				r[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
				r[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
				r[ '_new_registereduser_value@OData.Community.Display.V1.FormattedValue' ]
			]
		)
	} )
}
