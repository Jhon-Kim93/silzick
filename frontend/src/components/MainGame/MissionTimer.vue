<template>
	<div>
    <circular-count-down-timer
      :circles="missionTimer.circles"
      :interval="missionTimer.interval"
      :main-circle-id="missionTimer.mainCircleId || '1'"
      :size="missionTimer.size"
      :container-classes="missionTimer.containerClasses"
      :circle-classes="missionTimer.circleClasses"
      :stop-conditions="missionTimer.stopConditions"
      :trigger-update="missionTimer.triggerUpdate"
      :stroke-width="missionTimer.strokeWidth"
      :stroke-color="missionTimer.strokeColor"
      :underneath-stroke-color="missionTimer.underneathStrokeColor"
      :fill-color="missionTimer.fillColor"
      :value-font-size="missionTimer.valueFontSize"
      :label-font-size="missionTimer.labelFontSize"
      :label-position="missionTimer.labelPosition"
    />
	</div>
</template>


<script>
export default {
	name: 'MissionTimer',
	data(){
		return {
      missionTimer:{
        title: 'Full configuration',
        containerClasses: [],
        circleClasses: [],
        interval: 1000,
        mainCircleId: '1',
        stopConditions: {'1':0},
        triggerUpdate: false,
        circles: [
          {
            id: '1',
            classList: [ 'item' ],
            startValue: 0,
            value: 20,
            size: 60,
            strokeWidth: 5,
            strokeColor: '#DDDDDD',
            underneathStrokeColor: '#7C7A7A',
            fillColor: '#222831',
            valueFontSize: 20,
            labelFontSize: 30,
            steps: 20,
            stepLength: -1,
            label: '',
            labelPosition: 'bottom'
          }
        ]
      }
    }
	},
};
</script>



<style>
</style>