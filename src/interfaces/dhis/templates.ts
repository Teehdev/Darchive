export type ItemType = {
	id: string,
	name: string
}

export type DimentionType = {
	dimension: string;
	items: ItemType[];
}

export type TemplateType = {
	columns?: DimentionType[];
	rows?: DimentionType[];
	filters?: DimentionType[];
}
