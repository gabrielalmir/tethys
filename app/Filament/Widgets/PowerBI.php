<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class PowerBI extends Widget
{
    protected static string $view = 'filament.widgets.power-b-i';
    private string $url = "https://app.powerbi.com/view?r=eyJrIjoiMjgyYzQ4ZjgtN2JmZS00YzQ3LThiZTctMzBiNmFiOWRjZDRjIiwidCI6ImNmNzJlMmJkLTdhMmItNDc4My1iZGViLTM5ZDU3YjA3Zjc2ZiIsImMiOjR9";
    protected int | string | array $columnSpan = "full";

    // display icon for the widget
    public function getIcon(): string
    {
        return 'heroicon-o-chart-pie';
    }

    // display widget
    public function render(): \Illuminate\Contracts\View\View
    {
        return view(static::$view, [
            'url' => $this->url,
        ]);
    }
}
