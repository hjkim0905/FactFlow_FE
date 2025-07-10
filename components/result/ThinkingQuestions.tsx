import React from 'react';

interface ThinkingQuestionsProps {
    questions: string[];
}

export default function ThinkingQuestions({ questions }: ThinkingQuestionsProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">사고력을 길러주는 추천 질문이에요!</h2>
            <ul className="list-disc list-inside ml-4 mt-1">
                {questions.map((q, i) => (
                    <li key={i}>{q}</li>
                ))}
            </ul>
        </div>
    );
}
