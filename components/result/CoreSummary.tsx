import React from 'react';

interface CoreSummaryProps {
    summary: string;
}

export default function CoreSummary({ summary }: CoreSummaryProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">핵심만 간단하게 정리했어요!</h2>
            <p>{summary}</p>
        </div>
    );
}
