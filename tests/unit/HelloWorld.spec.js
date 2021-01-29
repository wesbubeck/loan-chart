import HelloWorld from "@/components/HelloWorld.vue";
import { getData } from "../../src/request/api.js";

describe("HelloWorld.vue", () => {
	describe("computed", () => {
		describe("shouldShowChart", () => {
			it("should return false if fetching loan data", () => {
				const localThis = {
					fetchingLoanData: true,
					errorFetching: false,
				};

				expect(HelloWorld.computed.shouldShowChart.call(localThis)).toBe(false);
			});
			it("should return false if errored", () => {
				const localThis = {
					fetchingLoanData: false,
					errorFetching: true,
				};

				expect(HelloWorld.computed.shouldShowChart.call(localThis)).toBe(false);
			});
			it("should return true if not fetching loan data no error", () => {
				const localThis = {
					fetchingLoanData: true,
					errorFetching: true,
				};

				expect(HelloWorld.computed.shouldShowChart.call(localThis)).toBe(false);
			});
		});
		describe("chartLabels", () => {
			it("should return an array of keys from the loan grades", () => {
				const localThis = {
					loanGrades: {
						foo: 4,
						baz: 4,
						foobar: 23,
					},
				};

				expect(HelloWorld.computed.chartLabels.call(localThis)).toStrictEqual([
					"foo",
					"baz",
					"foobar",
				]);
			});
		});
	});
	describe("methods", () => {
		describe("addDataFilter", () => {
			it("should remove a filter if null is passed in", () => {
				const localThis = {
					fetchData: jest.fn(),
					dataFilters: {
						foo: "bar",
						baz: "foobar",
					},
				};
				HelloWorld.methods.addDataFilter.call(localThis, {
					name: "foo",
					value: null,
				});
				expect(localThis.dataFilters.foo).toBe(undefined);
				expect(localThis.dataFilters.baz).toBe("foobar");
				expect(localThis.fetchData).toHaveBeenCalled();
			});
			it("should add a filter if a value other than null is passed in", () => {
				const localThis = {
					fetchData: jest.fn(),
					dataFilters: {
						foo: "bar",
						baz: "foobar",
					},
				};
				HelloWorld.methods.addDataFilter.call(localThis, {
					name: "fizz",
					value: "buzz",
				});
				expect(localThis.dataFilters.foo).toBe("bar");
				expect(localThis.dataFilters.baz).toBe("foobar");
				expect(localThis.dataFilters.fizz).toBe("buzz");
				expect(localThis.fetchData).toHaveBeenCalled();
			});
		});
		describe("fetchData", () => {
			it("should call getData, set the initial loan data and call methods to build other data structures", async () => {
				const localThis = {
					setFilterDataAndCheckToFilterOut: jest.fn().mockReturnValue(false),
					setChartLoanGradeValues: jest.fn(),
					setChartDatasets: jest.fn(),
					setChartFilters: jest.fn(),
					initialLoanData: [],
				};
				await HelloWorld.methods.fetchData.call(localThis);
				expect(localThis.setFilterDataAndCheckToFilterOut).toHaveBeenCalled();
				expect(localThis.setChartLoanGradeValues).toHaveBeenCalled();
				expect(localThis.setChartDatasets).toHaveBeenCalled();
				expect(localThis.setChartFilters).toHaveBeenCalled();
				expect(localThis.initialLoanData.length).toBe(878);
			});
		});
		describe("resetFilters", () => {
			it("should call reset the filters and call fetchData", () => {
				const localThis = {
					dataFilters: {
						foo: "bar",
					},
					filters: {
						foo: "bar",
					},
					chartFilters: {
						foo: "bar",
					},
					fetchData: jest.fn(),
				};
				HelloWorld.methods.resetFilters.call(localThis);
				expect(Object.keys(localThis.dataFilters).length).toBe(0);
				expect(Object.keys(localThis.filters).length).toBe(0);
				expect(Object.keys(localThis.chartFilters).length).toBe(0);
				expect(localThis.fetchData).toHaveBeenCalled();
			});
		});
		describe("setChartFilters", () => {
			it("should call reset the filters and call fetchData", () => {
				const localThis = {
					filters: {
						foo: ["filter1", "filter3", "filter5", "filter6"],
						bar: ["filter3", "filter54", "filter554", "filter645"],
					},
					chartFilters: [],
				};
				HelloWorld.methods.setChartFilters.call(localThis);
				expect(localThis.chartFilters).toStrictEqual([
					{ name: "foo", values: ["filter1", "filter3", "filter5", "filter6"] },
					{
						name: "bar",
						values: ["filter3", "filter54", "filter554", "filter645"],
					},
				]);
			});
		});
	});
});
