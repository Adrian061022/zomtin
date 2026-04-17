<?php

namespace App\Http\Controllers;

use App\Models\Match_;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    /**
     * List the authenticated user's matches.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $matches = Match_::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne.profile', 'userTwo.profile'])
            ->get()
            ->map(function ($match) use ($user) {
                $partner = $match->user_one_id === $user->id
                    ? $match->userTwo
                    : $match->userOne;

                return [
                    'match_id'  => $match->id,
                    'partner'   => $partner->load('profile'),
                    'created_at' => $match->created_at,
                ];
            });

        return response()->json($matches);
    }
}
