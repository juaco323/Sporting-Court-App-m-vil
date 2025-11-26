"""
OAuth Authentication Routes for Firebase (Google)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

import models
import auth
from database import get_db

router = APIRouter(prefix="/api/v1/auth", tags=["OAuth Authentication"])

# ============ Schemas ============

class FirebaseLoginRequest(BaseModel):
    firebase_uid: str
    email: str
    full_name: str

class FirebaseRegisterRequest(BaseModel):
    firebase_uid: str
    email: str
    full_name: str
    rut: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ============ Firebase Endpoints ============

@router.post("/firebase/login", response_model=AuthResponse)
async def firebase_login(data: FirebaseLoginRequest, db: Session = Depends(get_db)):
    """
    Login with Firebase UID (Google OAuth)
    
    - **firebase_uid**: UID from Firebase Authentication
    - **email**: User email from Firebase
    - **full_name**: User display name from Firebase
    """
    # Buscar usuario por firebase_uid o email
    user = db.query(models.User).filter(
        (models.User.email == data.email)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado. Por favor regístrate primero."
        )
    
    # Generar token JWT
    access_token = auth.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_admin,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/firebase/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def firebase_register(data: FirebaseRegisterRequest, db: Session = Depends(get_db)):
    """
    Register new user with Firebase (Google OAuth)
    
    - **firebase_uid**: UID from Firebase Authentication
    - **email**: User email from Firebase
    - **full_name**: User display name from Firebase
    - **rut**: Chilean RUT (can be auto-generated for OAuth users)
    """
    # Verificar si el usuario ya existe
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    # Para usuarios de Firebase, usamos el firebase_uid como password hash
    new_user = models.User(
        email=data.email,
        hashed_password=auth.get_password_hash(data.firebase_uid),  # Hash del UID como password
        full_name=data.full_name,
        rut=data.rut,
        is_active=True,
        is_admin=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generar token JWT
    access_token = auth.create_access_token(data={"sub": new_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "is_admin": new_user.is_admin,
            "is_active": new_user.is_active,
            "created_at": new_user.created_at.isoformat() if new_user.created_at else None
        }
    }