import React, { useMemo, useState } from "react";
import { Slider } from 'antd';
import Markdown from "../../../../component/markdown";
import mdContent from './animationDelay.md?raw';
import styles from './index.module.scss';

const AnimationDelay: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(0)
  const [duration] = useState(1);
  
  const style = useMemo(() => {
    return {
      '--duration': `${duration}s`,
      '--delay': `-${sliderValue / 100 * duration}s`
    } as React.CSSProperties
  }, [sliderValue, duration])

  return (
    <div className={`article ${styles['demo-container']}`}>
      <div className={styles['markdown-wrapper']}>
        <Markdown
          md={mdContent}
        />
      </div>
      <div className={styles['demo-wrapper']}>
        <div className={styles['animation-delay-wrapper']} style={style}>
          <div className={styles['face']}>
            <div className={`${styles['face-eye']} ${styles['face-eye-left']}`}>
            </div>
            <div className={`${styles['face-eye']} ${styles['face-eye-right']}`}>
            </div>
            <div className={styles['face-mouth']}>
            </div>
          </div>
          <Slider min={0} max={100} step={1} value={sliderValue} onChange={(value:number) => setSliderValue(value)}/>
        </div>
      </div>
    </div>
  );
}

export default AnimationDelay