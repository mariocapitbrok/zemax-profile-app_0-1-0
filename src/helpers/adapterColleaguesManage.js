export default function adapterColleaguesManage ( raw ) {
	return raw.map( r => {

		return ([
				r.firstname,
				r.lastname,
				r.jobtitle,
				r.emailaddress1,
				r.telephone1,
				r.contactid,
				r.statecode,
			]
		)
	} )
}
