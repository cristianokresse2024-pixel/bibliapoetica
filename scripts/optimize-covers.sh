#!/usr/bin/env bash
# Otimiza capas: converte PNGs grandes gerados em frontend/public/covers/ para JPG leve.
# Uso: bash scripts/optimize-covers.sh
set -e
DIR="frontend/public/covers"
for f in "$DIR"/*.png; do
  [ -e "$f" ] || continue
  b=$(basename "$f" .png)
  if [ "$b" = "hero" ]; then
    convert "$f" -resize 1400x -strip -quality 84 "$DIR/$b.jpg"
  else
    convert "$f" -resize 800x -strip -quality 82 "$DIR/$b.jpg"
  fi
  rm -f "$f"
  echo "otimizado: $b.jpg"
done
echo "Concluído. Tamanho total:"
du -sh "$DIR"
