import os
import dotenv

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, BigInteger, String, DateTime

dotenv.load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column("id", BigInteger, primary_key=True, autoincrement=True)
    name = Column("name", String)
    email = Column("email", String, unique=True)
    email_verified_at = Column("email_verified_at", DateTime)
    password = Column("password", String)
    remember_token = Column("remember_token", String)
    current_team_id = Column("current_team_id", BigInteger)
    profile_photo_path = Column("profile_photo_path", String)
    created_at = Column("created_at", DateTime)
    updated_at = Column("updated_at", DateTime)
    postalcode = Column("postalcode", String)
    phone = Column("phone", String)

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"

    def __str__(self):
        return self.__repr__()


class DatabaseService:
    """Database service"""

    def __init__(self):
        self.db = SessionLocal()

    def get_users(self):
        return self.db.query(User).all()

    def get_user(self, email):
        return self.db.query(User).filter(User.email == email).first()
