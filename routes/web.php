<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
USE App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;
use App\Events\Typing;
use Illuminate\Http\Request;
use Inertia\Inertia;


Route::get('/', [MessageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('home');

Route::get('/dashboard', [MessageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/chat', [MessageController::class, 'index'])->name('chat.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    // Typing endpoint & mark as read endpoint
    Route::post('/typing', [MessageController::class, 'typing'])->name('typing');
    Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead'])->name('messages.read');
});


require __DIR__.'/auth.php';
