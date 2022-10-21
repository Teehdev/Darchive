import mongoose from "../providers/Database";
import IIndicator from "../interfaces/models/indicator";

const IdFieldSchema = new mongoose.Schema({ id: { type: String, required: true } });

const AccessSchema = new mongoose.Schema({
		read: { type: Boolean, required: true, default: false },
		update: { type: Boolean, required: true, default: false },
		externalize: { type: Boolean, required: true, default: false },
		delete: { type: Boolean, required: true, default: false },
		write: { type: Boolean, required: true, default: false },
		manage: { type: Boolean, required: true, default: false }
});

export type IndicatorDocument = mongoose.Document & IIndicator;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const IndicatorSchema = new mongoose.Schema({
		id: { type: String, required: true },
		href: { type: String, required: false },
		created: Date,
		name: { type: String, required: true },
		shortName: { type: String, required: false },
		displayName: { type: String, required: false },
		publicAccess: { type: String, required: false },
		displayShortName: { type: String, required: false },
		externalAccess: { type: String, required: false },
		displayNumeratorDescription: { type: String, required: false },
		denominatorDescription: { type: String, required: false },
		displayDenominatorDescription: { type: String, required: false },
		numeratorDescription: { type: String, required: false },
		dimensionItem: { type: String, required: false },
		displayFormName: { type: String, required: false },
		numerator: { type: String, required: false },
		denominator: { type: String, required: false },
		annualized: { type: String, required: false },
		favorite: { type: String, required: false },
		dimensionItemType: { type: String, required: false },
		access: { type: AccessSchema, required: false },
		indicatorType: { type: IdFieldSchema, required: false },
		lastUpdatedBy: { type: IdFieldSchema, required: false },
		user: { type: IdFieldSchema, required: false },
		favorites: { type: Array, default: [], required: false },
		translations: { type: Array, default: [], required: false },
		userGroupAccesses: { type: Array, default: [], required: false },
		attributeValues: { type: Array, default: [], required: false },
		indicatorGroups: { type: Array, default: [], required: false },
		userAccesses: { type: Array, default: [], required: false },
		dataSets: { type: Array<typeof IdFieldSchema>, required: false },
		legendSets: { type: Array, default: [], required: false },
		syncedAt: { type: Date, default: Date.now },
});

const Indicator = mongoose.model<IndicatorDocument>("Indicator", IndicatorSchema);

export default Indicator;

