export default function adapterLicenseManageAdmin ( raw ) {
	return raw.map( r => {

		return ([
				r.new_licenseid,
				r.new_supportexpires,
				r.new_supportexpires,
				r[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
				r.zemax_nickname,
				r[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
				r.new_usercount,
				r.new_endusercount,
				r.new_licensesid,
				r[ '_new_product_value' ]
			]
		)
	} )
}
