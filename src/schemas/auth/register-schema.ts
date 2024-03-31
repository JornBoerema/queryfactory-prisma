export const RegisterSchema = {
	firstName: {
		notEmpty: {
			errorMessage: "First name cannot be empty",
		},
	},
	lastName: {
		notEmpty: {
			errorMessage: "Last name cannot be empty",
		},
	},
	email: {
		notEmpty: {
			errorMessage: "Email cannot be empty",
		},
	},
	password: {
		notEmpty: {
			errorMessage: "Password cannot be empty",
		},
	},
};
