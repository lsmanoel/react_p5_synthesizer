import React, { useLayoutEffect, useRef } from 'react'
import { Animation } from '@/presentation/p5/protocols/animation'

type Props = {
  animation: Animation
}

const AnimatedBackgroud: React.FC<Props> = ({ animation }: Props) => {
  const myRef = useRef<HTMLDivElement>()

  useLayoutEffect(() => {
    animation.build(myRef.current)
  })

  return (
    <div ref={myRef}></div>
  )
}

export default AnimatedBackgroud
