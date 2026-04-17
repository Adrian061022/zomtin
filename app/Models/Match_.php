<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Match_ extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'user_one_id',
        'user_two_id',
    ];

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'match_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'match_id');
    }

    /**
     * Check if a user belongs to this match.
     */
    public function hasUser(int $userId): bool
    {
        return $this->user_one_id === $userId || $this->user_two_id === $userId;
    }

    /**
     * Get the other user in the match.
     */
    public function getPartner(int $userId): BelongsTo
    {
        return $this->user_one_id === $userId
            ? $this->userTwo()
            : $this->userOne();
    }
}
