export const LoginSchema = {
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
