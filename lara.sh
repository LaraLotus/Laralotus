#!/bin/bash
VERDE='\033[38;5;46m'
AMARELO='\033[38;5;226m'
VERMELHO='\033[38;5;196m'
RESET='\033[0m'
while true
do
clear
echo -e "${VERDE}Iniciando o sistema...${RESET}"
pkill -f "node conectar.js" > /dev/null 2>&1
node conectar.js
echo -e "\n${VERMELHO}O bot parou. Reiniciando em 3 segundos...${RESET}"
sleep 3
done


