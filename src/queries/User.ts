import MediaDbQuery from "./Media";

class UserDbQuery {
	/**
	 *  Get a list of Aggregation Pipeline Objects that joins a User Data.
	 * @param localFieldname  - name of field in localDoc to use for join operation. Defaults to "user"
	 * @param joinedFieldname  - name of joined field. Defaults to "user"
	 * @returns IAggregationPipelineStage[]
	 */

	public static join(localFieldname?: string, joinedFieldname?: string): any[] {
		const localField = localFieldname ? localFieldname : "user";
		const joinedField = joinedFieldname ? joinedFieldname : "user";

		return [
			{
				$lookup: {
					from: "users",
					let: { userRef: `$${localField}` },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$_id", "$$userRef"] },
							},
						},
						{
							$project: { salt: 0, hash: 0 },
						},
						// get avatar media
						...MediaDbQuery.join("avatar", "avatar"),
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

export default UserDbQuery;
