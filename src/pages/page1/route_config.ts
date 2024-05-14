import { default_route_config } from '../../router/config'
import { IRouteConfig } from '../../router/types'

const config: IRouteConfig = {
  ...default_route_config,
  meta: {
    title: 'page1'
  }
}

export default config