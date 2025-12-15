import React, { useState } from 'react'
import './Virtualization.css'

const Virtualization = (props) => {

    const { list, height, width, itemHeight } = props

    const [indices, setIndices] = useState([0, Math.floor(height / itemHeight)])
    const visibleList = list.slice(indices[0], indices[1] + 1);

    const handleScroll = (e) => {

        const { scrollTop } = e.target

        const newStartIndex = Math.floor(scrollTop / itemHeight);
        const newEndIndex = newStartIndex + Math.floor(height / itemHeight)

        setIndices([newStartIndex, newEndIndex])
    }
    return (
        <div className='virtualizedContainer' style={{
            height, width, backgroundColor: "grey", overflow: 'auto'
        }}
            onScroll={handleScroll}
        >
            <div style={{ height: list.length * itemHeight, position: 'relative' }
            } >
                {
                    visibleList.map((item, index) => {
                        return (
                            <div className='item' style={{
                                height: itemHeight,
                                background: "coral",
                                borderTop: "2px solid grey",
                                position: 'absolute',
                                top: (indices[0] + index) * itemHeight,
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                {"item " + item}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Virtualization
