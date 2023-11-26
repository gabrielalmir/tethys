<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\Pages\CreateUser;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

use Filament\Tables\Filters\Filter;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationLabel = 'Usuários';
    protected static ?string $label = 'Usuário';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nome')
                    ->placeholder('Steve Jobs')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('E-mail')
                    ->placeholder('newton@apple.com')
                    ->required()
                    ->email()
                    ->unique(User::class, 'email')
                    ->maxLength(255),
                Forms\Components\TextInput::make('password')
                    ->label('Senha')
                    ->required()
                    ->password()
                    ->confirmed()
                    ->dehydrateStateUsing(function ($value) {
                        return Hash::make($value);
                    })
                    ->visible(fn ($livewire) => $livewire instanceof CreateUser)
                    ->minLength(8)
                    ->maxLength(255),
                Forms\Components\TextInput::make('password_confirmation')
                    ->label('Confirmação de senha')
                    ->required()
                    ->password()
                    ->dehydrateStateUsing(function ($value) {
                        return Hash::make($value);
                    })
                    ->visible(fn ($livewire) => $livewire instanceof CreateUser)
                    ->minLength(8)
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->label('Telefone')
                    ->placeholder('(99) 99999-9999')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('postalcode')
                    ->label('CEP')
                    ->placeholder('99999-999')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Filter::make('ignorar_admins')
                       ->query(fn (Builder $query): Builder => $query->where('email', 'not like', '%@tethys.com.br'))
                       ->default(true),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
