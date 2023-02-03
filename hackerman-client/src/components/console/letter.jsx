import {useState, useEffect, createRef} from 'react'
import {CSSTransition} from 'react-transition-group'

const Letter = ({blackout, blackoutDuration, children}) => {
    const [showBlackout, setShowBlackout] = useState(false);
    let nodeRef = createRef();
    
    useEffect(() => {
      let timeout;
      
      if (blackout) {
        setShowBlackout(true);
  
        const timeout = setTimeout(() => {
         setShowBlackout(false);
        }, blackoutDuration);
      }
      
      return () => clearTimeout(timeout)
    }, [true])
    
    return (
        <span className="letter">
        {blackout && (
            <CSSTransition
            in={showBlackout}
            timeout={{enter:0, exit:0}}
            classNames="blackout"
            nodeRef={nodeRef}
            >
            <span ref={nodeRef} className='blackout'></span>
            </CSSTransition>
        )}
        {children}
        </span>
    )
}

export default Letter;