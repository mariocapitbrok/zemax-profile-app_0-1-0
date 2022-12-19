// 3af20681-fc11-4e19-8bdc-f7416d37cf61		Administrators
// 03a3c34f-f5a4-461f-8179-21710a52f22d		Anonymous Users
// ff54f608-70df-4637-81f7-dc40dc1b7d34		Authenticated Users
// 618187bb-b32b-4b4a-aba0-8a9771b46602		Blog Authors
// 60e0ef86-4a31-e911-a964-000d3a378ca2		CEO Blog Author
// 5bd1f11a-73a2-eb11-b1ac-0022480897c8		Consultant
// 155ac4fa-0410-e811-8105-3863bb35cc58		Content Author
// 0fe857b8-848e-e911-a973-000d3a378dd3		Content Preview
// afb83f89-e3f0-e811-a961-000d3a378f36		Customer Self Service Admin
// cc54bb9f-e1b2-e911-a839-000d3a315cfc		Educator
// 93c16008-d227-4e54-8f35-b994866a8086		Event Managers
// 3344f0b8-865b-eb11-a812-002248029f09		Intern
// f2db1fe1-d74f-e911-a972-000d3a37870e		Student Supported Access
// 33d05187-37a1-eb11-b1ac-0022480897c8		Super Admin
// db0fd7ff-fefe-e811-a964-000d3a378dd3		Supported Users LMx
// e6074e45-d830-ea11-a810-000d3a598e50		Supported Users ZOB
// c40fd448-f3c6-e811-a95e-000d3a378ca2		Supported Users ZOS
// e2ce2d9a-82ef-e911-a840-000d3a315241		Supported Users ZOV
// d271ea1f-aeec-e811-a961-000d3a37870e		Temp Supported Users
// 5af38932-8dff-e811-a964-000d3a378dd3		Zemax Staff

export const webRolesEN = [
	{
		role: 'Customer Self Service Admin',
		roleid: 'afb83f89-e3f0-e811-a961-000d3a378f36',
		display: 'You are a License Administrator',
		description: 'This means you can add new colleagues to your account, you can deactivate the records of former colleagues, you can see which licenses are in use and add or remove colleagues as End Users of licenses. You may create new tickets against any of your supported licenses.'
	},
	{
		role: 'Super Admin',
		roleid: '33d05187-37a1-eb11-b1ac-0022480897c8',
		display: 'You are a Super Administrator',
		description: 'This means you can manage all Users and licenses within your organization.'
	},
	{
		role: 'Supported Users ZOS',
		roleid: 'c40fd448-f3c6-e811-a95e-000d3a378ca2',
		display: 'You are an End User of a supported OpticStudio license',
		description: 'This means you have full access to OpticStudio Knowledgebase articles, Zemax community forums, and can open new tickets against your supported OpticStudio licenses.'
	},
	{
		role: 'Supported Users ZOB',
		roleid: 'e6074e45-d830-ea11-a810-000d3a598e50',
		display: 'You are an End User of a supported OpticsBuilder license.',
		description: 'This means you have full access to OpticsBuilder Knowledgebase articles, Zemax community forums, and can open new tickets against your supported OpticsBuilder licenses.'
	},
	{
		role: 'Supported Users ZOV',
		roleid: 'e2ce2d9a-82ef-e911-a840-000d3a315241',
		display: 'You are an End User of a supported OpticsViewer license',
		description: 'This means you have full access to the Zemax community forums and all OpticsViewer Knowledgebase articles.'
	},
	{
		role: 'Supported Users LMx',
		roleid: 'db0fd7ff-fefe-e811-a964-000d3a378dd3',
		display: 'You are an End User of a supported LensMechanix license',
		description: 'This means you have full access to LensMechanix Knowledgebase Articles, and forums. You can also open new cases against your supported LensMechanix licenses.'
	},
	{
		role: 'Educator',
		roleid: 'cc54bb9f-e1b2-e911-a839-000d3a315cfc',
		display: 'You are an Educator',
		description: 'This means you can view students at your institution.'
	},
	{
		role: 'Student Supported Access',
		roleid: 'f2db1fe1-d74f-e911-a972-000d3a37870e',
		display: 'You are a student with a Global Academic Program License',
		description: 'This means you have full access to our Knowledgebase articles and may participate in the Zemax community forums, but you may not use your Global Academic Program license to raise support tickets with our engineers. If you need help with our software, you should speak to your tutor or ask the Zemax community.'
	},
	{
		role: 'Temp Supported Users',
		roleid: 'd271ea1f-aeec-e811-a961-000d3a37870e',
		display: 'You have temporary supported access',
		description: 'This means you have full access to our Knowledgebase articles and Zemax community forums for a limited time only. You can discuss options for longer term supported access with your account manager.'
	},
	{
		role: 'undefined',
		display: 'You are unsupported',
		description: 'This means you have limited access to our Knowledgebase articles and Zemax community forums and will not be able to open new tickets.\n' +
			'To become a supported customer, you must either extend the support contract or subscription period of a license for which you are the License Administrator or End User or you need to be added as an End User of an existing supported license.'
	},
	{
		role: 'Administrators',
		roleid: '3af20681-fc11-4e19-8bdc-f7416d37cf61',
		display: 'Administrators',
		description: ''
	},
	{
		role: 'Anonymous Users',
		roleid: '03a3c34f-f5a4-461f-8179-21710a52f22d',
		display: 'Anonymous Users',
		description: ''
	},
	{
		role: 'Authenticated Users',
		roleid: 'ff54f608-70df-4637-81f7-dc40dc1b7d34',
		display: 'Authenticated Users',
		description: ''
	},
	{
		role: 'Blog Authors',
		roleid: '618187bb-b32b-4b4a-aba0-8a9771b46602',
		display: 'Blog Authors',
		description: ''
	},
	{
		role: 'CEO Blog Author',
		roleid: '60e0ef86-4a31-e911-a964-000d3a378ca2',
		display: 'CEO Blog Author',
		description: ''
	},
	{
		role: 'Consultant',
		roleid: '5bd1f11a-73a2-eb11-b1ac-0022480897c8',
		display: 'Consultant',
		description: ''
	},
	{
		role: 'Content Author',
		roleid: '155ac4fa-0410-e811-8105-3863bb35cc58',
		display: 'Content Author',
		description: ''
	},
	{
		role: 'Content Preview',
		roleid: '0fe857b8-848e-e911-a973-000d3a378dd3',
		display: 'Content Preview',
		description: ''
	},
	{
		role: 'Event Managers',
		roleid: '93c16008-d227-4e54-8f35-b994866a8086',
		display: 'Event Managers',
		description: ''
	},
	{
		role: 'Intern',
		roleid: '3344f0b8-865b-eb11-a812-002248029f09',
		display: 'Intern',
		description: ''
	},
	{
		role: 'Zemax Staff',
		roleid: '5af38932-8dff-e811-a964-000d3a378dd3',
		display: 'Zemax Staff',
		description: ''
	}
]
