<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SwipeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'store']);
    Route::get('/profiles', [ProfileController::class, 'list']);

    // Swipe
    Route::post('/swipes', [SwipeController::class, 'store']);

    // Matches
    Route::get('/matches', [MatchController::class, 'index']);

    // Messages
    Route::get('/matches/{matchId}/messages', [MessageController::class, 'index']);
    Route::post('/matches/{matchId}/messages', [MessageController::class, 'store']);

    // Events (megevés)
    Route::post('/matches/{matchId}/eat', [EventController::class, 'eat']);
    Route::get('/events', [EventController::class, 'index']);
});
