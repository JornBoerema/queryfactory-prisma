export const ResetPasswordSchema = {
	password: {
		notEmpty: {
			errorMessage: "Password cannot be empty",
		},
	},
	token: {
		notEmpty: {
			errorMessage: "Token cannot be empty",
		},
	},
};
