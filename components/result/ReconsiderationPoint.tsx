import React, { useRef } from 'react';
import Image from 'next/image';
interface ReconsiderationPointProps {
    points: string[];
    explanations?: string[];
}
import alert from '@/public/Alert.svg';
export default function ReconsiderationPoint({ points, explanations = [] }: ReconsiderationPointProps) {
    // points가 undefined일 수 있으므로 안전하게 처리
    const safePoints = points || [];
    const safeExplanations = explanations || [];
    const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const lastPointRef = useRef<HTMLDivElement>(null);
    const overlayWidth = gridRef.current ? gridRef.current.offsetWidth + 5 : '100%';
    const overlayHeight = lastPointRef.current
        ? lastPointRef.current.offsetTop + lastPointRef.current.offsetHeight
        : gridRef.current
        ? gridRef.current.offsetHeight
        : '100%';

    return (
        <div className="bg-white shadow rounded-lg p-6 text-black">
            <div className="flex items-center mb-4 gap-2">
                <Image src={alert} alt="alert" className="w-[32px] h-[32px]" />
                <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
                    다시 생각해볼 지점이 있어요!
                </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 ml-[-10px] relative" ref={gridRef}>
                {safePoints.slice(0, 4).map((point, i) => (
                    <div
                        key={`point-${i}-${point.substring(0, 10)}`}
                        className="rounded-[50px] bg-[#696969] text-white flex items-center justify-center mb-2 text-[11px] font-[400] shadow-[inset_-7px_-26px_4px_0px_rgba(0,0,0,0.25)] px-7 py-5 h-[67px] w-[160px]"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        tabIndex={0}
                        onFocus={() => setHoveredIdx(i)}
                        onBlur={() => setHoveredIdx(null)}
                        style={{ cursor: 'pointer' }}
                        ref={i === 3 ? lastPointRef : undefined}
                    >
                        {i + 1}. {point}
                    </div>
                ))}
                {/* Hover Overlay */}
                {hoveredIdx !== null && (
                    <div
                        className="flex flex-col justify-start items-start"
                        style={{
                            background: 'rgba(31,39,48,0.95)',
                            borderRadius: 31,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: overlayWidth,
                            height: overlayHeight,
                            zIndex: 30,
                            pointerEvents: 'none',
                            boxSizing: 'border-box',
                            padding: '24px 28px',
                        }}
                    >
                        <div
                            className="font-pretendard font-semibold text-[13px] text-white mb-3"
                            style={{ lineHeight: '16px', width: '100%' }}
                        >
                            {safePoints[hoveredIdx]}
                        </div>
                        <div
                            className="font-pretendard font-normal text-[10px] text-white"
                            style={{ lineHeight: '14px', width: '100%', wordBreak: 'keep-all', overflow: 'hidden' }}
                        >
                            {safeExplanations[hoveredIdx]}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
