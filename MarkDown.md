# 项目文件介绍
- **package.json** 项目依赖，例如 element-plus 组件库等
- **vite.config.js** 项目配置文件，例如路由配置等(@)
- **src** - **components** 组件文件夹 -
                                - **BackendLayout.vue** 总体布局组件
                                - **Sidebar.vue** 菜单组件
                                - **Navbar.vue** 导航栏组件
                                - **Main.vue** 主内容区域组件
                                - **PageHead.vue** 页面标题组件
          - **views** 视图文件夹 -
                                - **dashboard.vue** 内容组件（子组件）
                                - **knowledge.vue** 知识文章组件
                                - **consultation.vue** 咨询记录组件
                                - **emotional.vue** 情绪日志组件
          - **router** 路由文件夹 -
                                - **index.js** 路由配置文件
          - **stores** pinia状态管理文件夹 -
                                - **admin.js** 后台管理文件
          - **config** 配置文件夹 -
                                - **index.js** 项目配置文件


# 项目流程
1. 路由配置
  - 在**router**文件夹下的**index.js**中配置路由
2. 组件配置

  