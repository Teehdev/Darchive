class RoleDbQuery {
	/**
   *  Get a list of Aggregation Pipeline Objects that joins a Role Data.
   * @param localFieldname  - name of field in localDoc to use for join operation. Defaults to "role"
   * @param joinedFieldname  - name of joined field. Defaults to "role"
   * @returns IAggregationPipelineStage[]
   */

	public static join(localFieldname?: string, joinedFieldname?: string): any[] {
		const localField = localFieldname ? localFieldname : "role";
		const joinedField = joinedFieldname ? joinedFieldname : "role";

		return [
			{
				$lookup: {
					from: "roles",
					let: { roleRef: `$${localField}` },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$_id", "$$roleRef"] },
							},
						},
					],
					as: joinedField,
				},
			},
			{
				$unwind: {
					path: `$${joinedField},`,
					preserveNullAndEmptyArrays: true,
				},
			},
		];
	}
}

export default RoleDbQuery;
