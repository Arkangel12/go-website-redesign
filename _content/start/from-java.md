---
title: "Go for Java / C# Developers"
breadcrumbTitle: "From Java"
---

<div class="StartLang">

<p class="StartLang-intro">
You know object-oriented programming. Go takes a different approach — less ceremony, more composition. Here's the translation.
</p>

## Key differences at a glance

| | Java / C# | Go |
|---|---|---|
| **Typing** | Static, nominal | Static, structural |
| **Inheritance** | Class hierarchy | Composition + interfaces |
| **Exceptions** | `try/catch/finally` | Multiple return values |
| **Generics** | ✓ (verbose) | ✓ (Go 1.18+, simple) |
| **Null** | `NullPointerException` | Zero values, no null panics |
| **Build** | Maven / Gradle / MSBuild | `go build` (single tool) |
| **Runtime** | JVM / CLR | Native binary, no runtime |

---

## Hello World — less boilerplate

**Java**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**Go**
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

No class wrapper required. `main` is a top-level function.

---

## Structs instead of classes

Go has no `class` keyword. Use structs with methods.

**Java**
```java
public class Person {
    private String name;
    private int    age;

    public Person(String name, int age) {
        this.name = name;
        this.age  = age;
    }
    public String greet() {
        return "Hi, I'm " + name;
    }
}
```

**Go**
```go
type Person struct {
    Name string
    Age  int
}

func (p Person) Greet() string {
    return fmt.Sprintf("Hi, I'm %s", p.Name)
}

// Usage
p := Person{Name: "Alice", Age: 30}
fmt.Println(p.Greet())
```

Methods are declared outside the struct — any type can have methods.

---

## Interfaces: implicit satisfaction

Java/C# require explicit `implements`. Go interfaces are satisfied implicitly.

**Java**
```java
interface Animal {
    String sound();
}
class Dog implements Animal {
    public String sound() { return "Woof"; }
}
```

**Go**
```go
type Animal interface {
    Sound() string
}
type Dog struct{}
func (d Dog) Sound() string { return "Woof" }

// Dog satisfies Animal — no declaration needed
var a Animal = Dog{}
```

This means you can add an interface after the fact — even for types in packages you don't own.

---

## No inheritance — use composition

**Java (inheritance)**
```java
class Shape { int color; }
class Circle extends Shape { double radius; }
```

**Go (embedding = composition)**
```go
type Shape struct{ Color int }
type Circle struct {
    Shape         // embed Shape — Circle gets Shape's fields/methods
    Radius float64
}

c := Circle{Shape: Shape{Color: 0xFF0000}, Radius: 5.0}
fmt.Println(c.Color) // promoted from Shape
```

Embedding promotes fields and methods without the fragile base class problem.

---

## Error handling — no exceptions

**Java**
```java
try {
    int n = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.err.println("error: " + e.getMessage());
}
```

**Go**
```go
n, err := strconv.Atoi("abc")
if err != nil {
    fmt.Println("error:", err)
}
```

Errors are values. No checked/unchecked distinction. The compiler won't let you silently ignore them (use `_` if intentional).

---

## Goroutines vs threads

Java threads are ~1 MB each. Go goroutines start at 2 KB and scale to millions.

**Java**
```java
ExecutorService pool = Executors.newFixedThreadPool(10);
for (int i = 0; i < 5; i++) {
    final int id = i;
    pool.submit(() -> System.out.println("worker " + id));
}
pool.shutdown();
```

**Go**
```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Printf("worker %d\n", id)
    }(i)
}
wg.Wait()
```

No thread pool sizing. The Go scheduler handles everything.

---

## Generics (Go 1.18+)

**Java**
```java
public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
}
```

**Go**
```go
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}
```

---

## Next steps

- **[A Tour of Go](/tour/)** — hands-on introduction
- **[Effective Go](/doc/effective_go)** — idiomatic patterns
- **[Go specification](/ref/spec)** — the language reference

<a class="StartLang-back" href="/start">← Back to Get Started</a>

</div>
