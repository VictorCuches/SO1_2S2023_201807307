# Usa una imagen base de Python
FROM python:3.10

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo requirements.txt al contenedor
COPY requirements.txt requirements.txt

# Instala las dependencias de la aplicación
RUN pip install -r requirements.txt

# Copia todos los archivos de la aplicación al contenedor
COPY . .

# Expón el puerto en el que se ejecutará la aplicación
EXPOSE 4000

# Define el comando para ejecutar la aplicación
CMD ["python", "app.py"]
