

## Проблема: Сезон не переключается на лето

### Причина

Найден баг с форматом данных. При сохранении в админке используется `JSON.stringify(seasonMode)`, что сохраняет значение как `"summer"` (с кавычками внутри строки). При чтении `fetchSeasonMode()` сравнивает значение напрямую: `value === "summer"` — но реальное значение в БД содержит лишние кавычки (`"summer"` вместо `summer`), поэтому сравнение не срабатывает и всегда возвращается `"auto"`.

Текущий месяц — март, в режиме `auto` это **зима**. Поэтому даже при установке "лето" в настройках, сайт показывает зиму.

### Решение

1. **`src/lib/season.ts` — `fetchSeasonMode()`**: Добавить `JSON.parse()` при чтении значения из БД, чтобы убрать лишние кавычки.

2. **`src/lib/season.ts` — `updateSeasonMode()`**: Убрать `JSON.stringify()` при записи, сохранять значение как есть (plain string). Это согласует формат записи и чтения.

3. **`src/pages/admin/AdminSettings.tsx`**: Аналогично убрать `JSON.stringify()` при сохранении `season_mode`.

4. **`src/hooks/use-season.tsx`**: После загрузки режима из БД, корректно обновлять сезон без необходимости ручного override — если админ выставил "summer", это должно применяться сразу.

### Детали

В `fetchSeasonMode()` заменить:
```ts
const value = data.value as string;
```
на:
```ts
let value = data.value as string;
try { value = JSON.parse(value); } catch {}
```

В `AdminSettings.tsx` и `updateSeasonMode()` заменить `JSON.stringify(seasonMode)` на просто `seasonMode`.

