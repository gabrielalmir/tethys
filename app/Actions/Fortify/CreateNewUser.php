<?php

namespace App\Actions\Fortify;

use App\Console\Commands\NotifyUsersCommand;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'postalcode' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ])->validate();

        $postalCode = trim(str_replace('-', '', $input['postalcode']));
        $phone = preg_replace('/[^0-9+]/', '', $input['phone']);

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'postalcode' => $postalCode,
            'phone' => $phone,
        ]);

        $notifier = new NotifyUsersCommand();
        $notifier->notifyUser($user);

        return $user;
    }
}
