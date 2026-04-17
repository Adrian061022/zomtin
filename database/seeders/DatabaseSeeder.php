<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo zombik
        $zombieNames = ['Rothadó Ricsi', 'Zombi Zoli', 'Hullamerev Hanna', 'Koponya Kati', 'Agyevő Ádám'];
        foreach ($zombieNames as $i => $name) {
            $user = User::create([
                'name'     => $name,
                'email'    => 'zombie' . ($i + 1) . '@zombitinder.com',
                'password' => 'password',
            ]);
            Profile::create([
                'user_id'  => $user->id,
                'type'     => 'zombie',
                'nickname' => $name,
                'bio'      => 'Agyakat keresek... és szerelmet 🧟',
                'age'      => rand(20, 200),
                'status'   => 'undead',
            ]);
        }

        // Demo túlélők
        $survivorNames = ['Túlélő Tamás', 'Bátor Bence', 'Futós Fanni', 'Shotgun Sára', 'Bunker Béla'];
        foreach ($survivorNames as $i => $name) {
            $user = User::create([
                'name'     => $name,
                'email'    => 'survivor' . ($i + 1) . '@zombitinder.com',
                'password' => 'password',
            ]);
            Profile::create([
                'user_id'  => $user->id,
                'type'     => 'survivor',
                'nickname' => $name,
                'bio'      => 'Még élek! Társat keresek az apokalipszisben 💪',
                'age'      => rand(18, 50),
                'status'   => 'alive',
            ]);
        }
    }
}
