export const ForgotPasswordSchema = {
	email: {
		notEmpty: {
			errorMessage: "Email cannot be empty",
		},
	},
};
