import { data } from "./utils.js";

export const getData = async () => {
	return await new Promise((resolve, reject) => {
		try {
			setTimeout(() => {
				let formattedData = data.map((d) => ({
					year: d.v_year,
					quarter: d.v_quarter,
					grade: d.grade_2,
					homeOwnership: d.home_ownership,
					term: d.term,
					currentBalance: d.V1,
				}));
				resolve(formattedData);
			}, 2000);
		} catch {
			reject("something went wrong...");
		}
	});
};
