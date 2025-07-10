import type React from 'react';
import Image from 'next/image';

interface DeepInfo {
    title: string;
    description: string;
    url: string;
    source?: string;
    icon?: React.ReactNode;
}

interface DeepConnectionInfoProps {
    infos: DeepInfo[];
}

export default function DeepConnectionInfo({ infos }: DeepConnectionInfoProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black relative overflow-hidden">
            {/* 배경 SVG */}
            <Image
                src="/Ellipse 33.svg"
                alt=""
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] opacity-60 pointer-events-none select-none z-0"
                draggable={false}
                aria-hidden
                width={320}
                height={320}
            />
            <div className="text-xl font-bold mb-4 flex items-center gap-2 z-10 relative">
                <span role="img" aria-label="연결">
                    🙋🏻‍♂️
                </span>
                더 깊이 연결되는 정보에요!
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 z-10 relative">
                {infos.slice(0, 4).map((info, idx) => (
                    <a
                        key={idx}
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-[20px] border-2 border-[#0073FF] bg-[#EFEFEF] p-4 w-[128px] min-h-[111px] shadow transition hover:shadow-lg hover:bg-blue-50 cursor-pointer"
                        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-[15px]">{info.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{info.description}</div>
                        {info.source && <div className="text-[11px] text-gray-400 mt-4 text-right">{info.source}</div>}
                    </a>
                ))}
            </div>
        </div>
    );
}
