<template>
  <div class="row m-1">
    <div id="base-border" class="col-8">
      {{ clientData }}
    </div>
    <div
      v-if="ready"
      class="col-2 d-inline-flex ready_check"
    >
      <b-icon icon="check2-circle" variant="success" font-scale="2"></b-icon>
    </div>
    <div
      v-else
      class="col-2 d-inline-flex ready_check"
      style="color:#222831;"
    >
      <b-icon icon="check2-circle" font-scale="2"></b-icon>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Ready',

	props: {
		streamManager: Object,
	},
	computed: {
		clientData () {
			const { clientData } = this.getConnectionData();
			return clientData;
		},
		ready () {
			return this.streamManager.ready
		}
	},

	methods: {
		getConnectionData () {
			const { connection } = this.streamManager.stream;
			return JSON.parse(connection.data);
		},
	},
};
</script>
<style scoped>
	.count{
		border-radius: 3%;
		border: 1px solid black;
	}
</style>