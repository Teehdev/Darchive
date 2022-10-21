class MediaDbQuery {
	/**
	 *  Get a list of Aggregation Pipeline Objects that joins a Media Data.
	 * @param localFieldname  - name of field in localDoc to use for join operation. Defaults to "media"
	 * @param joinedFieldname  - name of joined field. Defaults to "media"
	 * @returns IAggregationPipelineStage[]
	 */

	public static join(localFieldname?: string, joinedFieldname?: string): any[] {
		const localField = localFieldname ? localFieldname : "media";
		const joinedField = joinedFieldname ? joinedFieldname : "media";

		return [
			{
				$lookup: {
					from: "media",
					let: { mediaRef: `$${localField}` },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$createdBy", "$$mediaRef"] },
							},
						},
						{
							$sort: { createdAt: -1 },
						},
						{
							$limit: 1,
						},
					],
					as: joinedField,
				},
			},
			{
				$unwind: {
					path: `$${joinedField}`,
					preserveNullAndEmptyArrays: true,
				},
			},
		];
	}

	/**
	 *  Get a list of Aggregation Pipeline Objects that joins multiple Media Data.
	 * @param localFieldname  - name of field in localDoc to use for join operation.
	 * @param joinedFieldname  - name of joined field.
	 * @returns IAggregationPipelineStage[]
	 */

	public static joinMany(localField?: string, joinedField?: string): any[] {
		return [
			{
				$lookup: {
					from: "media",
					let: { ownerRef: `$${localField}` },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$createdBy", "$$ownerRef"] },
							},
						},
					],
					as: joinedField,
				},
			},
		];
	}
}

export default MediaDbQuery;
