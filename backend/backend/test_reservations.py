"""
Script para probar las reservas del usuario
"""
import requests
import json

API_BASE = "http://localhost:8000/api/v1"

# 1. Login como usuario
print("🔐 Iniciando sesión...")
login_response = requests.post(
    f"{API_BASE}/auth/login/json",
    json={
        "email": "usuario@unab.cl",
        "password": "usuario123"
    }
)

if login_response.status_code != 200:
    print(f"❌ Error al iniciar sesión: {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print(f"✅ Token obtenido: {token[:20]}...")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# 2. Obtener canchas disponibles
print("\n🏟️  Obteniendo canchas...")
courts_response = requests.get(f"{API_BASE}/courts")
courts = courts_response.json()
print(f"✅ {len(courts)} canchas disponibles")

if len(courts) == 0:
    print("❌ No hay canchas disponibles")
    exit(1)

# 3. Crear una reserva de prueba
first_court = courts[0]
print(f"\n📝 Creando reserva para: {first_court['name']}")
reservation_data = {
    "court_id": first_court["id"],
    "date": "2025-11-15",
    "time": "14:00",
    "duration": 2,
    "notes": "Reserva de prueba"
}

create_response = requests.post(
    f"{API_BASE}/reservations",
    headers=headers,
    json=reservation_data
)

if create_response.status_code != 201:
    print(f"⚠️  Error al crear reserva: {create_response.text}")
else:
    reservation = create_response.json()
    print(f"✅ Reserva creada con ID: {reservation['id']}")

# 4. Obtener reservas del usuario
print("\n📋 Obteniendo reservas del usuario...")
reservations_response = requests.get(
    f"{API_BASE}/reservations",
    headers=headers
)

if reservations_response.status_code != 200:
    print(f"❌ Error al obtener reservas: {reservations_response.text}")
    exit(1)

reservations = reservations_response.json()
print(f"✅ Usuario tiene {len(reservations)} reserva(s)")

if len(reservations) > 0:
    print("\n📊 Detalles de las reservas:")
    for res in reservations:
        print(f"  - ID: {res['id']}")
        print(f"    Cancha: {res['court']['name']}")
        print(f"    Fecha: {res['date']} a las {res['time']}")
        print(f"    Estado: {res['status']}")
        print(f"    Precio: ${res['total_price']:,}")
        print()
else:
    print("ℹ️  No hay reservas para este usuario")

print("\n✅ Prueba completada")
