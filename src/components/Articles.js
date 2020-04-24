import React from "react";
import unified from "unified";
import parse from "rehype-parse";
import sanitize from "rehype-sanitize";
import rehype2react from "rehype-react";
import format from "rehype-format";
import { StaticQuery, graphql } from 'gatsby';

const htmlParser = unified()
                    .use(parse, { fragment: true })
                    .use(sanitize)
                    .use(format)
                    .use(rehype2react, {createElement: React.createElement});

class Articles extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            articles: {}
        }
    }
    
    render() {
        const scetFeed = this.props.scetFeed.allFeedScet.nodes;
        const articles = [];
        scetFeed.forEach(article => {
            htmlParser.process(article.content.encoded, (err, file) => {
                if (!err) {
                    articles.push(<div>{file.contents}</div>)
                }
            })
        })
        return (
            <div>
                {articles}
            </div>
        )
    }
}

export default () => (
    <StaticQuery
        query={graphql`
        query {
            allFeedScet {
                nodes {
                  title
                  link
                  id
                  content {
                    encoded
                  }
                  pubDate
                }
            }
        }
    `}
        render={(data, count) => <Articles scetFeed={data} count={count} />}
    />
)