package web

import "task-alerta-alagamento/db"

type Server struct {
	mongo    *db.Mongo
	database *db.Database
}

func NewServer(mongo *db.Mongo, database *db.Database) *Server {
	return &Server{
		mongo:    mongo,
		database: database,
	}
}
