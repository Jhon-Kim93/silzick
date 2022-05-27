<template>
	<div>
    <circular-count-down-timer
      :circles="exchangeTimer.circles"
      :interval="exchangeTimer.interval"
      :main-circle-id="exchangeTimer.mainCircleId || '1'"
      :size="exchangeTimer.size"
      :container-classes="exchangeTimer.containerClasses"
      :circle-classes="exchangeTimer.circleClasses"
      :stop-conditions="exchangeTimer.stopConditions"
      :trigger-update="exchangeTimer.triggerUpdate"
      :stroke-width="exchangeTimer.strokeWidth"
      :stroke-color="exchangeTimer.strokeColor"
      :underneath-stroke-color="exchangeTimer.underneathStrokeColor"
      :fill-color="exchangeTimer.fillColor"
      :value-font-size="exchangeTimer.valueFontSize"
      :label-font-size="exchangeTimer.labelFontSize"
      :label-position="exchangeTimer.labelPosition"
    />
	</div>
</template>

<script>
export default {
	name: 'ExchangeTimer',
	data(){
		return {
      exchangeTimer:{
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
            value: 15,
            size: 50,
            strokeWidth: 5,
            strokeColor: '#DDDDDD',
            underneathStrokeColor: '#7C7A7A',
            fillColor: '#222831',
            valueFontSize: 20,
            labelFontSize: 5,
            steps: 15,
            stepLength: -1,
            label: '남은 시간',
            labelPosition: 'top'
          }
        ]
      }
    }
	},
};
</script>

<style>
</style>