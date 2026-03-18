import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Structured logger — outputs JSON lines for easy parsing / filtering
// ---------------------------------------------------------------------------

type LogContext = Record<string, unknown>

function formatError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) return { message: err.message, stack: err.stack }
  return { raw: err }
}

export const log = {
  info(message: string, context?: LogContext) {
    console.log(JSON.stringify({ level: 'info', ts: new Date().toISOString(), message, ...context }))
  },
  warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify({ level: 'warn', ts: new Date().toISOString(), message, ...context }))
  },
  error(message: string, err?: unknown, context?: LogContext) {
    console.error(
      JSON.stringify({
        level: 'error',
        ts: new Date().toISOString(),
        message,
        error: err !== undefined ? formatError(err) : undefined,
        ...context,
      })
    )
  },
}

// ---------------------------------------------------------------------------
// Canonical response shape
//
//  Success → { success: true,  data: T,            message?: string }
//  Error   → { success: false, error: { code, message, details? } }
// ---------------------------------------------------------------------------

export type ApiSuccess<T> = { success: true; data: T; message?: string }
export type ApiError = { success: false; error: { code: string; message: string; details?: unknown } }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function ok<T>(data: T, message?: string) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data, message }, { status: 200 })
}

function created<T>(data: T, message?: string) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data, message }, { status: 201 })
}

function accepted<T>(data: T, message?: string) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data, message }, { status: 202 })
}

function badRequest(message: string, details?: unknown) {
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'BAD_REQUEST', message, details } },
    { status: 400 }
  )
}

function unauthorized(message = 'Unauthorized') {
  log.warn('Unauthorized access attempt', { message })
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'UNAUTHORIZED', message } },
    { status: 401 }
  )
}

function forbidden(message = 'Forbidden') {
  log.warn('Forbidden', { message })
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'FORBIDDEN', message } },
    { status: 403 }
  )
}

function notFound(message = 'Resource not found') {
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'NOT_FOUND', message } },
    { status: 404 }
  )
}

/** 419 — CSRF token mismatch / session expired */
function sessionExpired(message = 'Session expired, please refresh and try again') {
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'SESSION_EXPIRED', message } },
    { status: 419 }
  )
}

function unprocessable(message: string, details?: unknown) {
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'UNPROCESSABLE_ENTITY', message, details } },
    { status: 422 }
  )
}

function serverError(message: string, err?: unknown, context?: LogContext) {
  log.error(message, err, context)
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message } },
    { status: 500 }
  )
}

function serviceUnavailable(message = 'Service unavailable') {
  return NextResponse.json<ApiError>(
    { success: false, error: { code: 'SERVICE_UNAVAILABLE', message } },
    { status: 503 }
  )
}

export const api = {
  ok,
  created,
  accepted,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  sessionExpired,
  unprocessable,
  serverError,
  serviceUnavailable,
}
