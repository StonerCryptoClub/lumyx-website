export interface Asset {
    sys: {
        id: string;
    };
    fields: {
        file: {
            url: string;
        };
    };
}

export interface Author {
    fields: {
        name: string;
        avatar: {
            sys: {
                id: string;
            };
        };
    };
}

export interface BlogPost {
    fields: {
        title: string;
        slug: string;
        excerpt: string;
        publishDate: string;
        readTime: number;
        content: any; // Rich text content
        featuredImage: {
            sys: {
                id: string;
            };
        };
        author: Author;
        category?: string;
    };
}

export interface CaseStudy {
    fields: {
        title: string;
        slug: string;
        excerpt: string;
        category: string;
        featuredImage: {
            sys: {
                id: string;
            };
        };
    };
}

export interface ContentfulResponse<T> {
    items: T[];
    includes?: {
        Asset?: Asset[];
    };
}

export const contentfulClient = {
    spaceId: '74kxarv2y1kp',
    accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
}; 