export default function adapterLicenseManage ( raw ) {
	return raw.map( r => {

		return ([
				r.new_licenseid,
				r.new_supportexpires,
				r.new_supportexpires,
				r.new_licensesid,
				r.zemax_nickname,
				r[ '_new_product_value@OData.Community.Display.V1.FormattedValue' ],
				r[ 'zemax_seattype@OData.Community.Display.V1.FormattedValue' ],
				r.new_usercount,
				r.new_endusercount,
				r[ '_new_product_value' ],
				r[ '_new_registereduser_value@OData.Community.Display.V1.FormattedValue' ]
			]
		)
	} )
}
