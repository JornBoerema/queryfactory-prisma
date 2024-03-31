import sgMail from "@sendgrid/mail";

const baseURL = "http://localhost:3000";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendForgotPasswordEmail = async (email: string, token: string) => {
	const resetURL = `${baseURL}/reset-password?token=${token}`;

	try {
		await sgMail.send({
			to: email,
			from: "jornboerema05@gmail.com",
			subject: "Forgot password",
			html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`,
		});
	} catch (err: any) {
		console.error(JSON.stringify(err.response.body, null, 2));
	}
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const resetURL = `${baseURL}/verify-email?token=${token}`;

	await sgMail.send({
		to: email,
		from: "jornboerema05@gmail.com",
		subject: "Verify email",
		html: `<p>Click <a href="${resetURL}">here</a> to verify your email</p>`,
	});
};
