import HelloWorld from "@/components/HelloWorld.vue";

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
});
