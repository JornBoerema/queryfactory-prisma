export const VerifyEmailSchema = {
	token: {
		notEmpty: {
			errorMessage: "Token cannot be empty",
		},
	},
};
