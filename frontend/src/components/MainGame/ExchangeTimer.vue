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
// import { mapState } from 'vuex';

// const gameStore = "gameStore"

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
        triggerUpdate: true,
        circles: [
          {
            id: '1',
            classList: [ 'item' ],
            startValue: 0,
            value: 30,
            size: 60,
            strokeWidth: 5,
            strokeColor: '#DDDDDD',
            underneathStrokeColor: '#7C7A7A',
            fillColor: '#222831',
            valueFontSize: 20,
            labelFontSize: 30,
            steps: 30,
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