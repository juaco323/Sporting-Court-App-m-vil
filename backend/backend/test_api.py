"""
Script de prueba para verificar el funcionamiento del backend
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(response, title):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except:
        print(response.text)

def test_api():
    print("🧪 Iniciando pruebas del API...")
    
    # 1. Health check
    response = requests.get(f"{BASE_URL}/health")
    print_response(response, "1. Health Check")
    
    # 2. Registrar usuario
    user_data = {
        "email": f"test_{int(requests.get(f'{BASE_URL}/').elapsed.total_seconds() * 1000)}@test.com",
        "password": "test123456",
        "full_name": "Usuario de Prueba"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
    print_response(response, "2. Registro de Usuario")
    
    # 3. Login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/login/json", json=login_data)
    print_response(response, "3. Login")
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 4. Obtener perfil
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
        print_response(response, "4. Perfil de Usuario")
        
        # 5. Listar canchas
        response = requests.get(f"{BASE_URL}/api/v1/courts")
        print_response(response, "5. Lista de Canchas")
        
        # 6. Crear reserva
        if response.status_code == 200:
            courts = response.json()
            if courts:
                reservation_data = {
                    "court_id": courts[0]["id"],
                    "date": "2025-11-15",
                    "time": "15:00",
                    "duration": 2,
                    "notes": "Reserva de prueba"
                }
                response = requests.post(
                    f"{BASE_URL}/api/v1/reservations",
                    headers=headers,
                    json=reservation_data
                )
                print_response(response, "6. Crear Reserva")
                
                # 7. Listar mis reservas
                response = requests.get(f"{BASE_URL}/api/v1/reservations", headers=headers)
                print_response(response, "7. Mis Reservas")
    
    # 8. Login con admin
    admin_login = {
        "email": "admin@unab.cl",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/login/json", json=admin_login)
    print_response(response, "8. Login Admin")
    
    if response.status_code == 200:
        admin_token = response.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # 9. Estadísticas (admin)
        response = requests.get(f"{BASE_URL}/api/v1/stats", headers=admin_headers)
        print_response(response, "9. Estadísticas (Admin)")
    
    print(f"\n{'='*60}")
    print("✅ Pruebas completadas")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: No se pudo conectar al servidor")
        print("Asegúrate de que el servidor esté corriendo en http://localhost:8000")
        print("Ejecuta: uvicorn main:app --reload")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
