package db

import (
	"context"
	"log"
	"time"

	"edu-lms-backend/internal/config"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitPostgres(cfg *config.Config) {
	connConfig, err := pgx.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Invalid PostgreSQL connection configuration")
	}
	connConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol
	// Neon can reuse a server session whose search_path was changed by another
	// client. Restore the application schema on connect and before reuse.
	selectSchema := func(ctx context.Context, conn *pgx.Conn) error {
		_, err := conn.Exec(ctx, "SET search_path TO public")
		return err
	}
	pool := stdlib.OpenDB(*connConfig,
		stdlib.OptionAfterConnect(selectSchema),
		stdlib.OptionResetSession(selectSchema),
	)
	db, err := gorm.Open(postgres.New(postgres.Config{Conn: pool}), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get generic database object: %v", err)
	}

	// Connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
	log.Println("Connected to PostgreSQL successfully")
}

func GetDB() *gorm.DB {
	return DB
}
