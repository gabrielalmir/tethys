<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class NotifyUsersCommand extends Command
{
    private $baseUrl = 'https://task-alerta-alagamento.onrender.com';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-users-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify users about the flood alert.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Notifying users...');

        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->info('No users found.');

            return;
        }

        // Notify each user
        $users->each(function (User $user) {
            $this->info("Notifying user {$user->email}...");
            $user->notifyUser();
        });
    }
}
