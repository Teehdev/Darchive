type IdField = {
		id: string
}

type IAccess = {
		read?: boolean,
		update?: boolean,
		externalize?: boolean,
		delete?: boolean,
		write?: boolean,
		manage?: boolean
}

export interface IIndicator {
		id: string,
		href?: string,
		created?: Date,
		name: string,
		shortName?: string,
		displayName?: string,
		publicAccess?: string,
		displayShortName?: string,
		externalAccess?: boolean,
		displayNumeratorDescription?: string,
		denominatorDescription?: string,
		displayDenominatorDescription?: string,
		numeratorDescription?: string,
		dimensionItem?: string,
		displayFormName?: string,
		numerator?: string,
		denominator?: string,
		annualized?: boolean,
		favorite?: boolean,
		dimensionItemType?: string,
		access?: IAccess,
		indicatorType?: IdField,
		lastUpdatedBy?: IdField
		user?: IdField,
		favorites?: [],
		translations?: [],
		userGroupAccesses?: [],
		attributeValues?: [],
		indicatorGroups?: [],
		userAccesses?: [],
		dataSets?: IdField[],
		legendSets?: []
}

export default IIndicator;
