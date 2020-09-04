import React, { useLayoutEffect, useRef } from 'react'
import { FireAnimation } from '@/presentation/p5/animations/fire-animation'

const AnimatedBackgroud: React.FC = () => {
  const myRef = useRef<HTMLDivElement>()
  const fireAnimation = new FireAnimation({ height: 300, width: 200 })

  useLayoutEffect(() => {
    fireAnimation.build(myRef.current)
  })

  return (
    <div ref={myRef}></div>
  )
}

export default AnimatedBackgroud
