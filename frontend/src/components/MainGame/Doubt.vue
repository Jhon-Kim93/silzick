<template>
  <div>
    <div class="d-inline">
      <p class="d-inline"> {{ subscriberName }} </p>
      <select class="doubt_select">
        <option selected>------------</option>
        <option>노트주인</option>
        <option>추종자</option>
        <option>경찰총장</option>
        <option>보디가드</option>
        <option>방송인</option>
        <option>경찰</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Doubt',
  props: {
    subscriber: Object
  },
  computed: {
    subscriberName () {
      const subscriberNameString = this.subscriber.stream.connection.data
      const { clientData } = JSON.parse(subscriberNameString)
      return clientData
    }
  },
}
</script>

<style scoped>
.doubt_select {
  background-color: transparent;
  background: black;
  color: white;
  border-radius: 8px;
  text-align: center;
}
</style>