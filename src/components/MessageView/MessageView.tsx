import React, {useRef, useEffect} from 'react'
import { Message } from '../../App'
import styles from "./MessageView.module.css";

interface Props extends Message {
    currentUser: string
}

const MessageView = ({from, text, currentUser}: Props) => {
    const myDiv = useRef<HTMLDivElement>(null)
    useEffect(() => {
        myDiv.current?.scrollIntoView()
    }, [])
    return (
        <div 
            className={styles.MessageView}
            ref={myDiv}
            style={{textAlign: (from === currentUser ? "right" : "left")}}
            // style={{textAlign: 'right'}}
        >
            <sub style={{fontSize: "10px"}}>{from}</sub>
            <br />
            {text}
        </div>
    )
}

export default MessageView
