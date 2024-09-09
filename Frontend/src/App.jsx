import { useEffect, useState } from 'react'

import './App.css'
import axios from 'axios'
import { customReactQuery } from './hooks/customQuery'

function App() {
  const [search, setSearch] = useState()
  const [data, error, loading] = customReactQuery(`/api/products?search}`)
  useEffect(()=>{
  
  }, [])

  if(error){
    return <h3 style={{color:"red"}}>some thing went wrong</h3>
  }

  if(loading){
    return <h2 style={{color:"green"}}>Loading</h2>
  }
  return (
    <>
    <h1>api and react </h1>
    <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value)}} />
    <h2>number of Products {data.length}</h2>
    </>
  )
}

export default App
