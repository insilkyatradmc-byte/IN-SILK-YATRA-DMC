<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [];

    /**
     * The inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $e)
    {
        // For API routes, always return JSON responses
        if ($request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Handle API exceptions and return JSON response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiException($request, Throwable $e)
    {
        $statusCode = 500;
        $message = 'Internal Server Error';

        if ($e instanceof \Illuminate\Http\Exceptions\HttpResponseException) {
            $statusCode = $e->getResponse()->getStatusCode();
            $message = $e->getMessage();
        } elseif ($e instanceof \Tymon\JWTAuth\Exceptions\JWTException || 
                   $e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException ||
                   $e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException ||
                   $e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException) {
            $statusCode = 401;
            $message = $e->getMessage() ?: 'Unauthenticated';
        } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
            $statusCode = $e->getStatusCode();
            $message = $e->getMessage() ?: $this->getDefaultMessage($statusCode);
        } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
            $statusCode = 422;
            $message = 'Validation failed';
        } elseif ($e instanceof \Illuminate\Auth\AuthenticationException) {
            $statusCode = 401;
            $message = 'Unauthenticated';
        }

        $response = [
            'success' => false,
            'message' => $message,
        ];

        // Add error details in debug mode
        if (config('app.debug')) {
            $response['error'] = [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ];
        }

        // Add validation errors if it's a validation exception
        if ($e instanceof \Illuminate\Validation\ValidationException) {
            $response['errors'] = $e->errors();
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Get default message for HTTP status code.
     *
     * @param  int  $statusCode
     * @return string
     */
    protected function getDefaultMessage($statusCode)
    {
        $messages = [
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            503 => 'Service Unavailable',
        ];

        return $messages[$statusCode] ?? 'Error';
    }
}

