import StyleDictionary from "style-dictionary"
import * as Utils from "./utils"
import _ from "lodash"


const constructCssName = (path: any[]): string =>
{
	let newName = path.includes("Global") ? path.join("") : `color${path.join("")}`
	newName = newName.charAt(0).toLowerCase() + newName.slice(1)
	newName = newName.replace("NeutralNeutral", "Neutral")
	newName = newName.replace("NeutralBrand", "Brand")
	newName = newName.replace("NeutralCompound", "Compound")
	newName = newName.replace("NeutralRed", "PaletteRed")
	newName = newName.replace("NeutralGreen", "PaletteGreen")
	newName = newName.replace("NeutralDarkOrange", "PaletteDarkOrange")
	newName = newName.replace("NeutralYellow", "PaletteYellow")
	newName = newName.replace("Rest", "")
	newName = newName.replace("Set", "")
	newName = newName.replace("NeutralSubtle", "Subtle")
	newName = newName.replace("NeutralTransparent", "Transparent")
	newName = newName.replace("FillColor", "")
	newName = newName.replace("StrokeColor", "")
	newName = newName.replace("BorderColor", "")
	newName = newName.replace(" ", "")

	return newName
}

StyleDictionary.registerTransform({
	name: "dcs/name/json",
	type: "name",
	transformer: prop => `${constructCssName(Utils.getTokenExportPath(prop))}`,
})

StyleDictionary.registerTransform({
	name: "dcs/alias/json",
	type: "value",
	matcher: prop => "resolvedAliasPath" in prop,
	transformer: prop => `var(--${constructCssName(prop.resolvedAliasPath)})`,
})

StyleDictionary.registerTransform({
	name: "dcs/name/css",
	type: "name",
	transformer: prop => `${constructCssName(Utils.getTokenExportPath(prop))}`,
})

StyleDictionary.registerTransform({
	name: "dcs/alias/css",
	type: "value",
	matcher: prop => "resolvedAliasPath" in prop,
	transformer: prop => `var(--${constructCssName(prop.resolvedAliasPath)})`,
})

StyleDictionary.registerTransformGroup({
	name: "dcs/json",
	transforms: ["dcs/name/json", "time/seconds", "fluentui/size/css", "fluentui/color/css", "fluentui/strokealignment/css", "fluentui/shadow/css", "fluentui/font/css", "dcs/alias/json"],
})

StyleDictionary.registerTransformGroup({
	name: "dcs/css",
	transforms: ["dcs/name/css", "time/seconds", "fluentui/size/css", "fluentui/color/css", "fluentui/strokealignment/css", "fluentui/shadow/css", "fluentui/font/css", "dcs/alias/css"],
})

StyleDictionary.registerFormat({
	name: "fluentui/dcs/css",
	formatter: function (dictionary: { allProperties: { name: any; value: any }[] }, config: any)
	{
		return `${this.selector} {
		${dictionary.allProperties.map((prop: { name: any; value: any }) => `  --${prop.name}: ${prop.value};`).join("\n")}
	  }`
	}
})

StyleDictionary.registerFormat({
	name: "fluentui/dcs/json",
	formatter: (dictionary: { allProperties: any[] }) =>
	{
		// Flatten out the token hierarchy and just keep the important bits.
		const sortedProps = Utils.sortPropertiesForReadability(dictionary.allProperties)
		const tokens: any = {}
		for (const thisProp of sortedProps)
		{
			tokens[constructCssName(thisProp.path)] = thisProp.value
		}

		return JSON.stringify(tokens, /* replacer: */ undefined, /* space: */ "\t")
	},
})
