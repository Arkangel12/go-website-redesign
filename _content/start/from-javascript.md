---
title: "Go for JavaScript / TypeScript Developers"
breadcrumbTitle: "From JavaScript"
---

<div class="StartLang">

<p class="StartLang-intro">
You know JS/TS. Here's how Go maps to the concepts you use every day — with a focus on what's different and why.
</p>

## Key differences at a glance

| | JavaScript / TypeScript | Go |
|---|---|---|
| **Typing** | Dynamic / optional static (TS) | Static, inferred |
| **Runtime** | V8 / Node.js | Compiled native binary |
| **Concurrency** | Event loop, async/await | Goroutines + channels |
| **Null safety** | `null` / `undefined` | No null — use zero values + errors |
| **Modules** | npm / ESM | go modules (`go.mod`) |
| **Classes** | `class` + prototype chain | Structs + interfaces |

---

## Variables

**JavaScript / TypeScript**
```typescript
const name: string = "Gopher";
let   count        = 0;
```

**Go**
```go
name  := "Gopher"   // const-like short declaration
count := 0          // mutable by default

const pi = 3.14159  // true compile-time constant
```

Go has no `var`/`let`/`const` distinction for mutability — all variables declared with `:=` are mutable. Use `const` only for compile-time constants.

---

## Functions

**TypeScript**
```typescript
function add(a: number, b: number): number {
  return a + b;
}

// arrow function
const greet = (name: string): string => `Hello, ${name}!`;
```

**Go**
```go
func add(a, b int) int {
    return a + b
}

// function value (like an arrow function)
greet := func(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}
```

---

## Async/await → Goroutines

JS serialises async work on one thread. Go runs goroutines on multiple OS threads — true parallelism.

**JavaScript**
```javascript
async function fetchUser(id) {
  const res  = await fetch(`/users/${id}`);
  const user = await res.json();
  return user;
}

// run two fetches in parallel
const [a, b] = await Promise.all([fetchUser(1), fetchUser(2)]);
```

**Go**
```go
func fetchUser(id int) (User, error) {
    res, err := http.Get(fmt.Sprintf("/users/%d", id))
    // ... decode JSON
}

// run two fetches in parallel with goroutines + channels
results := make(chan User, 2)
go func() { u, _ := fetchUser(1); results <- u }()
go func() { u, _ := fetchUser(2); results <- u }()
a, b := <-results, <-results
```

No callback hell, no promise chains — goroutines read like synchronous code.

---

## Error handling

JS throws errors; Go returns them.

**JavaScript**
```javascript
try {
  const data = JSON.parse(raw);
} catch (e) {
  console.error("parse error:", e);
}
```

**Go**
```go
var data map[string]any
if err := json.Unmarshal([]byte(raw), &data); err != nil {
    fmt.Println("parse error:", err)
}
```

---

## Interfaces (structural typing — like TypeScript)

Go interfaces work like TypeScript interfaces: a type satisfies an interface implicitly.

**TypeScript**
```typescript
interface Greeter {
  greet(): string;
}
class Dog implements Greeter {
  greet() { return "Woof!"; }
}
```

**Go**
```go
type Greeter interface {
    Greet() string
}
type Dog struct{}
func (d Dog) Greet() string { return "Woof!" }

// Dog satisfies Greeter automatically — no "implements" keyword
var g Greeter = Dog{}
```

---

## npm → go modules

**Node.js**
```bash
npm init
npm install express
```

**Go**
```bash
go mod init myapp
go get github.com/gin-gonic/gin
```

Dependencies are declared in `go.mod`, pinned with checksums in `go.sum` — similar to `package-lock.json` but built into the toolchain.

---

## Next steps

- **[A Tour of Go](/tour/)** — interactive introduction
- **[Go by Example](https://gobyexample.com)** — practical snippets
- **[Gin web framework](https://gin-gonic.com)** — the Express.js of Go

<a class="StartLang-back" href="/start">← Back to Get Started</a>

</div>
