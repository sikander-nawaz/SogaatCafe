import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "../Pages/HomePage"
import About from "../Pages/AboutPage"
import Error from "../Pages/ErrorPage"


const Routing = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<Error />} />
      </Route>
    </Routes>
  )
}

export default Routing