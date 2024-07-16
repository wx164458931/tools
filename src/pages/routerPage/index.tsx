import React from "react";
import Markdown from "../../component/markdown";
import mdContent from './readme.md?raw';
import { useKeepAliveUniqueCode, useActive, useUnActive } from '../../component/keepAlive'

const RouterPage: React.FC = () => {
  const kpCode = useKeepAliveUniqueCode();
  
  useActive(() => {
    console.log('page actived!!!');
  }, kpCode)

  useUnActive(() => {
    console.log('page unActived!!!');
  }, kpCode)
  
  return (
    <div className="article">
      <Markdown md={mdContent}/>
    </div>
  );
}

export default RouterPage