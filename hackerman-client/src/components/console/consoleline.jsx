import Letter from './letter'
import { getRandomInt } from '../../util/math';
import { memo } from 'react';

const ConsoleLine = memo(({ string }) => {
    const letters = string.split("");
    
    return(
      <div className="console_line">
        {letters.map((char, index) => {
        const blackout = getRandomInt(100);
        
        return blackout <= 20
          ? <Letter key={index}>{char}</Letter>
          : <Letter key={index} blackout={true} blackoutDuration={getRandomInt(200)}>{char}</Letter>
      })}
      </div>
    )
  });

export default ConsoleLine;