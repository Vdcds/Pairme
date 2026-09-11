# Design analysis - Rosé Pine product overhaul

## 0. Reference inventory

- Reference: user-requested named aesthetic, “Rosé Pine-ish”; no screenshot supplied.
- Tier: lo-fi / style-system reference. Palette comes from the Rosé Pine preset rather than pixel sampling.
- Target viewports: desktop 1440×900, mobile 390Ø44; responsive desktop-web framing.
- Scale: 1 CSS px per CSS px. All containers remain fluid.

## 1. Global tokens

| Role | Fill / value | Notes |
|---|---|---|
| App background | flat `#191724` | Rosé Pine base; verified as a flat fill by preset definition |
| Elevated surface | flat `#1f1d2e` | Rosé Pine surface |
| Overlay / hover | flat `#26233a` | Rosé Pine overlay |
| Border | flat `#403d52` | subtle keyline, softened with alpha in CSS |
| Text | flat `#e0def4` | Rosé Pine text |
| Muted text | flat `#908caa` | Rosé Pine subtle |
| Faint text | flat `#6e6a86` | Rosé Pine muted |
| Primary / love | flat `#eb6f92` | primary CTA, active state |
| Secondary / iris | flat `#c4a7e7` | secondary interaction |
| Informational / foam | flat `#9ccfd8` | secure/live metadata |
| Success / pine | flat `#31748f` | live/connected state |
| Warning / gold | flat `#f6c177` | permissions and device warning |
| Soft emphasis / rose | flat `#ebbcba` | accents, tags |
| Primary button | gradient `#eb6f92`→`#c4a7e7` left-to-right | only deliberate gradient in the system |
| Shadow | `0 24px 70px rgba(10,8,18,.38)` | low, soft elevation; no neon glow |
| Type | Wotfard, ui-sans-serif | display 64/64 600; h1 40/44 600; h2 26/32 600; body 15/24 400; label 12/16 600 |
| Radius | 12, 16, 20, 28 CSS px | controls, cards, shells, hero/call surfaces |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 72 CSS px | 8px-led rhythm |
| App grid | `minmax(0, 1fr)` with max 1248 CSS px | 24 CSS px mobile gutters, 32 CSS px desktop gutters |
| Nav height | 68 CSS px | sticky, translucent surface |

## 2. Screens

### Directory

- Sticky nav: full width, 68 CSS px.
- Hero: max 1248 CSS px, two columns at desktop; copy 62%, product proof card 38%.
- Directory: filter/count header plus 3-column room grid, collapsing to 1 column.

### Room

- Header strip with state, title, language.
- Main grid: fluid call/access surface plus 320 CSS px information rail; one column on mobile.
- Call shell: 16:9-capable video stage with fixed top status row and bottom controls.

### Create / edit

- Centered maximum 920 CSS px composition with context rail and elevated form surface.

## 3. Chat regions

### 3.1 MessageBubble

N/A - Pairme has no chat surface in this overhaul.

### 3.2 Message actions

N/A - Pairme has no chat surface in this overhaul.

### 3.3 Read / Delivered indicators

N/A - Pairme has no chat surface in this overhaul.

### 3.4 Message composer

N/A - Pairme has no chat surface in this overhaul.

### 3.5 Channel header

N/A - Pairme has no chat surface in this overhaul.

### 3.6 Channel list / ChannelPreview

N/A - Pairme has no chat surface in this overhaul.

## 4. Video regions

| Region | Design |
|---|---|
| Lobby | Two-column premium call preparation surface; real `VideoPreview`; room context and join action alongside it |
| Call layout | Keep `SpeakerLayout` for track, screen-share, dominant speaker, participant labels, network state, and reactions |
| Participant tiles | 20 CSS px radius, subtle `#403d52` border, surface fallback, quiet shadow |
| Call header | 60 CSS px, live marker, room title, session security and participant context |
| Controls | Custom compact dock; 44 CSS px icon buttons; mic, camera, screen, reactions, device settings, leave |
| Reactions | SDK-compatible `emoji_code` values; reactions render on participant tiles via `DefaultParticipantViewUI` and clear automatically |
| Errors | Gold notification pill above the control dock; never replace the whole call surface |

## 5. Feeds regions

N/A - Pairme has no activity-feed surface in this overhaul.

## 6. Taxonomy

| Signal | Stream / product concept | Route |
|---|---|---|
| Large active tile + participant filmstrip | `SpeakerLayout` | Call layout |
| Name and mute/network overlays | `DefaultParticipantViewUI` | ParticipantView |
| Mic / camera / screen buttons | call device state | Call Control Actions |
| Emoji tray | call reactions | Reactions guide + participant reaction renderer |
| Gear panel | `DeviceSettings` | Device settings |
| Red phone | `call.leave()` | custom call controls contract |
| Live dot | call joined state | product chrome |
| Lock | authenticated/member-gated call | Pairme access model |
| Request status | join request state | Pairme request controls |

## 7. Derived designs

| State | Design |
|---|---|
| Empty directory | one quiet elevated panel, Code icon, concise title, primary create CTA |
| Loading call client | preview skeleton inside lobby; action disabled with spinner |
| Call permission error | gold bordered inline notice; call stays usable |
| Room locked | centered lock treatment on surface with access explanation; request rail remains visible |
| Request sent | pine/foam-tinted status card |
| Declined request | neutral surface with a revised-request form |
| Dropdown / device menu | overlay fill `#26233a`, 14 CSS px radius, border `#403d52`, text `#e0def4` |
| Mobile controls | horizontally scrollable / compact dock with labels hidden, safe bottom spacing |

## 8. Fixture states

- Directory: zero rooms, 1 room, 6+ rooms, long title, long description, search query.
- Room: signed out, pending request, declined request, accepted member, owner with requests.
- Video: preparing, preview camera on/off, joining, joined alone, joined with multiple participants, screen share, device permission warning, reaction open and received, device menu open, leave.

## 9. Probe-selector seeds

| Region | Selector | Properties |
|---|---|---|
| Body | `body` | background-color, color, font-family |
| Nav | `nav` | height, background-color, border-color |
| Hero shell | `[data-ui="hero"]` | max-width, padding, gap |
| Room card | `[data-ui="room-card"]` | background-color, border-radius, border-color, box-shadow |
| Call root | `.pairme-call` | background-color, min-height |
| Participant | `.pairme-call .str-video__participant-view` | border-radius, border-color, background-color |
| Reaction | `.pairme-call .str-video__reaction__emoji` | font-size, filter, animation-name |
| Control dock | `[data-ui="call-controls"]` | background-color, border-radius, gap, padding |

## 10. Exact strings & glyphs

- Brand: `Pairme`
- Hero: `Find your next pairing session.`
- Primary CTA: `Start a room`
- Secondary CTA: `Browse open rooms`
- Lobby CTA: `Join pairing room`
- Room status: `Live pairing room`
- Control glyphs: microphone, camera, monitor-up, smile, settings, phone-off; left-to-right in that order.

## 11. Routes + mechanisms (Step 3)

| Region | Component | Mechanism |
|---|---|---|
| App chrome | Shadcn primitives + Tailwind | existing theme system |
| Room cards and forms | Shadcn Card/Button/Input/Select | theming + layout markup |
| Lobby | `<StreamCall>` + `<VideoPreview>` | custom lobby around SDK preview |
| Call layout | `<SpeakerLayout>` | prebuilt, themed |
| Participant tile | default `ParticipantView` UI inside layout | theming only |
| Controls | custom control dock using call state hooks + `<DeviceSettings>` | custom controls contract |
| Reactions | `call.sendReaction` + default participant reaction renderer | custom picker with SDK-supported emoji codes |

## 12. File-ownership manifest (Step 3)

- `src/app/globals.css`: global tokens and Stream component theming.
- `src/components/Nav.tsx`: navigation chrome.
- `src/components/Homepage.tsx`: marketing and directory experience.
- `src/components/RoomPage.tsx`: room shell and access experience.
- `src/components/room-request-controls.tsx`: request states.
- `src/components/video-player.tsx`: lobby and in-call layout.
- `src/components/custom-call-controls.tsx`: call controls, device settings, reactions.
- `src/app/create-room/page.tsx`, `src/app/create-room/user-form.tsx`: creation flow.

## 13. Running discrepancy table (6d, per round)

| Round | Region | Discrepancy | Action |
|---|---|---|---|
| 0 | Existing app | Violet/black theme is inconsistent and call lobby is decorative instead of a true preview | Replace with Rosé Pine tokens and `VideoPreview` |
| 0 | Reactions | Custom emoji codes `:joy:`, `:fire:`, `:tada:`, `:raised-hand:` are absent from the installed SDK reaction map, so tiles render blank | Use `:smile:`, `:fireworks:`, and `:raise-hand:` plus supported codes |
| 0 | Device settings | Existing menu item only logs to console | Mount SDK `DeviceSettings` in the control dock |
