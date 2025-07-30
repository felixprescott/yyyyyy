# get-project-structure

Скрипт на Node.js для рекурсивного вывода структуры директорий, исключая заданные файлы и папки.

# Установка

```
npm install
```

# Использование

```
node index.js путь_до_папки
```

Если путь не указан — будет использована текущая директория.

# Пример

```
node index.js ~/my_proj
```

Выведет структуру всех вложенных папок (кроме игнорируемых):

```
src
components
utils
public
```

# Игнорируемые файлы и папки:

- .git
- .vscode
- .idea
- node_modules
- .next
- index.js
- lib / libs
- .DS_Store
