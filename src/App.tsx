import { Experience } from './scene/Experience'
import { Hud } from './ui/Hud'
import { Panel } from './ui/Panel'
import { Loader } from './ui/Loader'
import { QuickView } from './ui/QuickView'
import { useStudio } from './store'

export default function App() {
  const lampOn = useStudio((s) => s.lampOn)
  return (
    <div className="app" data-theme={lampOn ? 'night' : 'light'}>
      <div className="stage"><Experience /></div>
      <Hud />
      <Panel />
      <QuickView />
      <Loader />
    </div>
  )
}
