"""
AplicaciÃ³n principal FastAPI con autenticaciÃ³n JWT
Sistema de gestiÃ³n de canchas deportivas UNAB
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import json
import os
from dotenv import load_dotenv

import models
import schemas
import auth
from database import engine, get_db


from oauth_routes import router as oauth_router
load_dotenv()

# Crear tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Inicializar FastAPI
app = FastAPI(
    title="UNAB Sporting Court API",
    description="""
    Sistema de gestiÃ³n de canchas deportivas de la Universidad UNAB.
    
    ## CaracterÃ­sticas
    
    * **AutenticaciÃ³n JWT**: Login y registro con tokens JWT
    * **GestiÃ³n de Usuarios**: Registro, login y perfil de usuario
    * **GestiÃ³n de Canchas**: CRUD completo de canchas deportivas
    * **Sistema de Reservas**: Crear, ver, modificar y cancelar reservas
    * **Seguridad**: ContraseÃ±as encriptadas con bcrypt
    
    ## AutenticaciÃ³n
    
    1. RegÃ­strate en `/api/v1/auth/register`
    2. Inicia sesiÃ³n en `/api/v1/auth/login` para obtener tu token
    3. Usa el token en el header `Authorization: Bearer {token}`
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
origins = json.loads(os.getenv("CORS_ORIGINS", '["*"]'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar rutas OAuth
app.include_router(oauth_router)

# ============ Root Endpoint ============
@app.get("/", tags=["Root"])
def read_root():
    """Endpoint raíz de la API"""
    return {
        "message": "Bienvenido a UNAB Sporting Court API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Root"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API funcionando correctamente"}


# ============ Auth Endpoints ============
@app.post("/api/v1/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED, tags=["AutenticaciÃ³n"])
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registrar un nuevo usuario
    
    - **email**: Email Ãºnico del usuario
    - **password**: ContraseÃ±a (mÃ­nimo 6 caracteres)
    - **full_name**: Nombre completo (opcional)
    """
    # Verificar si el usuario ya existe
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya estÃ¡ registrado"
        )
    
    # Crear nuevo usuario con contraseÃ±a encriptada
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@app.post("/api/v1/auth/login", response_model=schemas.Token, tags=["AutenticaciÃ³n"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Iniciar sesiÃ³n y obtener token JWT
    
    - **username**: Email del usuario
    - **password**: ContraseÃ±a del usuario
    
    Retorna un token de acceso vÃ¡lido por 30 minutos
    """
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseÃ±a incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token JWT
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/v1/auth/login/json", response_model=schemas.Token, tags=["AutenticaciÃ³n"])
def login_json(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Iniciar sesiÃ³n con JSON (alternativa a form-data)
    
    - **email**: Email del usuario
    - **password**: ContraseÃ±a del usuario
    """
    user = auth.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseÃ±a incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# ============ User Endpoints ============
@app.get("/api/v1/users/me", response_model=schemas.User, tags=["Usuarios"])
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    """
    Obtener informaciÃ³n del usuario actual (requiere autenticaciÃ³n)
    """
    return current_user


@app.get("/api/v1/users", response_model=List[schemas.User], tags=["Usuarios"])
async def list_users(
    skip: int = 0, 
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Listar todos los usuarios (solo administradores)
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


# ============ Court Endpoints ============
@app.post("/api/v1/courts", response_model=schemas.Court, status_code=status.HTTP_201_CREATED, tags=["Canchas"])
async def create_court(
    court: schemas.CourtCreate,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Crear una nueva cancha (solo administradores)
    """
    # Verificar si ya existe una cancha con ese ID
    db_court = db.query(models.Court).filter(models.Court.court_id == court.court_id).first()
    if db_court:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cancha con ese ID"
        )
    
    db_court = models.Court(**court.dict())
    db.add(db_court)
    db.commit()
    db.refresh(db_court)
    
    return db_court


@app.get("/api/v1/courts", response_model=List[schemas.Court], tags=["Canchas"])
async def list_courts(
    skip: int = 0,
    limit: int = 100,
    sport: str = None,
    db: Session = Depends(get_db)
):
    """
    Listar todas las canchas disponibles (no requiere autenticaciÃ³n)
    
    - **sport**: Filtrar por deporte (opcional)
    """
    query = db.query(models.Court).filter(models.Court.is_active == True)
    
    if sport:
        query = query.filter(models.Court.sport == sport)
    
    courts = query.offset(skip).limit(limit).all()
    return courts


@app.get("/api/v1/courts/{court_id}", response_model=schemas.Court, tags=["Canchas"])
async def get_court(court_id: int, db: Session = Depends(get_db)):
    """
    Obtener informaciÃ³n de una cancha especÃ­fica
    """
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cancha no encontrada"
        )
    return court


@app.get("/api/v1/courts/{court_id}/availability", response_model=List[schemas.Reservation], tags=["Canchas"])
async def get_court_availability(
    court_id: int,
    date: str = None,
    db: Session = Depends(get_db)
):
    """
    Obtener las reservas de una cancha para verificar disponibilidad (no requiere autenticaciÃ³n)
    
    - **court_id**: ID de la cancha
    - **date**: Fecha en formato YYYY-MM-DD (opcional)
    """
    query = db.query(models.Reservation).filter(
        models.Reservation.court_id == court_id,
        models.Reservation.status == "confirmed"
    )
    
    if date:
        query = query.filter(models.Reservation.date == date)
    
    reservations = query.all()
    return reservations


# ============ Reservation Endpoints ============
@app.post("/api/v1/reservations", response_model=schemas.Reservation, status_code=status.HTTP_201_CREATED, tags=["Reservas"])
async def create_reservation(
    reservation: schemas.ReservationCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Crear una nueva reserva (requiere autenticaciÃ³n)
    
    - **court_id**: ID de la cancha
    - **date**: Fecha en formato YYYY-MM-DD
    - **time**: Hora en formato HH:MM
    - **duration**: DuraciÃ³n en horas (1-4)
    """
    # Verificar que la cancha existe
    court = db.query(models.Court).filter(models.Court.id == reservation.court_id).first()
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cancha no encontrada"
        )
    
    # Verificar disponibilidad (no hay otra reserva en el mismo horario)
    existing_reservation = db.query(models.Reservation).filter(
        models.Reservation.court_id == reservation.court_id,
        models.Reservation.date == reservation.date,
        models.Reservation.time == reservation.time,
        models.Reservation.status == "confirmed"
    ).first()
    
    if existing_reservation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La cancha ya estÃ¡ reservada en ese horario"
        )
    
    # Calcular precio total
    total_price = court.price_per_hour * reservation.duration if court.price_per_hour else None
    
    # Crear reserva
    db_reservation = models.Reservation(
        user_id=current_user.id,
        court_id=reservation.court_id,
        date=reservation.date,
        time=reservation.time,
        duration=reservation.duration,
        total_price=total_price,
        notes=reservation.notes,
        status="confirmed"
    )
    
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    
    return db_reservation


@app.get("/api/v1/reservations", response_model=List[schemas.ReservationWithDetails], tags=["Reservas"])
async def list_reservations(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Listar reservas del usuario actual (requiere autenticaciÃ³n)
    """
    reservations = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return reservations


@app.get("/api/v1/reservations/all", response_model=List[schemas.ReservationWithDetails], tags=["Reservas"])
async def list_all_reservations(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Listar todas las reservas (solo administradores)
    """
    reservations = db.query(models.Reservation).offset(skip).limit(limit).all()
    return reservations


@app.get("/api/v1/reservations/{reservation_id}", response_model=schemas.ReservationWithDetails, tags=["Reservas"])
async def get_reservation(
    reservation_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtener detalles de una reserva especÃ­fica
    """
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva no encontrada"
        )
    
    # Verificar que el usuario sea el dueÃ±o de la reserva o admin
    if reservation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver esta reserva"
        )
    
    return reservation


@app.put("/api/v1/reservations/{reservation_id}", response_model=schemas.Reservation, tags=["Reservas"])
async def update_reservation(
    reservation_id: int,
    reservation_update: schemas.ReservationUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Actualizar una reserva existente
    """
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva no encontrada"
        )
    
    # Verificar permisos
    if reservation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar esta reserva"
        )
    
    # Actualizar campos
    update_data = reservation_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(reservation, key, value)
    
    db.commit()
    db.refresh(reservation)
    
    return reservation


@app.delete("/api/v1/reservations/{reservation_id}", response_model=schemas.MessageResponse, tags=["Reservas"])
async def cancel_reservation(
    reservation_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancelar una reserva
    """
    reservation = db.query(models.Reservation).filter(
        models.Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva no encontrada"
        )
    
    # Verificar permisos
    if reservation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para cancelar esta reserva"
        )
    
    # Cambiar estado a cancelado en lugar de eliminar
    reservation.status = "cancelled"
    db.commit()
    
    return {"message": "Reserva cancelada exitosamente"}


# ============ Stats Endpoint ============
@app.get("/api/v1/stats", response_model=schemas.StatsResponse, tags=["EstadÃ­sticas"])
async def get_stats(
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Obtener estadÃ­sticas del sistema (solo administradores)
    """
    total_users = db.query(models.User).count()
    total_courts = db.query(models.Court).count()
    total_reservations = db.query(models.Reservation).count()
    active_reservations = db.query(models.Reservation).filter(
        models.Reservation.status == "confirmed"
    ).count()
    
    return {
        "total_users": total_users,
        "total_courts": total_courts,
        "total_reservations": total_reservations,
        "active_reservations": active_reservations
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)





