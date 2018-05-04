import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

// 判断model已加载到项目中了
const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// dynamicWrapper函数  对dva中dynamic函数的再次封装, dynamic函数作用是动态import
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      const modelname = model.slice(model.lastIndexOf('/') + 1);
      if (modelNotExisted(app, modelname)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    // 该路由对应的model有没有加载到项目里,没有就加载进来
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    // 这里的作用就是将所有路由数据加入到组件props的routerData中
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/index': {
      component: dynamicWrapper(app, [], () => import('../routes/Dashboard/SingleStation')),
    },
    '/blank': {
      component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    },
    '/rcontrol/realtime': {
      component: dynamicWrapper(app, [], () => import('../routes/Rcontrol/Realtime')),
      // authority: 'user1',
    },
    '/rcontrol/alarm-event': {
      component: dynamicWrapper(app, ['rcontrol/alarmEvent'], () =>
        import('../routes/Rcontrol/AlarmEvent')
      ),
    },
    '/rcontrol/alarm-message': {
      component: dynamicWrapper(app, ['rcontrol/alarmMessage'], () =>
        import('../routes/Rcontrol/AlarmMessage')
      ),
    },
    '/rcontrol/alarm-config': {
      component: dynamicWrapper(app, ['rcontrol/alarmConfig'], () =>
        import('../routes/Rcontrol/AlarmConfig')
      ),
    },
    '/rcontrol/task-manager': {
      component: dynamicWrapper(app, [], () => import('../routes/Rcontrol/TaskManager')),
    },
    '/rcontrol/auto-control-config': {
      component: dynamicWrapper(app, ['rcontrol/acc'], () =>
        import('../routes/Rcontrol/AutoControlConfig')
      ),
    },
    '/rcontrol/realtime-analysis': {
      component: dynamicWrapper(app, ['chart'], () =>
        import('../routes/Rcontrol/RealtimeAnalysis')
      ),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/book/list-book': {
      component: dynamicWrapper(app, ['book'], () => import('../routes/Book/ListBook')),
    },
    '/book/list-book2': {
      component: dynamicWrapper(app, ['book'], () => import('../routes/Book/ListBook2')),
    },
    '/book/add-book': {
      component: dynamicWrapper(app, ['book'], () => import('../routes/Book/EditBook')),
    },
    '/book/edit-book/:id': {
      component: dynamicWrapper(app, ['book'], () => import('../routes/Book/EditBook')),
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/mylogin': {
      component: dynamicWrapper(app, ['mylogin'], () => import('../routes/User/MyLogin')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/my': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout1')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // 拿到菜单数组,将其path转换成路由的path,然后将菜单子组件解析出来,形成平级的菜单数组
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // 循环routerConfig匹配menuData
  Object.keys(routerConfig).forEach(path => {
    // 支持带参数的路由配置，案例如下:
    // 菜单中的path设置为/user/1,路由中的path设置为/user/:id
    // 如果直接使用 === 则判断结果为两者不匹配。
    // 需要借助path-to-regexp这个库来完成判断。
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // 如果存在与带参数路由匹配的菜单项
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    // 将路由与菜单项结合,上面这一段代码其实也就只有带参数的路由有可能会更改
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
