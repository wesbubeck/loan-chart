import Papa from "papaparse";
import Axios from "axios";
import { getData } from "./test-components/fetch-chart-data";

// export function getBarChartData() {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			resolve(barData);
// 		}, 2000);
// 	});
// }

export async function getData({ count } = { count: 5 }) {
	let parsedData;
	try {
		const { data } = await Axios.get(
			`https://api.mockaroo.com/api/296c0360?count=${count}&key=68942c90`
		);
		parsedData = Papa.parse(data);
	} catch (error) {
		throw error;
	}
	return buildChartData(parsedData.data);
}

const colors = {
	backgroundColor: [
		"rgba(255, 99, 132, 0.2)",
		"rgba(54, 162, 235, 0.2)",
		"rgba(255, 206, 86, 0.2)",
		"rgba(75, 192, 192, 0.2)",
		"rgba(153, 102, 255, 0.2)",
		"rgba(255, 159, 64, 0.2)",
		"rgba(25, 49, 172, 0.2)",
		"rgba(154, 132, 225, 0.2)",
		"rgba(55, 216, 81, 0.2)",
		"rgba(15, 92, 19, 0.2)",
	],
	borderColor: [
		"rgba(255, 99, 132, 1)",
		"rgba(54, 162, 235, 1)",
		"rgba(255, 206, 86, 1)",
		"rgba(75, 192, 192, 1)",
		"rgba(153, 102, 255, 1)",
		"rgba(255, 159, 64, 1)",
		"rgba(25, 49, 172, 1)",
		"rgba(154, 132, 225, 1)",
		"rgba(55, 216, 81, 1)",
		"rgba(15, 92, 19, 1)",
	],
};

function buildChartData(dataValues) {
	let dataMap = {
		datasets: [],
		indexMap: {},
	};
	dataValues.forEach((data, index) => {
		if (index === 0) {
			dataMap.labels = data.filter((val) => val !== "account_id");
			data.forEach((value, index) => {
				dataMap.indexMap[index] = value;
			});
			return;
		}
		let tempDataSet = {
			label: "",
			data: [],
			backgroundColor: colors.backgroundColor[index],
			borderColor: colors.borderColor[index],
			borderWidth: 1,
		};
		data.forEach((value, index) => {
			if (index === 0) {
				tempDataSet.label = value;
				return;
			}
			if (dataMap.indexMap[index] === "date") {
				const dateValue = new Date(value).getMonth();
				tempDataSet.data.push({ x: dataMap.indexMap[index], y: dateValue });
				return;
			}
			tempDataSet.data.push({ x: dataMap.indexMap[index], y: value });
		});
		dataMap.datasets.push(tempDataSet);
	});
	return dataMap;
}
