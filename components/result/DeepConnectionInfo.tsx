import type React from 'react';
import Image from 'next/image';

interface DeepInfo {
    title: string;
    description: string;
    url: string;
    source?: string;
    publisher?: string;
    icon?: React.ReactNode;
}

interface DeepConnectionInfoProps {
    infos: DeepInfo[];
}

export default function DeepConnectionInfo({ infos }: DeepConnectionInfoProps) {
    // infos가 undefined일 수 있으므로 안전하게 처리
    const safeInfos = infos || [];
    const cleanText = (text: string) =>
        text
            .replace(/\\?"/g, '"') // \" 또는 " → "
            .replace(/^"+|"+$/g, ''); // 맨 앞/뒤 " 모두 제거
    return (
        <div className="bg-white shadow rounded-lg p-6 text-black relative overflow-hidden">
            {/* 배경 SVG */}
            <Image
                src="/Ellipse 33.svg"
                alt=""
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[192px]h-[192px] opacity-60 pointer-events-none select-none z-0"
                draggable={false}
                aria-hidden
                width={192}
                height={192}
            />
            <div className="flex items-center mb-4 gap-2">
                <span className="text-[2rem] leading-[1.9375rem]">🙋🏻‍♂️</span>
                <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
                    더 깊이 연결되는 정보에요!
                </h2>
            </div>
            <div className="mx-auto w-[270px] gap grid grid-cols-2 z-10 relative">
                {safeInfos.slice(0, 4).map((info, idx) => (
                    <a
                        key={`${info.url}-${idx}`}
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={` flex flex-col items-center justify-center rounded-[20px] border-1 border-[#0073FF] bg-[#EFEFEF] p-4 w-[128px] h-[130px] shadow transition hover:shadow-lg hover:bg-blue-50 cursor-pointer${
                            idx % 2 === 0 ? ' mt-2' : ''
                        }`}
                        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center h-[80px] ">
                            <span className="font-bold text-[12.28px]">{cleanText(info.title)}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-2">{info.publisher}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
