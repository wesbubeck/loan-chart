<script>
import { Bar } from "vue-chartjs";
export default {
	extends: Bar,
	props: {
		datasets: {
			type: Array,
			required: true,
		},
		chartOptions: {
			type: Object,
			required: true,
		},
		labels: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {};
	},
	mounted() {
		this.renderChart(
			{
				labels: this.labels,
				datasets: this.datasets,
			},
			this.chartOptions
		);
	},
};
</script>
