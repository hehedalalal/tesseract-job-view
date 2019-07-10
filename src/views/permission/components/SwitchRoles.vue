<template>
  <div>
    <div style="margin-bottom:15px;">
      Your roles: {{ roles }}
    </div>
    Switch roles:
    <el-radio-group  v-model="switchRoles">
      <el-radio-button v-if="$store.getters.buttons.includes('/permission/del')" label="editor" />
      <el-radio-button v-if="$store.getters.buttons.includes('/permission/add')" label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
