declare module 'youtube-search-python' {
  interface YoutubeSearchOptions {
    limit?: number;
    language?: string;
    region?: string;
  }

  interface YoutubeSearchResult {
    id: string;
    title: string;
    description: string;
    channel: {
      name: string;
    };
    publishedTime: string;
    viewCount: number;
  }

  interface YoutubeSearchResponse {
    result: YoutubeSearchResult[];
  }

  export class YoutubeSearch {
    static search(query: string, options?: YoutubeSearchOptions): Promise<YoutubeSearchResponse>;
  }
} 