import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  status = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error,
  };

  if (details !== undefined) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(
  message = "Unauthorized"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

/**
 * Create a not found response
 */
export function notFoundResponse(
  resource = "Resource"
): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Create a bad request response
 */
export function badRequestResponse(
  message: string,
  details?: unknown
): NextResponse<ApiResponse> {
  return errorResponse(message, 400, details);
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse<ApiResponse> {
  return badRequestResponse("Validation failed", error.issues);
}

/**
 * Wrapper for API route handlers with consistent error handling
 */
export async function withErrorHandler<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>,
  errorMessage = "An error occurred"
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await handler();
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error);

    if (error instanceof ZodError) {
      return handleValidationError(error) as NextResponse<ApiResponse<T>>;
    }

    return errorResponse(errorMessage) as NextResponse<ApiResponse<T>>;
  }
}
