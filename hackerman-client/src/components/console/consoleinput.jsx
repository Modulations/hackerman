import { useState } from "react";

const ConsoleInput = ({ onSendCommand }) => {
    const [input, setInput] = useState("");
    const onKeyDown = e => {
        if(e.key === 'Enter'){
            onSendCommand(input);
            setInput("");
        }
    }

    return <input className="console_input" name="console" autoComplete="off" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} />
}

export default ConsoleInput;