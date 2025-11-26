"""
Schemas de Pydantic para validación y serialización
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


# ============ User Schemas ============
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    rut: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Contraseña mínimo 6 caracteres")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Token Schemas ============
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ============ Court Schemas ============
class CourtBase(BaseModel):
    court_id: str
    name: str
    sport: str
    description: Optional[str] = None
    capacity: Optional[int] = None
    rating: Optional[float] = 0.0
    price_per_hour: Optional[int] = None
    features: Optional[str] = None  # JSON string


class CourtCreate(CourtBase):
    pass


class Court(CourtBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Reservation Schemas ============
class ReservationBase(BaseModel):
    court_id: int
    date: str = Field(..., description="Formato: YYYY-MM-DD")
    time: str = Field(..., description="Formato: HH:MM")
    duration: int = Field(1, ge=1, le=4, description="Duración en horas (1-4)")
    notes: Optional[str] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    duration: Optional[int] = Field(None, ge=1, le=4)
    notes: Optional[str] = None
    status: Optional[str] = None


class Reservation(ReservationBase):
    id: int
    user_id: int
    total_price: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReservationWithDetails(Reservation):
    """Reserva con información del usuario y cancha"""
    user: User
    court: Court

    class Config:
        from_attributes = True


# ============ Response Schemas ============
class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None


class StatsResponse(BaseModel):
    total_users: int
    total_courts: int
    total_reservations: int
    active_reservations: int
