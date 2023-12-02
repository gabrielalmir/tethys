<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use MongoDB\Driver\ServerApi;

class RainfallNotificationChart extends ChartWidget
{
    protected static ?string $heading = 'Gráfico de chuvas e volume do lago';
    protected static string $color = 'info';

    private \MongoDB\Client $mongoClient;

    public function __construct() {
        $mongoUri = getenv('MONGODB_URI', 'mongodb://localhost:27017');
        $mongoApi = new ServerApi(ServerApi::V1);
        $mongoClient = new \MongoDB\Client($mongoUri, [], ['serverApi' => $mongoApi]);
        $this->mongoClient = $mongoClient;
    }

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

    private function fetchDataFromDatabase(): array
    {
        $collection = $this->mongoClient->selectDatabase('tethys')->selectCollection('notifications');
        $cursor = $collection->find([], ['_id' => 0, 'rainfall' => 1, 'volume' => 1]);

        $data = [];

        foreach ($cursor as $document) {
            $data[] = [
                'rainfall' => $document['rainfall'],
                'volume' => $document['volume'],
            ];
        }

        return $data;
    }

    protected function getData(): array
    {
        $data = $this->fetchDataFromDatabase() ?? [];

        return [
            'datasets' => [
                [
                    'label' => 'Rainfall',
                    'data' => array_map(fn($item) => $item['rainfall'], $data),
                    'backgroundColor' => 'rgba(255, 99, 132, 0.2)',
                    'borderColor' => 'rgb(255, 99, 132)',
                    'borderWidth' => 1,
                    'hoverOffset' => 4,
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
