import React, { useEffect, useRef, useState } from 'react'
import './InfiniteScroll.css'

const InfiniteScroll = (props) => {

    const { list } = props
    const ITEMS_PER_PAGE = 20;
    const [page, setPage] = useState(1);
    const [visibleItems, setVisibleItems] = useState(list.slice(0, ITEMS_PER_PAGE))

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target

        if (scrollTop + clientHeight >= scrollHeight) {
            const nextPage = page + 1;
            const nextItems = list.slice(0, nextPage * ITEMS_PER_PAGE);

            if (nextItems.length > visibleItems.length) {
                setVisibleItems(nextItems);
                setPage(nextPage);
            }
        }

    }

    return (
        <div className='infiniteScrollContainer' onScroll={handleScroll}>
            {
                visibleItems.map((item) => (
                    <div className='listItem'>
                        item {item}
                    </div>
                ))
            }
            {visibleItems.length < list.length && <div className='listItem loader'>
                Loading ...
            </div>}
        </div>
    )
}

export default InfiniteScroll
