<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'zombie_id',
        'survivor_id',
        'match_id',
        'type',
    ];

    public function zombie(): BelongsTo
    {
        return $this->belongsTo(User::class, 'zombie_id');
    }

    public function survivor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'survivor_id');
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(Match_::class, 'match_id');
    }
}
