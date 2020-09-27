import React from 'react'
import AnimatedBackgroud from '@/presentation/components/p5/animated-backgroud/animated-backgroud'
import { Animation } from '@/presentation/p5/protocols/animation'
import DungeonBackground from '@/presentation/components/background/dungeon-background'
import Styles from './home-styles.scss'

type Props = {
  backgroundAnimation: Animation
}

const Home: React.FC<Props> = ({ backgroundAnimation }: Props) => {
  return (
    <div >
      <div className={Styles.background}>
        <DungeonBackground />
      </div>
      <div className={Styles.animation}>
        <AnimatedBackgroud animation={ backgroundAnimation }/>
      </div>
    </div>
  )
}

export default Home
