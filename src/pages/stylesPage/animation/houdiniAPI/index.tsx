import React from "react";
import Markdown from "../../../../component/markdown";
import mdContent from './houdiniAPI.md?raw';
import styles from './index.module.scss';

const Houdini: React.FC = () => {
  return (
    <div className={`article ${styles['demo-container']}`}>
      <div className={styles['markdown-wrapper']}>
        <Markdown
          md={mdContent}
        />
      </div>
      <div className={styles['demo-wrapper']}>
        <div className={styles['demp-items-container']}>
          <div className={styles['demo-item']}>
            <div className={`${styles['demo-item-bg']}`}></div>
            <div className={styles['demo-item-title']}>普通渐变背景</div>
          </div>
          <div className={styles['demo-item']}>
            <div className={`${styles['demo-item-bg']} ${styles['demo-item-animation-gb']}`}></div>
            <div className={styles['demo-item-title']}>带有动画的渐变背景</div>
          </div>
          <div className={styles['demo-item']}>
            <div className={`${styles['demo-item-bg']} ${styles['demo-item-test1-gb']}`}></div>
            <div className={styles['demo-item-title']}>test1渐变背景</div>
          </div>
          <div className={styles['demo-item']}>
            <div className={`${styles['demo-item-bg']} ${styles['demo-item-test2-gb']}`}></div>
            <div className={styles['demo-item-title']}>test2渐变背景</div>
          </div>
          <div className={styles['demo-item']}>
            <div className={styles['demo-item-roate-border']}>
              <div className={styles['demo-item-roate-border-title']}>旋转边框</div>
            </div>
            <div className={styles['demo-item-title']}>旋转的边框</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Houdini