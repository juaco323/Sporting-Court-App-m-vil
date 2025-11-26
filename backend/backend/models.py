"""
Modelos de base de datos con SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """Modelo de usuario"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    rut = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # RelaciÃ³n con reservas
    reservations = relationship("Reservation", back_populates="user")


class Court(Base):
    """Modelo de cancha deportiva"""
    __tablename__ = "courts"

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    sport = Column(String, nullable=False)  # FÃºtbol, Tenis, PÃ¡del
    description = Column(Text)
    capacity = Column(Integer)
    rating = Column(Float, default=0.0)
    price_per_hour = Column(Integer)
    features = Column(Text)  # JSON string con las caracterÃ­sticas
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # RelaciÃ³n con reservas
    reservations = relationship("Reservation", back_populates="court")


class Reservation(Base):
    """Modelo de reserva"""
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=False)
    
    date = Column(String, nullable=False)  # Formato: YYYY-MM-DD
    time = Column(String, nullable=False)  # Formato: HH:MM
    duration = Column(Integer, default=1)  # Horas
    total_price = Column(Integer)
    
    status = Column(String, default="confirmed")  # confirmed, cancelled, completed
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    user = relationship("User", back_populates="reservations")
    court = relationship("Court", back_populates="reservations")


