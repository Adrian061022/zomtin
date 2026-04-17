<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swiper_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('swiped_id')->constrained('users')->onDelete('cascade');
            $table->enum('direction', ['like', 'dislike']);
            $table->timestamps();

            $table->unique(['swiper_id', 'swiped_id']); // nem duplikálható
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swipes');
    }
};
