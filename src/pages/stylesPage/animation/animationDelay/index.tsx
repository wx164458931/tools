import React, { useMemo, useState } from "react";
import { Slider } from 'antd';
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
    <div className={styles['center-wrapper']}>
      <div className={styles['animation-delay-wrapper']} style={style}>
        <div className={styles['face']}>
          <div className={`${styles['face-eye']} ${styles['face-eye-left']}`}>
          </div>
          <div className={`${styles['face-eye']} ${styles['face-eye-right']}`}>
          </div>
          <div className={styles['face-mouth']}>
          </div>
        </div>
        <Slider min={0} max={100} step={1} value={sliderValue} onChange={(value) => setSliderValue(value)}/>
        <div className={styles['animation-delay-des']}>
          <p>这个例子实现的功能是利用受控的复杂的样式变化。</p>
          <p>例如笑脸颜色、眼睛的形状、嘴巴的形状等，都可以根据滑块的值来变化</p>
          <p>这种复杂的变化是很难通过js来控制实现的，因为中间状态非常多。变化非常负责</p>
          <p>以这个笑脸评分为例，从0到100有101种状态，每个状态对应左眼、右眼、嘴巴、颜色这种信息的变化</p>
          <p>这些变化规则很难依靠js去计算得到</p>
          <p>所以这个示例是以动画来实现样式的转变，主要利用了animation-delay属性配合animation-play-state设置为paused来实现</p>
          <p>具体思路如下</p>
          <ul>
            <li>利用js来设置animation-duration,让js能够知道动画时长</li>
            <li>设置animation-fill-mode为forwards，让动画结束之后dom样式停留在结束的样式</li>
            <li>设置animation-play-state为paused来讲动画暂停</li>
            <li>利用animation-delay来控制动画的延迟,这就是关键的地方，其关键点如下：
              <ul>
                <li>该属性本是用来控制动画开始播放的时间</li>
                <li>当该值为0时（默认值就是0），表示动画会立刻播放，或者准备的描述是立刻从动画起点开始播放</li>
                <li>当该值为正时，表示动画会延迟播放，或者可以描述为延迟设置的时长后从动画起点开始播放</li>
                <li>当该值为负时，负值会导致动画立即开始，但是从动画循环的某个时间点开始。这个看上去不太好理解，可以这样去理解，当前时间可以把它想象成时间为0的时刻，当该属性为负时，表示现在的时刻动画已经播放了属性值的绝对值那么长的时间了。那么浏览器的渲染进程就会计算出正常一个动画的播放循环中，这个时间点时的动画状态，然后动画将会从这个状态开始播放</li>
                <li>关键点来了，由于负值的特性，加上我们将动画一开始就暂停了，那么动画就会停在开始播放时的状态。由于该属性的负值会导致动画开始状态发生变化，所以在暂停状态，调整该属性负值的大小，也会引起动画改变，且改变由浏览器渲染进程来计算当前状态是什么样</li>
                <li>利用上述这点，将滑块的值转换成百分比，然后将animation-duration值的对应百分比的值弄成负数负值给改属性，就可以实现动画效果跟随滑块变化，从而实现复杂的UI改变同样可以精细控制中间状态</li>
              </ul>
            </li>
          </ul>
          <p>这种方式控制复杂UI变化优势在于方案简单，代码逻辑通用，且计算过程可由动画的时间函数决定。缺点就是一定需要能通过动画实现开始到最重UI状态的转换，如果某些动画改变的CSS属性改变时突变的，没有中间状态的，那么可能就不太适合这种方案，或者需要改变UI的CSS实现方式</p>
        </div>
      </div>
    </div>
  );
}

export default AnimationDelay