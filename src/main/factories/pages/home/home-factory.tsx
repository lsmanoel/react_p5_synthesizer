import React from 'react'
import { makeFireAnimation } from '@/main/factories'
import { Home } from '@/presentation/pages'
export const makeHome: React.FC = () => {
  return (
    <Home backgroundAnimation={makeFireAnimation()}/>
  )
}
