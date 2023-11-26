<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Mail\NotifyUserMail;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    private $baseUrl = 'https://task-alerta-alagamento.onrender.com';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'postalcode',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];


    public function canAccessPanel(Panel $panel): bool
    {
        return str_ends_with($this->email, '@tethys.com.br');
    }


    public function notifyUser()
    {
        $url = "{$this->baseUrl}/notify";

        Http::post($url, [
            'email' => $this->email,
        ]);

        $this->notifyUserEmail();

        Log::info("Notificação enviada para {$this->email}");
    }

    private function notifyUserEmail()
    {
        Mail::to($this->email)->send(new NotifyUserMail([
            'from' => env('MAIL_FROM_ADDRESS'),
            'from_name' => env('APP_NAME', 'Tethys'),
            'subject' => 'Alerta de alagamento na região de ' . $this->postalcode,
            'name' => $this->name,
        ]));
    }
}
