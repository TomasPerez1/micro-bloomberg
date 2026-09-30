// handwriten federation modules types

declare module 'remoteMarkets/Markets' {
  const Markets: React.ComponentType;
  export default Markets;
}

declare module 'remoteNews/News' {
  export interface NewsProps {
    markets?: string[];
  }
  const News: React.ComponentType<NewsProps>;
  export default News;
}
