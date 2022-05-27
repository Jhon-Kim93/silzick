<template>
	<div class="row m-1">
		<div id="base-border" class="col-8">
			{{name}}
		</div>
    <div class="col-2">
      <button @click="plus" id="btn-color" class="btn btn-size">+</button>
    </div>
    <div class="col-2">
      <button @click="minus" id="btn-color" class="btn btn-size">-</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const gameStore = 'gameStore'

export default {
	name: 'Jobs',

	props: {
		job:Object
	},
	computed:{
		name : function(){
			switch(this.job.jobName){
				case 'KIRA' :{
					return '노트주인'
				}
				case 'POLICE' :{
					return '경찰'
				}
				case 'L' :{
					return '경찰총장'
				}
				case 'CRIMINAL' :{
					return '추종자'
				}
				case 'GUARD' :{
					return '보디가드'
				}
				case 'BROADCASTER' :{
					return '방송인'
				}
			}
			return 'Error'
		}
	},
	methods: {
		...mapActions(gameStore, ['changeJobCount']),
		plus () {
			if (this.job.isChange && this.job.count < this.job.maxCount) {
				const jobProps = {
					gameStatus: 1,
					jobName: this.job.jobName,
					count: this.job.count + 1
				}
				this.changeJobCount(jobProps)
			}
		},
		minus () {
			if (this.job.isChange && this.job.count > this.job.minCount) {
				const jobProps = {
					gameStatus: 1,
					jobName: this.job.jobName,
					count: this.job.count - 1
				}
				this.changeJobCount(jobProps)
			}
		}
	}
};
</script>
<style scoped>
.btn-size {
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
}
</style>