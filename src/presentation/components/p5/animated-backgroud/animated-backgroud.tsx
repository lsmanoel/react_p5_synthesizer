import React, { useLayoutEffect, useRef } from 'react'
import { FireAnimation } from '@/presentation/p5/animations/fire-animation/fire-animation'

const AnimatedBackgroud: React.FC = () => {
  const myRef = useRef<HTMLDivElement>()
  const fireAnimation = new FireAnimation({ height: 100, width: 100 }, 3)

  useLayoutEffect(() => {
    fireAnimation.build(myRef.current)
  })

  return (
    <div ref={myRef}></div>
  )
}

export default AnimatedBackgroud
