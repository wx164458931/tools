import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Spin } from 'antd';
import { createElement, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import EventEmitter from '../common/eventEmitter'
import CustomizerEvent from '../common/customizerEvent'
import { selectUserStatus, login, LoginStatus, selectSiders } from '../store/userinfo'
import { useAppSelector, useAppDispatch } from '../store'
import styles from './index.module.scss'
import useDynamicRoutes from '../router';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const routers = useDynamicRoutes()
  const { pathname } = useLocation();
  const siders = useAppSelector(selectSiders);
  const logingStatus = useAppSelector(selectUserStatus);
  const [activeHeaderKey, setHeaderKey] = useState('')
  const [activeSiderKey, setSiderKey] = useState('')
  const [openSiderKeys, setOpenDiserKeys] = useState<string[]>([])
  const [siderMenus, setSiderMenus] = useState<MenuProps['items']>([])

  const headerMenus = siders.map(item => {
    return {
      label: item.label,
      key: item.key,
    }
  })

  useEffect(() => {
    EventEmitter.on(CustomizerEvent.UNLOGIN, clearUserInfo)
    dispatch(login())

    if(pathname !== '/') {
      initOpenKeys(pathname)
    }
    return () => {
      EventEmitter.off(CustomizerEvent.UNLOGIN, clearUserInfo)
    }
  }, [])

  useEffect(() => {
    if(pathname === '/') {
      if(siders && siders.length > 0) {
        let _siders = siders[0];

        while(_siders.children && _siders.children.length > 0) {
          _siders = _siders.children[0];
        }

        if(_siders?.key) {
          setHeaderKey(_siders?.key.split('/').filter(Boolean)[0])
          // setSiderKey(path)
          initSiderActiveKey(_siders?.key)
          navigate(_siders?.key)
          initOpenKeys(_siders?.key)
        }
      }
    }
    else {
      if(logingStatus === LoginStatus.Login) {
        const pathArr = pathname.split('/').filter(Boolean);
        setHeaderKey(`/${pathArr[0]}`)
        initSiderActiveKey(pathname)
      }
    }
  }, [pathname, siders, logingStatus])

  useEffect(() => {
    if(siders.length > 0 && activeHeaderKey) {
      const curMenu = siders.find(item => item.key === activeHeaderKey)
      const siderMenu = curMenu?.children
      setSiderMenus((siderMenu as MenuProps['items']) || [])
    }
  }, [siders, activeHeaderKey])

  const clearUserInfo = () => {
    navigate('/login')
  }

  const onHeaderMenuClick = ({ key }: { key: string }) => {
    setHeaderKey(key);
    let curMenu = siders.find(item => item.key === key);

    while(curMenu?.children && curMenu.children.length > 0) {
      curMenu = curMenu.children[0];
    }

    navigate(curMenu?.key as string);
    initOpenKeys(curMenu?.key as string);
  }

  const initOpenKeys = (path: string) => {
    setOpenDiserKeys(path.split('/').filter(Boolean).reduce((res, el) => { 
      if(res.length > 0) {
        res.push(res[res.length - 1] + '/' + el)
      }
      else {
        res.push('/' + el)
      }

      return res;
    }, [] as string []))
  }

  const initSiderActiveKey = (path: string, ) => {
    let activeKey = ''
    let _siders = siders
    path.split('/').filter(Boolean).some(el => {
      const _activeKey = activeKey + '/' + el;
      const curMenu = _siders.find(item => item.key === _activeKey);

      if(curMenu) {
        activeKey = _activeKey;
        if(curMenu.children && curMenu.children.length > 0) {
          _siders = curMenu.children;
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    })

    setSiderKey(activeKey)
  }

  return (
    <Spin spinning={useAppSelector(selectUserStatus) === LoginStatus.Loading} wrapperClassName={styles['spin-container']}>
      <Layout className={styles['layout-container']}>
        <Header className={styles['header']}>
          <div className={styles['logo']} />
          <Menu theme="dark" mode="horizontal" items={headerMenus} selectedKeys={[activeHeaderKey]} onSelect={onHeaderMenuClick}/>
        </Header>
        <Layout>
          {
            siderMenus && siderMenus.length > 0 && (
              <Sider width={200} className={styles['site-layout-background']}>
                <Menu
                  mode="inline"
                  openKeys={openSiderKeys}
                  onOpenChange={(keys) => setOpenDiserKeys(keys)}
                  selectedKeys={[activeSiderKey]}
                  onSelect={({ key }: { key: string }) => navigate(key)}
                  style={{ height: '100%', borderRight: 0 }}
                  items={siderMenus}
                />
              </Sider>
            )
          }
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className={styles['site-layout-background']}
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Outlet/>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Spin>
  )
}

export default App;