"""
Script de migración para agregar columna rut a la tabla users
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('sporting_court.db')
    cursor = conn.cursor()
    
    try:
        # Verificar si la columna ya existe
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'rut' not in columns:
            print('Agregando columna rut a la tabla users...')
            cursor.execute('ALTER TABLE users ADD COLUMN rut TEXT')
            conn.commit()
            print('Columna rut agregada exitosamente')
        else:
            print('La columna rut ya existe')
            
    except Exception as e:
        print(f'Error durante la migración: {e}')
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
