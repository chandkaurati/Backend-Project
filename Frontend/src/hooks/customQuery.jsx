import { useEffect, useState } from "react"
import axios  from "axios"

export const customReactQuery = (urlPath)=>{
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
   
    useEffect(()=>{
    ;(async()=>{
       try {
        setLoading(true)
        const responce = await axios.get(urlPath)
        setData(responce.data)
       } catch (error) {
        setError(error)
       } finally{
        setLoading(false)
       }
    })()    
    }, [])

    return [data, error, loading]
}