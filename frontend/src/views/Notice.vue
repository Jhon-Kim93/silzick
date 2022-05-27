<template>
  <div class="d-flex justify-content-center">
    <img src="https://ifh.cc/g/7ruaO5.png" id="bg" alt="bgImg">
    <div class="d-flex location2">
      <b-button @click="moveToNotice" variant="outline-light">공지사항</b-button>
      <b-button
        class="mx-3"
        @click="moveToRequest"
        variant="outline-light"
      >건의사항</b-button>
    </div>
    <div class="location3">
      <b-button
        variant="outline-light"
        @click="create"
      >공지작성</b-button>
    </div>
    <div class="container location" style="width:70%">
      <table class="table table-hover my-3">
        <thead class="white">
          <tr>
            <td>번호</td>
            <td>작성자</td>
            <td>제목</td>
            <td>작성일자</td>
          </tr>
        </thead>
        <tbody class="white">
          <tr
            :key="index"
            v-for="(post, index) in paginatedData"
            @click="detail(post.id)"
          >
            <td>{{ index + 1 + ( pageNum * 10 ) }}</td>
            <td>{{ post.user }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btn-cover location4 d-flex">
      <b-button :disabled="pageNum === 0" @click="prevPage" class="page-btn btn-sm" variant="outline-light">
        이전
      </b-button>
      <span class="page-count white mx-3 mt-1">{{ pageNum + 1 }} / {{ pageCount }} 페이지</span>
      <b-button :disabled="pageNum >= pageCount - 1" @click="nextPage" class="page-btn btn-sm" variant="outline-light">
        다음
      </b-button>
    </div>
  </div>
</template>

<script>
import cookies from 'vue-cookies'
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('notice')

export default {
  name : 'Notice',
  data : function() {
    return {
      pageNum: 0,
      pageSize: 10,
    }
  },
  computed: {
    ...mapState(['admin_post']),
    isLogin () {
      return cookies.isKey("JWT-AUTHENTICATION")
    },
    pageCount () {
      let listLength = this.admin_post.length,
        listSize = this.pageSize,
        page = Math.floor(listLength / listSize ) + 1
        return page
    },
    paginatedData () {
      const start = this.pageNum * this.pageSize,
      end = start + (this.pageSize);
      return this.admin_post.slice(start, end)
    }
  },
  methods : {
    create () {
      this.$router.push({ name: 'NoticeCreate' })
    },
    detail (index) {
      this.$router.push({
        name: 'NoticeDetail',
        params: { id: index }
      })
    },
    moveToNotice () {
      this.$router.go(this.$router.currentRoute)
    },
    moveToRequest () {
      this.$router.push({ name: 'Request' })
    },
    nextPage () {
      this.pageNum += 1
    },
    prevPage () {
      this.pageNum -= 1
    }
  },
  created () {
    if (this.isLogin === false) {
      this.$router.push({ name: 'Main' })
    } else {
      this.$store.dispatch('notice/getNotices')
    }
  }
}
</script>

<style scoped>
  .location {
    position: fixed;
    top: 26%;
    left: 14%;
    width: 30%;
    height: 70%;
  }
  .table-hover thead tr:hover th, .table-hover tbody tr:hover td {
    background-color: white;
  }
  .white {
    color: white;
  }
  .location2 {
    position: fixed;
    top: 20%;
    left: 16%
  }
  .location4 {
    position: fixed;
    top: 85%;
  }
</style>