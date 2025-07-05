'use client';
import { useState } from 'react';

export default function Home() {
    const [testResult, setTestResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleTestApi() {
        setLoading(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/test', { method: 'POST' });
            const data = await res.json();
            setTestResult(data.message ?? JSON.stringify(data));
        } catch (e) {
            setTestResult('Error: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
            <button
                onClick={handleTestApi}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? '테스트중...' : '테스트하기'}
            </button>
            {testResult && (
                <div className="mt-4 p-4 bg-white rounded shadow text-gray-800 max-w-xl break-all">{testResult}</div>
            )}
        </div>
    );
}
