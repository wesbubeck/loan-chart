<template>
	<div>
		<h1 v-if="fetchingLoanData">Fetching Loan Data... 📊 🚀🚀🚀🚀</h1>
		<bar-chart
			v-if="shouldShowChart"
			:chartOptions="chartOptions"
			:datasets="chartDatasets"
			:labels="chartLabels"
		/>
		<div class="chart-filter-wrapper">
			<div class="filter-container-left">
				<filter-dropdown
					v-show="shouldShowChart"
					v-for="chartFilter in chartFilters"
					:key="chartFilter.name"
					:filterName="chartFilter.name"
					:filters="chartFilter.values"
					@onFilterChange="addDataFilter"
				/>
			</div>
			<button
				v-show="shouldShowChart"
				class="reset-button"
				@click="resetFilters"
			>
				Reset Filters
			</button>
		</div>
		<h1 v-if="!fetchingLoanData && errorFetching">
			Oops! There was an error fetching data. Please refresh the page.
			{{ this.exceptionMessage }}
		</h1>
	</div>
</template>

<script>
import { getData } from "../request/api.js";
import FilterDropdown from "./FilterDropdown.vue";
import BarChart from "./BarChart.vue";
export default {
	name: "HelloWorld",
	components: {
		BarChart,
		FilterDropdown,
	},
	props: {
		msg: String,
	},
	data() {
		return {
			initialLoanData: [],
			filters: {},
			barGraphDataSet: [],
			dataFilters: {},
			loanGrades: {},
			fetchingLoanData: false,
			errorFetching: null,
			chartDatasets: [],
			exceptionMessage: "",
			chartOptions: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
							},
							gridLines: {
								display: true,
							},
						},
					],
					xAxes: [
						{
							gridLines: {
								display: true,
							},
						},
					],
				},
				legend: {
					display: true,
				},
				responsive: true,
				maintainAspectRatio: false,
			},
			chartFilters: [],
		};
	},
	computed: {
		chartLabels() {
			return Object.keys(this.loanGrades);
		},
		shouldShowChart() {
			return !this.fetchingLoanData && !this.errorFetching;
		},
	},
	created() {
		this.fetchData();
	},
	methods: {
		addDataFilter({ name, value }) {
			if (value === null) {
				delete this.dataFilters[name];
				this.fetchData();
				return;
			}
			this.dataFilters = { ...this.dataFilters, [name]: value };
			this.fetchData();
		},
		async fetchData() {
			this.fetchingLoanData = true;

			this.initialLoanData = [];
			this.loanGrades = {};
			this.chartDatasets = [];

			try {
				this.initialLoanData = await getData();
				this.initialLoanData.forEach((dataset) => {
					/* eslint-disable no-debugger */
					// debugger;
					//This builds the filter arrays for the dropdown
					const shouldFilterOutData = this.setFilterDataAndCheckToFilterOut(
						dataset
					);
					if (shouldFilterOutData) return;
					// x: = loan grade y: = cumm loan balance
					this.setChartLoanGradeValues(dataset);
				});
				this.setChartDatasets();
				this.setChartFilters();

				this.errorFetching = false;
			} catch (e) {
				this.exceptionMessage = e;
				this.errorFetching = true;
			} finally {
				this.fetchingLoanData = false;
			}
		},
		getChartData() {
			return Object.keys(this.loanGrades).map((loanGrade) => {
				const loanAmount = Math.round(this.loanGrades[loanGrade] * 100) / 100;
				return { x: loanGrade, y: loanAmount };
			});
		},
		resetFilters() {
			this.dataFilters = {};
			this.filters = {};
			this.chartFilters = [];
			this.fetchData();
		},
		setChartDatasets() {
			//Used push here easier to add multiple sets in the future
			this.chartDatasets.push({
				label: "Loan Balance by Grade",
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderWidth: 1,
				data: this.getChartData(),
			});
		},
		setChartFilters() {
			this.chartFilters = Object.keys(this.filters).map((name) => {
				return {
					name,
					values: this.filters[name],
				};
			});
		},
		setFilterDataAndCheckToFilterOut(datasetValues) {
			let shouldFilterOut = false;
			Object.keys(datasetValues).forEach((dataKey) => {
				// This is only a double == because when select in the drop down emits an event
				// the event.target.value is coerced to a string
				if (
					!!this.dataFilters[dataKey] &&
					this.dataFilters[dataKey] == datasetValues[dataKey]
				) {
					shouldFilterOut = true;
				}
				if (dataKey === "currentBalance" || dataKey === "grade") return;
				if (!this.filters[dataKey]) {
					this.filters[dataKey] = [];
				}
				if (!this.filters[dataKey].includes(datasetValues[dataKey])) {
					this.filters[dataKey].push(datasetValues[dataKey]);
				}
			});
			return shouldFilterOut;
		},
		setChartLoanGradeValues(datasetValues) {
			const { grade, currentBalance } = datasetValues;
			//I can filter here
			if (!this.loanGrades[grade]) {
				this.loanGrades = {
					...this.loanGrades,
					...{ [grade]: currentBalance },
				};
			} else {
				this.loanGrades[grade] += currentBalance;
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart-filter-wrapper {
	display: flex;
	overflow: hidden;
	align-items: center;
	margin: 1em 0;
}
.reset-button {
	margin-left: auto;
}
.filter-container-left {
	display: inline-flex;
}
</style>
