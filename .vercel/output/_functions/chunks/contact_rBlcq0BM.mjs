import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/contact.ts
var contact_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request }) => {
	try {
		const { name, email, message, goal, platform } = await request.json();
		if (!name || !email || !message) return new Response(JSON.stringify({ error: "Name, email, and message are required." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const contactEmail = "codivexagency@gmail.com";
		const fromEmail = "onboarding@resend.dev";
		console.log("--- DEVELOPMENT CONTACT FORM INQUIRY RECEIVED ---");
		console.log("Recipient (CONTACT_EMAIL):", contactEmail);
		console.log("Sender (RESEND_FROM_EMAIL):", fromEmail);
		console.log("Inquiry details:", {
			name,
			email,
			goal,
			platform,
			message
		});
		console.log("--------------------------------------------------");
		return new Response(JSON.stringify({
			success: true,
			message: "Inquiry simulated successfully in development mode."
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Contact API Route Error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/contact@_@ts
var page = () => contact_exports;
//#endregion
export { page };
