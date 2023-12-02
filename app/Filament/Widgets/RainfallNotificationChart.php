<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\Http;

class RainfallNotificationChart extends ChartWidget
{
    protected static ?string $heading = 'Gráfico de chuvas e volume do lago';
    protected static string $color = 'info';

    private string $baseUrl = "https://task-alerta-alagamento.onrender.com";
    private string $resource = "notifications";

    protected static ?array $options = [
        'animations' => [
            'tension' => [
                'duration' => 5000,
                'easing' => 'linear',
                'from' => 0,
                'to' => 0.5,
                'loop' => true
            ]
        ],
    ];

    protected function getData(): array
    {
        $data = Http::get($this->baseUrl . '/' . $this->resource)->json();
        $data = array_map(function ($item) {
            $item['created_at'] = date('Y-m-d H:i:s', strtotime($item['timestamp']['$date']));
            return $item;
        }, $data);

        return [
            'datasets' => [
                [
                    'label' => 'Volume de chuva',
                    'data' => array_map(fn($item) => $item['rainfall'], $data),
                    'backgroundColor' => 'rgba(255, 99, 132, 0.2)',
                    'borderColor' => 'rgb(255, 99, 132)',
                    'borderWidth' => 1,
                    'hoverOffset' => 4,
                ],
                [
                    'label' => 'Volume do lago',
                    'data' => array_map(fn($item) => $item['lake_volume'], $data),
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'borderColor' => 'rgb(54, 162, 235)',
                    'borderWidth' => 1,
                    'hoverOffset' => 4
                ]
            ],
            'labels' => array_map(fn($item) => $item['created_at'], $data)
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
