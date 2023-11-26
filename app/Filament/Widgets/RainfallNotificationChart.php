<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class RainfallNotificationChart extends ChartWidget
{
    protected static ?string $heading = 'Gráfico de chuvas e volume do lago';
    protected static string $color = 'info';

    protected function getData(): array
    {
        $data = [
            [
                'city' => 'Blumenau',
                'neighborhood' => 'Centro',
                'postal_code' => '89010025',
                'state' => 'SC',
                'time' => '2023-11-25 22:32:13.306000',
                'rainfall' => 0,
                'lake_volume' => 17,
            ],
            [
                'city' => 'Itapira',
                'neighborhood' => 'Centro',
                'postal_code' => '13970342',
                'state' => 'SP',
                'time' => '2023-11-25 22:33:09.814000',
                'rainfall' => 1,
                'lake_volume' => 82,
            ],
            [
                'city' => 'Itapira',
                'neighborhood' => 'Centro',
                'postal_code' => '13970080',
                'state' => 'SP',
                'time' => '2023-11-25 23:27:34.678000',
                'rainfall' => 1,
                'lake_volume' => 55,
            ],
            [
                'city' => 'Itapira',
                'neighborhood' => 'Centro',
                'postal_code' => '13970080',
                'state' => 'SP',
                'time' => '2023-11-25 23:30:17.538000',
                'rainfall' => 1,
                'lake_volume' => 65,
            ],
            [
                'city' => 'Blumenau',
                'neighborhood' => 'Centro',
                'postal_code' => '89010025',
                'state' => 'SC',
                'time' => '2023-11-26 15:55:41.368000',
                'rainfall' => 0,
                'lake_volume' => 6,
            ],
            [
                'city' => 'Blumenau',
                'neighborhood' => 'Centro',
                'postal_code' => '89010025',
                'state' => 'SC',
                'time' => '2023-11-26 18:02:01.334000',
                'rainfall' => 0,
                'lake_volume' => 63,
            ]
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Rainfall',
                    'data' => array_map(fn($item) => $item['rainfall'], $data),
                    'backgroundColor' => 'rgba(255, 99, 132, 0.2)',
                    'borderColor' => 'rgb(255, 99, 132)',
                    'borderWidth' => 1,
                    'hoverOffset' => 4
                ],
                [
                    'label' => 'Lake Volume',
                    'data' => array_map(fn($item) => $item['lake_volume'], $data),
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'borderColor' => 'rgb(54, 162, 235)',
                    'borderWidth' => 1,
                    'hoverOffset' => 4
                ]
            ],
            'labels' => array_map(fn($item) => $item['time'], $data),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
