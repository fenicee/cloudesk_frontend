<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="this.$store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }},
            <a
              href="https://www.10086.cn/index/fj/index_591_591.html"
              class="font-weight-bold"
              target="_blank"
              >福建移动</a
            >
            福州数据中心
          </div>
        </div>
        <div class="col-lg-6">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="https://www.10086.cn/index/fj/index_591_591.html"
                class="nav-link text-muted"
                target="_blank"
                >福建移动</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://map.baidu.com/poi/%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8(%E7%A6%8F%E5%BB%BA%E7%A6%8F%E5%B7%9E)%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83/@13314463.662154488,2966626.111132205,18.57z?uid=dcc50d0fd92cc7335e17c3b7&info_merge=1&isBizPoi=false&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl"
                class="nav-link text-muted"
                target="_blank"
                >福州数据中心</a
              >
            </li>

          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer",
};
</script>
