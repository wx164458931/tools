import React from "react";
import Markdown from "../../component/markdown";
import mdContent from './readme.md?raw'

const ApiPage: React.FC = () => {
  return (
    <div className="article">
      <Markdown md={mdContent}/>
    </div>
  );
}

export default ApiPage