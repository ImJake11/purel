import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session_key');
    const username = request.cookies.get('username');

    if (!session || !username) {

        if (request.nextUrl.pathname.startsWith('/api')) {

            return NextResponse.redirect(new URL("/pages/login-page", request.url));
        }
        return NextResponse.redirect(new URL('/pages/login-page', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/pages/report-form', "/api/report"], // Runs on these routes only
};