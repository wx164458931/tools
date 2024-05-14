import { default_route_config } from '../../router/config'
import { IRouteConfig } from '../../router/types'

const config: IRouteConfig = {
  ...default_route_config,
  meta: {
    title: 'page2'
  }
}

export default config