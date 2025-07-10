import React from 'react';

interface RelatedArticle {
    title: string;
    url: string;
    summary: string;
}

interface RelatedArticlesProps {
    articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">동일 이슈 기사도 함께 볼까요?</h2>
            <ul className="space-y-2">
                {articles.map((article, idx) => (
                    <li key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-medium text-black">{article.title}</h4>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline"
                        >
                            {article.url}
                        </a>
                        <p className="text-sm text-black mt-2">{article.summary}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
