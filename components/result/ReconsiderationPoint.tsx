import React from 'react';

interface ReconsiderationPointProps {
    points: string[];
}

export default function ReconsiderationPoint({ points }: ReconsiderationPointProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">다시 생각해볼 지점이 있어요!</h2>
            <ul className="list-disc list-inside ml-4 mt-1">
                {points.map((point, i) => (
                    <li key={i}>{point}</li>
                ))}
            </ul>
        </div>
    );
}
