import {
	atom
} from 'recoil';

export const activeComponentAtom = atom( {
	key: 'activeComponent', // unique ID (with respect to other atoms/selectors)
	default: 'mainPage', // default value (aka initial value)
} );

export const idLicense = atom( {
	key: 'idLicense',
	default: '',
} );

export const toastState = atom( {
	key: 'toastActive',
	default: false,
} );

export const toastErrorState = atom( {
	key: 'toastError',
	default: false,
} );

export const toastApiMessageState = atom( {
	key: 'apiMessage',
	default: '',
} );

export const toastShowDuration = atom( {
	key: 'showDuration',
	default: 4200,
} );

export const colleaguesDataState = atom( {
	key: 'colleaguesData',
	default: [],
} );

export const parentcustomeridValue = atom( {
	key: 'parentcustomerid',
	default: '',
} );

export const modalEndUserState = atom( {
	key: 'active',
	default: false,
} );

export const endUserDateState = atom( {
	key: 'endUserDate',
	default: {
		license_detail: {},
		users: {},
		licenseid: ''
	},
} );

export const modalChangeUserState = atom( {
	key: 'modalChangeActive',
	default: false,
} );
//
// export const updateLicensesState = atom( {
// 	key: 'updateLicenses',
// 	default: false,
// } );

export const updateLicensesTable = atom( {
	key: 'updateLicenses',
	default: false,
} );

export const availableAddEndUser = atom( {
	key: 'availableAddUser',
	default: true,
} );

export const modalAssignLicenseState = atom( {
	key: 'modalAssignLicenseActive',
	default: false,
} );

export const licensesObjectAssignValue = atom( {
	key: 'licensesObjectAssign',
	default: [],
} );

export const changeUserValue = atom( {
	key: 'changeUserId',
	default: '',
} );

export const webRolesState = atom( {
	key: 'rolesData',
	default: [],
} );

export const endUsersDataState = atom( {
	key: 'endUsersData',
	default:
		{
			license_detail: {},
			users: {},
			licenseid: ''
		}
} );

export const updateTableState = atom( {
	key: 'updateTable',
	default: false,
} );

export const updateManageUserTableState = atom( {
	key: 'updateManageUserTable',
	default: false,
} );

export const modalAddColleagueAtom = atom( {
	key: 'modalAddColleague',
	default: false,
} );

export const modalEditColleagueAtom = atom( {
	key: 'modalEditColleague',
	default: false,
} );

export const modalResetPasswordAtom = atom( {
	key: 'modalResetPassword',
	default: false,
} );

export const modalConfirmationDeleteState = atom( {
	key: 'modalConfirmationDelete',
	default: false,
} );

export const editColleagueValue = atom( {
	key: 'editColleagueId',
	default: '',
} );

export const resetPasswordColleagueValue = atom( {
	key: 'resetPasswordColleagueId',
	default: '',
} );

export const licensesObjectAtom = atom( {
	key: 'licensesObject',
	default: [],
} );

export const webRoleAdministrator = atom( {
	key: 'idAdmin',
	default: false,
} );

export const getRolesState = atom( {
	key: 'getRoles',
	default: false,
} );

export const preferredLanguageValue = atom( {
	key: 'preferredLanguage',
	default: 'en',
} );

export const webRoleTemp = atom( {
	key: 'idTemp',
	default: false,
} );

export const webRoleStudent = atom( {
	key: 'idStudent',
	default: false,
} );

export const contactidValue = atom( {
	key: 'contactid',
	default: '',
} );

export const zendeskidValue = atom( {
	key: 'zemax_zendeskid',
	default: '',
} );

export const userDetailsState = atom( {
	key: 'userDetails',
	default: [],
} );

export const createdOnValue = atom( {
	key: 'createdon',
	default: '',
} );

export const modifiedOnValue = atom( {
	key: 'last_change',
	default: '',
} );

export const namedUserValue = atom( {
	key: 'namedUser',
	default: false,
} );

export const showLockBannerState = atom( {
	key: 'showLockBanner',
	default: false,
} );

export const lockTransferState = atom( {
	key: 'lockTransfer',
	default: false,
} );

export const dateLockBannerState = atom( {
	key: 'dateLockBanner',
	default: '',
} );

export const seatTypeValue = atom( {
	key: 'seatType',
	default: '',
} );

export const removedIdUserValue = atom( {
	key: 'removedIdUser',
	default: '',
} );

export const ticketDataState = atom( {
	key: 'ticketData',
	default: [],
} );

export const unsupportedUserState = atom( {
	key: 'unsupportedUser',
	default: false,
} );

export const tradeInStateButton = atom( {
	key: 'isTradeIn',
	default: false,
} );




