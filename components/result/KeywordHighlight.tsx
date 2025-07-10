import React from 'react';

interface Keyword {
    keyword: string;
    description: string;
    color: string;
}

interface KeywordHighlightProps {
    keywords: Keyword[];
}

export default function KeywordHighlight({ keywords }: KeywordHighlightProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">중요한 키워드만 뽑았어요!</h2>
            <ul className="flex flex-wrap gap-3">
                {keywords.map((item, idx) => (
                    <li
                        key={idx}
                        className="p-4 rounded-lg border min-w-[180px] flex-1"
                        style={{ borderColor: item.color, backgroundColor: `${item.color}20` }}
                    >
                        <div className="font-bold text-black mb-1">{item.keyword}</div>
                        <div className="text-sm text-black">{item.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
