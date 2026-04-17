<?php

namespace App\Http\Controllers;

use App\Models\Match_;
use App\Models\Swipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SwipeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'swiped_id' => 'required|exists:users,id',
            'direction' => 'required|in:like,dislike',
        ]);

        $user = $request->user();

        // Nem lehet saját magadat likeolni
        if ($user->id == $data['swiped_id']) {
            return response()->json(['message' => 'Nem likeolhatod saját magadat.'], 422);
        }

        // Nem lehet duplikálni
        $existing = Swipe::where('swiper_id', $user->id)
            ->where('swiped_id', $data['swiped_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Már swipe-oltad ezt a profilt.'], 422);
        }

        $swipe = Swipe::create([
            'swiper_id' => $user->id,
            'swiped_id' => $data['swiped_id'],
            'direction' => $data['direction'],
        ]);

        $match = null;

        // Ha like, ellenőrizzük a kölcsönösséget
        if ($data['direction'] === 'like') {
            $reciprocal = Swipe::where('swiper_id', $data['swiped_id'])
                ->where('swiped_id', $user->id)
                ->where('direction', 'like')
                ->first();

            if ($reciprocal) {
                // Match létrehozása (kisebb id mindig user_one)
                $ids = [min($user->id, $data['swiped_id']), max($user->id, $data['swiped_id'])];

                $match = Match_::firstOrCreate([
                    'user_one_id' => $ids[0],
                    'user_two_id' => $ids[1],
                ]);
            }
        }

        return response()->json([
            'swipe' => $swipe,
            'match' => $match,
        ], 201);
    }
}
