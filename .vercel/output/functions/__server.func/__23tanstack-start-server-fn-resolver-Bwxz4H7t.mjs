//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Bwxz4H7t.js
var manifest = {
	"271d0f13bb1c176f2e6fa30ef36bfb1f4e0392b64ac8f1c65b1722ef94b16e6c": {
		functionName: "getConversationDetail_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"28f3886079b4dde9535b8afa97285ae3c0d990e6dd01e64101bfc42bffc9ba6c": {
		functionName: "setProfileStatus_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"2c884943555fa36a59d4f6e18ac21cd996cccec87cba75409091aaa552ecbf54": {
		functionName: "deleteProfile_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"44a442e24df564db814099bdefded66185ad933c3fe7a6d7445d2db5ab6fe8d3": {
		functionName: "getProfileDetail_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"4cabc708488eefa9661f79f77b1bd15cec3556dd3899aea80f261cc84bc7b25f": {
		functionName: "deleteMessage_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d": {
		functionName: "getAdminStats_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"6fac58f2682ac346176b61a1647ce58c52925ac2e4c76d5ec29c62561a8ac845": {
		functionName: "resolveReport_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"9336f9d0a0666159ab9d1770f2d11b34b16a5433dc46b4f63da6c87251f1d48d": {
		functionName: "listConversations_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"c9956b44cec3c1fce949ecfd38437e467b57699a11f341d5b3196cf08648be73": {
		functionName: "listReports_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"db980dd7fbef43d3fc13d10ddc5f8ed5aae0f52362aa36d741670b7c62aab77f": {
		functionName: "setUserRole_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	},
	"fc60fc6843004350f7fc65d85fae1e4cfbf6e67f55873a7f9c5b9831e502d690": {
		functionName: "listProfiles_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-Eh-XQ6Y1.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
