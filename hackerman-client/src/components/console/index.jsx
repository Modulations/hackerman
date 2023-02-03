import { useEffect, memo } from 'react';
import ConsoleLine from './consoleline'
import {animateScroll} from 'react-scroll'

const Console = ({ log }) => {
    useEffect(() => {
        animateScroll.scrollToBottom({
        containerId: "main_console",
        duration: 200,
        isDynamic: true,
        });
    })

    return (
        <div id="main_console" className="console">
        {log.map((message, index) =>
                    <ConsoleLine key={index} string={message} />
        )}
        </div>
    )
}

export default Console;