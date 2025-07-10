import React from 'react';

interface EmotionMixProps {
    positive: number;
    negative: number;
    neutral: number;
}

export default function EmotionMix({ positive, negative, neutral }: EmotionMixProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">감정 표현, 얼마나 섞였을까요?</h2>
            <ul className="space-y-1">
                <li>😊 긍정: {positive}%</li>
                <li>😠 부정: {negative}%</li>
                <li>😐 중립: {neutral}%</li>
            </ul>
        </div>
    );
}
