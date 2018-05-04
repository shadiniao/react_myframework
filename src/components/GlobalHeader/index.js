import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  switchMenu({ item, key }) {
    const { onMenuClick } = this.props;
    this.setState({
      selectMenu: key,
    });
    onMenuClick({ key });
  }

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      currentCompany,
      onCompanyChange,
      pathname,
    } = this.props;
    const { companies = [] } = currentUser;
    const menuKey = pathname.slice(pathname.lastIndexOf('/') + 1);
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />触发报错
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const menuStation =
      companies && companies.length > 1 ? (
        <Menu selectedKeys={[]} onClick={onCompanyChange}>
          {companies.map(company => {
            return (
              <Menu.Item key={company.pid} disabled={company.pid === currentCompany.pid}>
                切换到:{company.companyName}
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        <div />
      );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        {currentUser.usertype === 'system' && (
          <div style={{ display: 'inline-block', lineHeight: '64px' }}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </div>
        )}
        <div style={{ width: '700px', lineHeight: '64px', display: 'inline-block' }}>
          <Menu
            style={{ lineHeight: '64px' }}
            onClick={this.switchMenu.bind(this)}
            selectedKeys={[menuKey]}
            mode="horizontal"
          >
            <Menu.Item key="index">
              <Icon type="appstore" />首页
            </Menu.Item>
            <Menu.Item key="realtime">
              <Icon type="dashboard" />实时图
            </Menu.Item>
            <Menu.Item key="realtime-analysis">
              <Icon type="area-chart" />实时曲线
            </Menu.Item>
            <Menu.Item key="alarm-event">
              <Icon type="notification" />事件
            </Menu.Item>
            <Menu.SubMenu
              title={
                <span>
                  <Icon type="warning" />告警
                </span>
              }
            >
              <Menu.Item key="alarm-message">告警历史</Menu.Item>
              <Menu.Item key="alarm-config">告警配置</Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="auto-control-config">
              <Icon type="bar-chart" />控制配置
            </Menu.Item>
          </Menu>
        </div>
        <div className={styles.right}>
          {currentUser.name ? (
            <Dropdown overlay={menuStation}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  icon="shop"
                  size="small"
                  style={{ backgroundColor: '#87d068' }}
                  className={styles.avatar}
                />
                <span className={styles.name}>{currentCompany.companyName}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <Tooltip title="使用文档">
            <a
              target="_blank"
              href="http://pro.ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  style={{ backgroundColor: '#87d068' }}
                  icon="user"
                />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
