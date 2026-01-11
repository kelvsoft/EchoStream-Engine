<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use App\Events\Typing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'messages' => Message::with('user')->latest()->take(50)->get()->reverse()->values()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('messages', 'public')
            : null;

        $message = $request->user()->messages()->create([
            'body' => $request->body ?? '',
            'image' => $imagePath,
        ]);

        $message->load('user');

        // Broadcast to EVERYONE (so sender also gets the WebSocket update)
        broadcast(new MessageSent($message));

        return back();
    }

    public function typing(Request $request)
    {
        $request->validate(['typing' => 'required|boolean']);

        // Only for typing, i use toOthers()
        broadcast(new Typing(auth()->user(), $request->typing))->toOthers();

        return response()->json(['status' => 'notified']);
    }

    public function markAsRead(\App\Models\Message $message)
    {
        // If I am not the one who sent it, mark it as read
        if ($message->user_id !== auth()->id()) {
            $message->update(['is_read' => true]);

            // Broadcast to the sender so their check marks turn blue
            broadcast(new \App\Events\MessageRead($message->id))->toOthers();
        }
        return response()->json(['success' => true]);
    }
}
