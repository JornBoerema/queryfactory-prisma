export const CreateTeamSchema = {
	name: {
		notEmpty: {
			errorMessage: "Name cannot be empty",
		},
	},
};
