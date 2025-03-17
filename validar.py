import json
import re

def validar_json(archivo_json):
    try:
        # Cargar el JSON
        with open(archivo_json, 'r', encoding='utf-8') as file:
            datos = json.load(file)
        
        # Verificar que sea una lista
        if not isinstance(datos, list):
            return False, "El JSON debe contener una lista de elementos"
        
        # Conjuntos para rastrear valores únicos
        cedulas = set()
        telefonos = set()
        
        # Patrón para validar números de teléfono (5989XXXXXXX)
        patron_telefono = re.compile(r'^5989\d{7}$')
        
        # Errores encontrados
        errores = []
        
        # Validar cada elemento
        for i, elemento in enumerate(datos):
            posicion = f"elemento {i+1}"
            
            # Verificar que el elemento tenga cédula y teléfono
            if 'cedula' not in elemento:
                errores.append(f"Falta cédula en {posicion}")
                continue
            
            if 'telefono' not in elemento:
                errores.append(f"Falta teléfono en {posicion}")
                continue
            
            cedula = elemento['cedula']
            telefono = elemento['telefono']
            
            # Saltar la validación de cédula si está vacía
            if cedula != "":
                # Validar cédula única
                if cedula in cedulas:
                    errores.append(f"Cédula duplicada: {cedula} en {posicion}")
                else:
                    cedulas.add(cedula)
            
            # Saltar la validación de teléfono si está vacío
            if telefono != "":
                # Validar teléfono único
                if telefono in telefonos:
                    errores.append(f"Teléfono duplicado: {telefono} en {posicion}")
                else:
                    telefonos.add(telefono)
                
                # Validar formato del teléfono
                if not patron_telefono.match(str(telefono)):
                    errores.append(f"Formato de teléfono inválido: {telefono} en {posicion}. Debe ser 5989XXXXXXX")
        
        # Si hay errores, devolver False y la lista de errores
        if errores:
            return False, errores
        
        # Todo validado correctamente
        return True, "JSON válido: todas las cédulas y teléfonos son únicos y tienen el formato correcto"
    
    except json.JSONDecodeError:
        return False, "Error al decodificar el JSON: formato inválido"
    except Exception as e:
        return False, f"Error inesperado: {str(e)}"

def main():
    archivo_json = input("Ingrese la ruta del archivo JSON a validar: ")
    valido, mensaje = validar_json(archivo_json)
    
    print("\n--- Resultado de la validación ---")
    if valido:
        print("✅", mensaje)
    else:
        print("❌ Se encontraron los siguientes errores:")
        if isinstance(mensaje, list):
            for error in mensaje:
                print(f"  - {error}")
        else:
            print(f"  - {mensaje}")

if __name__ == "__main__":
    main()