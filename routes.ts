import { Router } from '@edgio/core'
import { qwikRoutes } from '@edgio/qwik'
import { isProductionBuild } from '@edgio/core/environment'

const router = new Router()

if (isProductionBuild()) {
  router.static('dist')
}

router.use(qwikRoutes)

export default router
