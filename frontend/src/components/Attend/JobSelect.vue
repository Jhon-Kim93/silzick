<template>
	<div class="row m-1" id="job-select">
		<div id="base-border" class="col-8">
			{{name}}
		</div>
		<div class="offset-1 col-3">{{job.count}}명</div>
	</div>
</template>

<script>
export default {
	name: 'JobSelect',
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
};
</script>
<style scoped>
	.count{
		border-radius: 3%;
		border: 1px solid black;
	}
	#job-select{
		height: 2.3rem;
	}
</style>