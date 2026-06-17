//#region node_modules/.nitro/vite/services/ssr/assets/islands-C3q311l1.js
var ISLANDS = [
	{
		value: "grande_comore",
		label: "Ngazidja (Grande Comore)"
	},
	{
		value: "anjouan",
		label: "Ndzouani (Anjouan)"
	},
	{
		value: "moheli",
		label: "Mwali (Mohéli)"
	},
	{
		value: "mayotte",
		label: "Mayotte"
	}
];
function islandLabel(v) {
	if (!v) return "—";
	return ISLANDS.find((i) => i.value === v)?.label ?? v;
}
//#endregion
export { islandLabel as n, ISLANDS as t };
