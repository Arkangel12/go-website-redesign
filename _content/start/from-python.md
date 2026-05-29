---
title: "Go for Python Developers"
breadcrumbTitle: "From Python"
---

<div class="StartLang">

<p class="StartLang-intro">
You already know how to program. This page maps the Python you know to Go equivalents so you can be productive fast.
</p>

## Key differences at a glance

| | Python | Go |
|---|---|---|
| **Typing** | Dynamic | Static (inferred) |
| **Execution** | Interpreted | Compiled to native binary |
| **Concurrency** | Threads / asyncio | Goroutines + channels |
| **Error handling** | Exceptions | Multiple return values |
| **Classes** | `class` with inheritance | Structs + interfaces (no inheritance) |
| **Package manager** | pip | `go get` / go modules |

---

## Variables and types

**Python**
```python
name = "Gopher"
age  = 3
pi   = 3.14
```

**Go**
```go
name := "Gopher"   // short declaration, type inferred
age  := 3
pi   := 3.14

// explicit type
var greeting string = "Hello"
```

Go infers the type from the right-hand side — just like Python, but the type is fixed at compile time.

---

## Functions

**Python**
```python
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("division by zero")
    return a / b, None
```

**Go**
```go
func add(a, b int) int {
    return a + b
}

// Go returns errors as values — no exceptions
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}
```

---

## Loops

**Python**
```python
# range
for i in range(5):
    print(i)

# iterate list
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

**Go**
```go
// C-style for (Go's only loop keyword is "for")
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// range over slice (equivalent to enumerate)
fruits := []string{"apple", "banana", "cherry"}
for i, fruit := range fruits {
    fmt.Println(i, fruit)
}
```

---

## Data structures

**Python → Go equivalents**

| Python | Go |
|--------|-----|
| `list` | `[]T` (slice) |
| `dict` | `map[K]V` |
| `tuple` | struct or multiple return values |
| `set` | `map[T]struct{}` |

```go
// slice (like a Python list)
nums := []int{1, 2, 3}
nums = append(nums, 4)

// map (like a Python dict)
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
}
age, ok := ages["Alice"] // ok is false if key missing
```

---

## Error handling

Python raises exceptions; Go returns them.

**Python**
```python
try:
    result = int("abc")
except ValueError as e:
    print("error:", e)
```

**Go**
```go
result, err := strconv.Atoi("abc")
if err != nil {
    fmt.Println("error:", err)
}
```

The `if err != nil` pattern is idiomatic Go. It keeps error handling explicit and local — no surprise exceptions from deep call stacks.

---

## Concurrency: goroutines vs threads

Go's goroutines are lighter than Python threads and don't have a GIL.

**Python (threading)**
```python
import threading

def worker(n):
    print(f"worker {n}")

threads = [threading.Thread(target=worker, args=(i,)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
```

**Go (goroutines)**
```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Printf("worker %d\n", n)
    }(i)
}
wg.Wait()
```

You can run **millions** of goroutines — they start at 2 KB of stack and grow as needed.

---

## Next steps

- **[A Tour of Go](/tour/)** — interactive, browser-based introduction
- **[Effective Go](/doc/effective_go)** — idiomatic patterns
- **[Go by Example](https://gobyexample.com)** — short, practical snippets

<a class="StartLang-back" href="/start">← Back to Get Started</a>

</div>
