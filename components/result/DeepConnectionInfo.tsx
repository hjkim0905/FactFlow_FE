import React from 'react';

interface DeepInfo {
    title: string;
    description: string;
    url: string;
}

interface DeepConnectionInfoProps {
    infos: DeepInfo[];
}

export default function DeepConnectionInfo({ infos }: DeepConnectionInfoProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <h2 className="text-xl font-bold mb-4">더 깊이 연결되는 정보에요!</h2>
            <ul className="space-y-2">
                {infos.map((info, idx) => (
                    <li key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="font-medium text-black">{info.title}</h4>
                        <a
                            href={info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline"
                        >
                            {info.url}
                        </a>
                        <p className="text-sm text-black mt-2">{info.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
