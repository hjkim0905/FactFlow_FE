import { NextRequest } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
    }
    try {
        const { result } = await ogs({ url });
        let image = null;
        if (Array.isArray(result.ogImage)) {
            const first = (result.ogImage as any[])[0];
            if (first && typeof first === 'object' && 'url' in first) {
                image = (first as any).url;
            }
        } else if (result.ogImage && typeof result.ogImage === 'object' && 'url' in result.ogImage) {
            image = (result.ogImage as any).url;
        }
        return new Response(JSON.stringify({ image }), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ image: null }), { status: 500 });
    }
}
