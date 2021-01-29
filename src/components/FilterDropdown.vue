<template>
	<div>
		<select v-model="selectedFilter" @input="onFilterChange($event)">
			<option v-for="filter in sortedFilters" :key="filter" :value="filter">{{
				filter
			}}</option>
		</select>
	</div>
</template>

<script>
export default {
	name: "FilterDropdown",
	props: {
		filters: {
			type: Array,
			required: true,
		},
		filterName: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			selectedFilter: "",
		};
	},
	computed: {
		sortedFilters() {
			const unsortedFilters = this.filters;
			return [this.filterName, ...unsortedFilters.sort((a, b) => a - b)];
		},
	},
	created() {
		this.selectedFilter = this.filterName;
	},
	methods: {
		onFilterChange(event) {
			// event.target.value is coerced to a string a future improvement
			// would be passing the type in and making sure it is emmited properly
			this.$emit("onFilterChange", {
				name: this.filterName,
				value:
					event.target.value === this.filterName ? null : event.target.value,
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
