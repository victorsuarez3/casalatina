# Crear Evento Demo Manualmente en Firebase Console

Debido a que tu proyecto Firebase está en "Datastore Mode" y no en "Firestore Native Mode", necesitamos crear el evento manualmente usando la consola de Firebase.

## Pasos para Crear el Evento Demo

### 1. Ir a Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **gotham-6fc37**
3. En el menú lateral, busca **Firestore Database** (puede aparecer como "Cloud Firestore")
4. Click para abrir Firestore

### 2. Crear el Documento del Evento

1. En Firestore, deberías ver la colección **`events`**
2. Si no existe, créala:
   - Click en **"Start collection"**
   - Collection ID: `events`

3. Click en **"Add document"**

### 3. Configurar el Documento

**Document ID:** `demo-vip-party-2025`

### 4. Agregar Campos (uno por uno)

Copia estos campos exactamente:

| Field | Type | Value |
|-------|------|-------|
| `id` | string | `demo-vip-party-2025` |
| `title` | string | `VIP New Year Rooftop Party` |
| `subtitle` | string | `The most exclusive celebration in Miami` |
| `image` | string | `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=90` |
| `date` | **timestamp** | Este sábado a las 8:00 PM (elige la fecha manualmente) |
| `location` | string | `Brickell Heights Rooftop` |
| `price` | number | `0` |
| `capacity` | number | `50` |
| `attendees` | **array** | Ver abajo ⬇️ |
| `isShowcase` | boolean | `false` |
| `neighborhood` | string | `Brickell` |
| `venueName` | string | `Private Penthouse · Brickell Heights` |
| `dressCode` | string | `Cocktail Attire / All Black` |
| `vibe` | string | `Exclusive · High-Energy · Unforgettable` |
| `priceRange` | string | `Complimentary for Members` |
| `city` | string | `Miami` |
| `type` | string | `VIP_PARTY` |
| `membersOnly` | boolean | `true` |
| `coverImageUrl` | string | `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=90` |
| `description` | string | Ver abajo ⬇️ |
| `isActive` | boolean | `true` |
| `createdAt` | **timestamp** | Ahora (current time) |
| `updatedAt` | **timestamp** | Ahora (current time) |

### 5. Campo `attendees` (array)

Click en **"Add field"**, nombre: `attendees`, tipo: **array**

Agrega estos 22 elementos (todos tipo **string**):
```
demo-user-1
demo-user-2
demo-user-3
demo-user-4
demo-user-5
demo-user-6
demo-user-7
demo-user-8
demo-user-9
demo-user-10
demo-user-11
demo-user-12
demo-user-13
demo-user-14
demo-user-15
demo-user-16
demo-user-17
demo-user-18
demo-user-19
demo-user-20
demo-user-21
demo-user-22
```

### 6. Campo `description` (string)

```
Ring in the new year at Miami's most exclusive rooftop celebration. Featuring world-class DJs, premium open bar, gourmet canapés, and breathtaking 360° views of the Miami skyline. Limited to Casa Latina members only.

✨ Highlights:
• Live DJ spinning Latin house & reggaeton
• Premium open bar with signature cocktails
• Gourmet passed hors d'oeuvres
• Professional photographer
• Stunning skyline & ocean views
• Members-only networking

This is THE event to start the year with Miami's most ambitious Latin professionals.
```

### 7. Guardar

Click en **"Save"**

## ¡Listo!

El evento ahora aparecerá en tu app en la sección "Upcoming Events" con:
- 22 miembros asistiendo
- 28 cupos disponibles
- Imagen premium de fiesta en rooftop
- Todos los detalles VIP

## Para Eliminar el Evento

Cuando termines con los screenshots:
1. Ve a Firestore Console
2. Encuentra el documento `demo-vip-party-2025` en la colección `events`
3. Click en los tres puntos (⋮) → **Delete document**

---

## Alternativa Rápida: Importar JSON

Si Firebase te permite importar, usa el archivo `scripts/demo-event.json` (pero tendrás que ajustar el timestamp manualmente).

## Notas

- La imagen es de Unsplash (gratis y de alta calidad)
- El evento está programado para "este sábado" - ajusta la fecha manualmente
- 22 attendees muestran prueba social
- 28 spots remaining crean urgencia
- Perfect para screenshots del App Store
