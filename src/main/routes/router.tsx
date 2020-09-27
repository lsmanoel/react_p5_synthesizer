import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeHome } from '@/main/factories'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={makeHome} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
