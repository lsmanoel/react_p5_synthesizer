import React from 'react'
import { makeSynthesizer } from '@/main/factories'
import { Home } from '@/presentation/pages'
export const makeHome: React.FC = () => {
  return (
    <Home backgroundAnimation={makeSynthesizer()}/>
  )
}
