<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>ACCESSKEY管理</h6>
      <!-- 将搜索框和添加按钮放在同一行 -->
      <div class="d-flex align-items-center gap-2">
        <div class="input-group mb-2">
          <el-input v-model="searchText" placeholder="输入Accesskey或者Secrekey查询" @input="handleSearchInput" clearable></el-input>
        </div>
        <el-button type="primary" @click="showAddModal">添加</el-button>

      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <el-table :data="filteredAKSKS">
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="accessKey" label="AccessKey"></el-table-column>
          <el-table-column prop="secretKey" label="SecretKey"></el-table-column>
          <el-table-column prop="label" label="标签"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-link type="primary" @click="editAuthor(row)">编辑</el-link>
              <el-link style="margin-left: 10px;" @click="deleteAuthor(row.id)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="totalItems"
            :page-size="pageSize"
            v-model:currentPage="currentPage"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加模态框 -->
    <el-dialog v-model:model-value="isAddModalVisible" title="添加 AccessKey">
      <el-form @submit.prevent="submitAddForm">
        <el-form-item label="AccessKey">
          <el-input v-model="newAccessKey" placeholder="请输入 AccessKey"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="newSecretKey" placeholder="请输入 SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="newLabel" placeholder="请输入 标签"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hideAddModal">取消</el-button>
          <el-button type="primary" @click="submitAddForm">确认添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog v-model:model-value="isEditModalVisible" title="编辑 AccessKey">
      <el-form ref="editForm" :model="editAccessKey" label-width="80px">
        <el-form-item label="AccessKey">
          <el-input v-model="editAccessKey.accessKey" placeholder="请输入 AccessKey"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="editAccessKey.secretKey" placeholder="请输入 SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="editAccessKey.label" placeholder="请输入 标签"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="hideEditModal">取消</el-button>
      <el-button type="primary" @click="submitEditForm">确认编辑</el-button>
    </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "authors-table",
  setup() {
    let isAddModalVisible = ref(false);
    const searchText = ref('');
    const accesskeys = ref([]);
    const filteredAKSKS = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10); // 每页显示数量
    const totalItems = ref(0);
    const isEditModalVisible = ref(false);
    const editAccessKey = ref({});
    const editAuthor = (row) => {
      isEditModalVisible.value = true;
      editAccessKey.value = { ...row };
    };
    const showMessage = (options) => {
      return ElMessage(options);
    };
    // 添加 deleteAuthor 方法
    const deleteAuthor = async (accessKeyId) => {
      try {
        const response = await axios.delete(`/api/accesskey/${accessKeyId}`);
        if(response.data.code === 500){
          showMessage({ message: 'AccessKey删除失败，请稍后重试', type: 'error' });
        }
        else {
          // 更新本地数据
          accesskeys.value = accesskeys.value.filter(item => item.id !== accessKeyId);
          filteredAKSKS.value = filteredAKSKS.value.filter(item => item.id !== accessKeyId);
          totalItems.value--; // 减少总记录数
          handleCurrentChange(currentPage.value); // 根据当前页码重新计算并设置分页数据
          showMessage({ message: 'AccessKey删除成功', type: 'success' });
        }
      } catch (error) {
        console.error('Failed to delete access key:', error);
        showMessage({ message: 'AccessKey删除失败，请稍后重试', type: 'error' });
      }
    };


    function showAddModal() {
      isAddModalVisible.value = true;
    }

    function hideAddModal() {
      isAddModalVisible.value = false;
    }
    function hideEditModal() {
      isEditModalVisible.value = false;
      editAccessKey.value = {};
    }
    async function fetchAccessKeys() {
      try {
        const response = await axios.get('/api/accesskey/getaksks');
        if (response.status === 200) {
          accesskeys.value = response.data.data;
          totalItems.value = accesskeys.value.length; // 总记录数等于获取到的数据长度
          handleCurrentChange(currentPage.value); // 根据当前页码重新计算并设置分页数据
        } else {
          console.error('Failed to fetch access keys:', response);
        }
      } catch (error) {
        console.error('Failed to fetch access keys:', error);
      }
    }

    // 新增表单字段模型
    const newAccessKey = ref('');
    const newSecretKey = ref('');
    const newLabel = ref('');
    const handleSearchInput = () => {
      if (searchText.value) {
        filteredAKSKS.value = accesskeys.value.filter(aksk => {
          const searchTerm = searchText.value.toLowerCase();
          return (
              aksk.accessKey?.toLowerCase()?.includes(searchTerm) ||
              aksk.secretKey?.toLowerCase()?.includes(searchTerm) ||
              aksk.label?.toLowerCase()?.includes(searchTerm)
          );
        });
      } else {
        // 当搜索文本为空时，恢复原始数据
        filteredAKSKS.value = [...accesskeys.value];
      }
    };
    const submitAddForm = async () => {
      try {
        // 提交表单数据到后端接口
        const response = await axios.post('/api/accesskey/create', {
          accessKey: newAccessKey.value,
          secretKey: newSecretKey.value,
          label: newLabel.value,
        });

        // 检查后端返回的业务逻辑状态码
        if (response.data.code === 500) { // 假设code位于response.data中
          isAddModalVisible.value = false;
          showMessage({ message: '新增 AccessKey 失败', type: 'error' });
        } else {
          filteredAKSKS.value.push(response.data);
          totalItems.value++; // 增加总记录数
          isAddModalVisible.value = false;
          [newAccessKey.value, newSecretKey.value, newLabel.value] = ['', '', ''];
          fetchAccessKeys(); // 调用fetchAccessKeys来刷新列表
        }
      } catch (error) {
        console.error('Failed to create new access key:', error);
        showMessage({ message: '新增 AccessKey 失败', type: 'error' });
      }
    };
    const submitEditForm = async () => {
      try {
        const response = await axios.put(`/api/accesskey/${editAccessKey.value.id}`, editAccessKey.value);
        if (response.status === 200) {
          // 更新成功，刷新列表
          fetchAccessKeys();
          hideEditModal();
        } else {
          console.error('Failed to update access key:', response);
        }
      } catch (error) {
        console.error('Failed to update access key:', error);
      }
    };
    function handleCurrentChange(newPage) {
      const startIndex = (newPage - 1) * pageSize.value;
      const endIndex = newPage * pageSize.value;
      filteredAKSKS.value = accesskeys.value.slice(startIndex, endIndex);
    }

    // 设置当前页码
    function setCurrentPage(page) {
      currentPage.value = page;
    }
    onMounted(() => {
      fetchAccessKeys();
    });

    return {
      isAddModalVisible,
      showAddModal,
      hideAddModal,
      searchText,
      accesskeys,
      filteredAKSKS,
      newAccessKey,
      newSecretKey,
      newLabel,
      handleSearchInput,
      submitAddForm,
      currentPage,
      pageSize,
      totalItems,
      handleCurrentChange,
      setCurrentPage,
      editAccessKey,
      editAuthor,
      submitEditForm,
      hideEditModal,
      isEditModalVisible,
      deleteAuthor
    };
  },

  methods: {


  },
};
</script>
