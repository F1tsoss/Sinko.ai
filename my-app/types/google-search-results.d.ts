declare module 'google-search-results' {
  interface GoogleSearchOptions {
    api_key: string;
    engine: string;
  }

  interface GoogleSearchParams {
    q: string;
    num?: number;
  }

  interface GoogleSearchResult {
    link: string;
    title: string;
    snippet: string;
    displayed_link: string;
  }

  interface GoogleSearchResponse {
    organic_results: GoogleSearchResult[];
  }

  export class GoogleSearch {
    constructor(options: GoogleSearchOptions);
    json(params: GoogleSearchParams): Promise<GoogleSearchResponse>;
  }
} 