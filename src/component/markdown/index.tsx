/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './index.module.scss';
import 'github-markdown-css';

export interface IMarkdownProps {
  md: string
}

/**
 * markdown展示组件
 * 依赖react-markdown、remark-gfm、rehype-raw、react-syntax-highlighter、github-markdown-css
 * @param props 
 * @returns 
 */
const Markdown:React.FC<IMarkdownProps> = (props) => {
  const { md } = props;
  return <ReactMarkdown
    className={styles['markdown-wrapper']}
    children={md}
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    components={{
      code({className, children, node, ...otherProps}) {
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          // @ts-ignore
          <Prism
            {...otherProps}
            children={String(children).replace(/\n$/, '')}
            style={tomorrow}
            language={match[1]}
            PreTag={'div'}
          />
        ) : 
        <code className={className} {...otherProps}>
          {children}
        </code>
      }
    }}
  />
}

export default Markdown