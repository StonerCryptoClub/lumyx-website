import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Tokens } from 'csrf';

const tokens = new Tokens();
const SECRET = process.env.CSRF_SECRET || 'default-csrf-secret';

export function generateToken() {
  return tokens.create(SECRET);
}

export async function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET requests
  if (request.method === 'GET') {
    return NextResponse.next();
  }

  const token = request.headers.get('x-csrf-token');
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF token missing' }),
      { status: 403 }
    );
  }

  try {
    const valid = tokens.verify(SECRET, token);
    if (!valid) {
      throw new Error('Invalid token');
    }
    return NextResponse.next();
  } catch {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid CSRF token' }),
      { status: 403 }
    );
  }
} 