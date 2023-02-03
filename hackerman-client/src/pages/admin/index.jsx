import { useState, onChange } from 'react';
import { EVENT_TYPES } from '../../util/enums';

const DebugPage = ({ onSendMessage }) => {
    const [eventType, setEventType] = useState(null);
    const [eventMessage, setEventMessage] = useState({});

    const sendEvent = () => {
        onSendMessage({
            event: EVENT_TYPES[eventType].event_name,
            data: eventMessage
        });
    }

    const hasPressedEnter = e => {
        if (e.key === 'Enter') {
            sendEvent();
        }
    }

    const handleEventTypeChange = e => {
        setEventMessage({});
        setEventType(e.target.value);
    }

    const handleInputChange = e => {
        const newMessage = eventMessage;
        newMessage[e.target.name] = e.target.value;
    }
    
    const EventInputs = () => {
        return !!eventType
            ? (
                <>
                    {EVENT_TYPES[eventType].event_data.map((arg, index) => (
                        <div key={index} style={{display: 'flex', flexDirection: 'column'}}>
                            <label htmlFor={arg.name}>{arg.display_name}</label>
                            <input
                                name={arg.name}
                                type={arg.type}
                                onChange={handleInputChange}
                                onKeyDown={hasPressedEnter}
                                autoComplete="off"
                                value={eventMessage[arg.name]}
                                placeholder={arg.debug_placeholder}
                            />
                        </div>
                    ))}

                    <button onClick={sendEvent}>Send Event</button>
                </>
            )
            : (
                null
            )
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <select onChange={handleEventTypeChange} defaultValue='default'>
                <option disabled value='default'>Select...</option>
                {EVENT_TYPES.map((event, index) => (<option key={index} value={index}>{event.display_name}</option>))}
            </select>

            <EventInputs />
        </div>
    )
}

export default DebugPage;