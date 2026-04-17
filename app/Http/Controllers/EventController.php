<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Match_;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * "Megevés" – a zombie megeszi a túlélőt.
     */
    public function eat(Request $request, int $matchId): JsonResponse
    {
        $user = $request->user();
        $match = Match_::findOrFail($matchId);

        // Check user is part of match
        if (! $match->hasUser($user->id)) {
            return response()->json(['message' => 'Nincs jogosultságod.'], 403);
        }

        // Get profiles
        $myProfile = $user->profile;
        $partnerId = $match->user_one_id === $user->id
            ? $match->user_two_id
            : $match->user_one_id;

        $partner = \App\Models\User::with('profile')->findOrFail($partnerId);
        $partnerProfile = $partner->profile;

        if (! $myProfile || ! $partnerProfile) {
            return response()->json(['message' => 'Mindkét félnek rendelkeznie kell profillal.'], 422);
        }

        // Validate: one must be zombie, other must be survivor (alive)
        if ($myProfile->type !== 'zombie') {
            return response()->json(['message' => 'Csak zombi hajthat végre megevést.'], 422);
        }

        if ($partnerProfile->type !== 'survivor') {
            return response()->json(['message' => 'Csak túlélőt lehet megenni.'], 422);
        }

        if ($partnerProfile->status === 'dead') {
            return response()->json(['message' => 'Ez a túlélő már halott.'], 422);
        }

        // Execute: survivor dies
        $partnerProfile->update(['status' => 'dead']);

        // Log event
        $event = Event::create([
            'zombie_id'   => $user->id,
            'survivor_id' => $partnerId,
            'match_id'    => $match->id,
            'type'        => 'eaten',
        ]);

        return response()->json([
            'message' => $partner->name . ' megevésre került! 🧟',
            'event'   => $event,
        ], 201);
    }

    /**
     * List events for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $events = Event::where('zombie_id', $user->id)
            ->orWhere('survivor_id', $user->id)
            ->with(['zombie.profile', 'survivor.profile'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($events);
    }
}
