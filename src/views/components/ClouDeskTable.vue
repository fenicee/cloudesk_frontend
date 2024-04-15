<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>云电脑管理</h6>
      <div class="d-flex align-items-center gap-2">
        <el-button type="primary" @click="handleSelectModule">选择管理组</el-button>
        <el-button type="primary" @click="addNewGroup">添加管理组</el-button>
      </div>
      <!-- 显示已获取到的管理组列表 -->
      <transition name="fade">
        <div v-if="showGroups && (!hasNoGroups || accessKeyGroups.length > 0)">
          <h6>管理组列表</h6>
          <el-radio-group v-model="selectedGroup" @change="onGroupChange">
            <el-radio-button v-for="(group, index) in accessKeyGroups" :key="index" :label="group.id">{{ group.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </transition>
    </div>
    <el-dialog title="添加管理组" v-model:model-value="addGroupVisible">
      <el-form @submit.prevent="handleSubmit">
        <el-form-item label="标签" :rules="[{ required: true, message: '请输入管理组标签' }]">
          <el-input v-model="newGroupName" placeholder="请输入管理组标签"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加管理组主对话框的footer -->
      <template #footer>
        <span class="dialog-footer" >
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="addGroupVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>

  </div>

</template>


<script>
import axios from "axios";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

export default{
  name: "cloudesk-table",
  setup() {
    const accessKeyGroups = ref([]);
    const selectedGroup = ref(null);
    const showGroups = ref(false);
    const hasNoGroups = ref(false);

    const addGroupVisible = ref(false);
    const newGroupName = ref("");
    const searchText = ref("");
    const searchedAccessKeys = ref([]);
    const selectedAccessKey = ref(null);


    const onGroupChange = newVal => {
      // 在这里处理选中管理模组后的逻辑，比如保存选中项到 Vuex 状态管理或执行其他操作
      console.log('Selected AccessKeyGroup ID:', newVal);
    };

    const handleSelectModule = async () => {
      showGroups.value = true;
      try {
        const response = await axios.get('/api/accesskeygroup/getgroups'); // 替换为实际后端接口地址
        if (response.status === 200) {
          accessKeyGroups.value = response.data.data;
          if (accessKeyGroups.value.length === 0) {
            hasNoGroups.value = true;
            ElMessage.warning('暂无可用管理组，请先添加管理组');
          }
        } else {
          // 使用Element UI的消息提示
          // import { ElMessage } from 'element-plus';
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('服务器异常');
      }
    };
    // 搜索AccessKey的方法
    const handleSearchInput = async () => {
      try {
        const response = await axios.get('/api/accesskeygroup/getByLabel', { params: { label: searchText.value } });
        if (response.status === 200) {
          searchedAccessKeys.value = response.data.data;
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('服务器异常');
      }
    };

    // 将AccessKey添加到管理组的方法
    const addAccessKeyToGroup = async accessKey => {
      try {
        const groupId = selectedGroup.value; // 获取当前选中的管理组ID
        const response = await axios.post('/api/accesskeygroup/addtogroup', { groupId, accessKeyId: accessKey.id }); // 替换为实际后端接口地址和参数
        if (response.status === 200) {
          ElMessage.success('AccessKey已成功添加到管理组');
          // 可能需要在此处更新已有的accessKeyGroups数据（如果后端接口不提供新列表）
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('服务器异常');
      }
    };
    function addNewGroup() {
      addGroupVisible.value = true;
    }


    const handleSubmit = () => {

    };
    onMounted( () => {
       handleSelectModule();
    });

    return {
      accessKeyGroups,
      selectedGroup,
      showGroups,
      hasNoGroups,
      onGroupChange,
      handleSelectModule,
      addNewGroup,
      addGroupVisible,
      newGroupName,
      searchText,
      searchedAccessKeys,
      selectedAccessKey,
      handleSearchInput,
      addAccessKeyToGroup,
      handleSubmit,
    };
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>