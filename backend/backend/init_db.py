"""
Script para inicializar la base de datos con datos de prueba
"""
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine
import models
import auth

def init_db():
    """Inicializa la base de datos con datos de prueba"""
    
    # Crear todas las tablas
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Crear usuario administrador si no existe
        admin_email = "admin@unab.cl"
        admin_user = db.query(models.User).filter(models.User.email == admin_email).first()
        
        if not admin_user:
            admin_user = models.User(
                email=admin_email,
                hashed_password=auth.get_password_hash("admin123"),
                full_name="Administrador UNAB",
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            print(f"✓ Usuario administrador creado: {admin_email} / admin123")
        
        # Crear usuario de prueba
        test_email = "usuario@unab.cl"
        test_user = db.query(models.User).filter(models.User.email == test_email).first()
        
        if not test_user:
            test_user = models.User(
                email=test_email,
                hashed_password=auth.get_password_hash("usuario123"),
                full_name="Usuario de Prueba",
                is_active=True
            )
            db.add(test_user)
            print(f"✓ Usuario de prueba creado: {test_email} / usuario123")
        
        db.commit()
        
        # Crear canchas de ejemplo
        courts_data = [
            # Fútbol
            {
                "court_id": "CAN-01",
                "name": "Cancha Central #1",
                "sport": "Fútbol",
                "description": "Cancha de fútbol 11 con césped sintético de última generación",
                "capacity": 22,
                "rating": 4.8,
                "price_per_hour": 45000,
                "features": '["Vestuarios", "Estacionamiento", "Iluminación LED", "Césped Sintético", "Marcador Electrónico"]'
            },
            {
                "court_id": "CAN-02",
                "name": "Cancha Norte #2",
                "sport": "Fútbol",
                "description": "Cancha de fútbol 7 techada ideal para entrenamientos",
                "capacity": 14,
                "rating": 4.5,
                "price_per_hour": 35000,
                "features": '["Techada", "Vestuarios", "Iluminación LED", "Agua Potable"]'
            },
            {
                "court_id": "CAN-03",
                "name": "Cancha Sur #3",
                "sport": "Fútbol",
                "description": "Cancha de fútbol 5 con superficie de última generación",
                "capacity": 10,
                "rating": 4.6,
                "price_per_hour": 25000,
                "features": '["Vestuarios", "Iluminación", "Estacionamiento"]'
            },
            # Tenis
            {
                "court_id": "TEN-01",
                "name": "Court de Tenis #1",
                "sport": "Tenis",
                "description": "Cancha profesional de tenis con superficie de arcilla",
                "capacity": 4,
                "rating": 4.9,
                "price_per_hour": 30000,
                "features": '["Superficie de Arcilla", "Iluminación Profesional", "Graderías", "Vestuarios"]'
            },
            {
                "court_id": "TEN-02",
                "name": "Court de Tenis #2",
                "sport": "Tenis",
                "description": "Cancha techada de tenis con superficie dura",
                "capacity": 4,
                "rating": 4.7,
                "price_per_hour": 28000,
                "features": '["Techada", "Superficie Dura", "Iluminación LED", "Vestuarios"]'
            },
            {
                "court_id": "TEN-03",
                "name": "Court de Tenis #3",
                "sport": "Tenis",
                "description": "Cancha de tenis al aire libre para entrenamientos",
                "capacity": 4,
                "rating": 4.4,
                "price_per_hour": 22000,
                "features": '["Al Aire Libre", "Iluminación", "Vestuarios"]'
            },
            # Pádel
            {
                "court_id": "PAD-01",
                "name": "Court de Pádel #1",
                "sport": "Pádel",
                "description": "Cancha premium de pádel con césped sintético de última generación",
                "capacity": 4,
                "rating": 4.9,
                "price_per_hour": 32000,
                "features": '["Techada", "Césped Premium", "Iluminación LED", "Graderías", "Vestuarios"]'
            },
            {
                "court_id": "PAD-02",
                "name": "Court de Pádel #2",
                "sport": "Pádel",
                "description": "Cancha techada de pádel con excelente iluminación",
                "capacity": 4,
                "rating": 4.6,
                "price_per_hour": 28000,
                "features": '["Techada", "Iluminación LED", "Vestuarios", "Estacionamiento"]'
            },
            {
                "court_id": "PAD-03",
                "name": "Court de Pádel #3",
                "sport": "Pádel",
                "description": "Cancha de pádel al aire libre ideal para principiantes",
                "capacity": 4,
                "rating": 4.3,
                "price_per_hour": 24000,
                "features": '["Al Aire Libre", "Iluminación", "Vestuarios"]'
            }
        ]
        
        for court_data in courts_data:
            existing_court = db.query(models.Court).filter(
                models.Court.court_id == court_data["court_id"]
            ).first()
            
            if not existing_court:
                court = models.Court(**court_data)
                db.add(court)
                print(f"✓ Cancha creada: {court_data['name']}")
        
        db.commit()
        
        print("\n✓ Base de datos inicializada correctamente")
        print("\n📋 Credenciales de prueba:")
        print("   Admin: admin@unab.cl / admin123")
        print("   Usuario: usuario@unab.cl / usuario123")
        print("\n🚀 Inicia el servidor con: uvicorn main:app --reload")
        print("📖 Documentación disponible en: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Error al inicializar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
