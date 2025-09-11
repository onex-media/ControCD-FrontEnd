#!/bin/bash

# Directorio de la build de Quasar
BUILD_DIR="dist/spa"

# Datos del servidor FTP
FTP_HOST="ftp.controlcd.com"
FTP_USER="sirius2051@controlcd.com"
FTP_PASS="EasyPassword12345"
FTP_DEST_DIR="/home/controlcd/public_html"

# Ejecutar el comando quasar build
echo "Ejecutando quasar build..."
quasar build

# Verificar si la build fue exitosa
if [ $? -eq 0 ]; then
    echo "Build exitosa. Subiendo archivos al servidor FTP..."

    # Subir archivos al servidor FTP usando ftp
    ftp -inv $FTP_HOST <<EOF
    user $FTP_USER $FTP_PASS
    cd $FTP_DEST_DIR
    
    # Crear directorios necesarios
    mkdir assets
    mkdir icons
    mkdir images

    # Subir archivos individuales en assets
    lcd $BUILD_DIR/assets
    cd assets
    mput *
    cd ..
    lcd $BUILD_DIR

    # Subir archivos individuales en icons
    lcd $BUILD_DIR/icons
    cd icons
    mput *
    cd ..
    lcd $BUILD_DIR

    # Subir archivos individuales en images
    lcd $BUILD_DIR/images
    cd images
    mput *
    cd ..
    lcd $BUILD_DIR

    # Subir archivos restantes en el directorio principal
    mput favicon.ico favicon.svg index.html

    bye
EOF

    if [ $? -eq 0 ]; then
        echo "Archivos subidos exitosamente."
    else
        echo "Error al subir los archivos."
    fi
else
    echo "Error al ejecutar quasar build."
fi
