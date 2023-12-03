package db

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Mongo struct {
	client *mongo.Client
}

func NewMongo(uri string) (*Mongo, error) {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	return &Mongo{
		client: client,
	}, nil
}

func (m *Mongo) Insert(database string, collection string, document interface{}) error {
	coll := m.client.Database(database).Collection(collection)
	_, err := coll.InsertOne(context.TODO(), document)
	if err != nil {
		return err
	}

	fmt.Printf("Inserted document %v into collection %v of database %v\n", document, collection, database)

	return nil
}

func (m *Mongo) FindAll(database string, collection string) (*[]bson.M, error) {
	coll := m.client.Database(database).Collection(collection)
	cursor, err := coll.Find(context.TODO(), bson.D{})

	if err != nil {
		return nil, err
	}

	results := []bson.M{}
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return &results, nil
}
