import React from 'react'
import AnimatedBackgroud from '@/presentation/components/p5/animated-backgroud/animated-backgroud'
import { Animation } from '@/presentation/p5/protocols/animation'

type Props = {
  backgroundAnimation: Animation
}

const Home: React.FC<Props> = ({ backgroundAnimation }: Props) => {
  return (
    <AnimatedBackgroud animation={ backgroundAnimation }/>
  )
}

export default Home
