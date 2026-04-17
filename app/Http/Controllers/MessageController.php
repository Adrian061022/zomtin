<?php

namespace App\Http\Controllers;

use App\Models\Match_;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * List messages for a match.
     */
    public function index(Request $request, int $matchId): JsonResponse
    {
        $user = $request->user();
        $match = Match_::findOrFail($matchId);

        if (! $match->hasUser($user->id)) {
            return response()->json(['message' => 'Nincs jogosultságod.'], 403);
        }

        $messages = $match->messages()
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message in a match.
     */
    public function store(Request $request, int $matchId): JsonResponse
    {
        $user = $request->user();
        $match = Match_::findOrFail($matchId);

        if (! $match->hasUser($user->id)) {
            return response()->json(['message' => 'Üzenet csak match esetén küldhető.'], 403);
        }

        $data = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'match_id'  => $match->id,
            'sender_id' => $user->id,
            'body'      => $data['body'],
        ]);

        return response()->json($message->load('sender:id,name'), 201);
    }
}
