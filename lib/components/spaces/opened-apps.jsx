import * as AppIcons from '../../app-icons'
import * as Utils from '../../utils'

const OpenedApps = ({ type, apps }) => {
  if (apps.length === 0) return null
  return apps
    .sort((a, b) => (type === 'stack' ? a['stack-index'] > b['stack-index'] : a.id > b.id))
    .map((app, i) => {
      const { minimized, focused, app: name, 'zoom-parent': zoomParent, 'zoom-fullscreen': zoomFullscreen } = app
      if (minimized === 1) return null

      const Icon = AppIcons.apps[name] || AppIcons.apps['Default']
      const classes = Utils.classnames('space__icon', {
        'space__icon--focused': focused === 1,
        'space__icon--fullscreen': zoomParent === 1 || zoomFullscreen === 1
      })
      return <Icon className={classes} key={i} />
    })
}

export default OpenedApps
