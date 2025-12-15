import React, { useEffect, useState } from 'react'
import './Pagination.css'
const LIMIT = 10;

const Pagination = () => {
    const [itemsSkip, setItemsSkip] = useState(0)
    const [data, setData] = useState([])


    const fetchData = async () => {
        const res = await fetch(`https://dummyjson.com/products?limit=${LIMIT}&skip=${itemsSkip}&select=title,price`)

        console.log(res)
        const data = await res.json()

        if (data) {
            setData(data)
        }
    }

    const handlePagination = (pageNo) => {
        setItemsSkip(LIMIT * pageNo)
    }

    useEffect(() => {
        fetchData()
    }, [itemsSkip])

    console.log(data)

    return (
        <div className='wrapper'>

            <div className='items_container'>
                {data?.products?.map((item) => (
                    item?.title
                ))}
            </div>

            <div className='pages_container'>
                {Array.from({ length: 5 }, (_, i) => (
                    <div className='pageNo' onClick={() => handlePagination(i + 1)}>
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pagination
