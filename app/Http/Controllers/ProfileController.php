<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return response()->json(['message' => 'Nincs profil.'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Create or update the authenticated user's profile.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type'     => 'required|in:zombie,survivor',
            'nickname' => 'required|string|max:255',
            'bio'      => 'nullable|string|max:1000',
            'avatar'   => 'nullable|string|max:500',
            'age'      => 'nullable|integer|min:0|max:999',
        ]);

        $profile = $request->user()->profile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            array_merge($data, [
                'status' => $data['type'] === 'zombie' ? 'undead' : 'alive',
            ])
        );

        return response()->json($profile, 201);
    }

    /**
     * List other users' profiles (for swiping), excluding self and already swiped.
     */
    public function list(Request $request): JsonResponse
    {
        $user = $request->user();

        $swipedIds = $user->swipes()->pluck('swiped_id');

        $profiles = Profile::with('user')
            ->where('user_id', '!=', $user->id)
            ->whereNotIn('user_id', $swipedIds)
            ->where('status', '!=', 'dead')
            ->get();

        return response()->json($profiles);
    }
}
