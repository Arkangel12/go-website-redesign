---
title: "Go for Dart / Flutter Developers"
breadcrumbTitle: "From Dart"
---

<div class="StartLang">

<p class="StartLang-intro">
You know Dart's sound type system and async model. Go shares some of that DNA — static types, fast compilation — but makes very different choices around concurrency and object orientation.
</p>

## Key differences at a glance

| | Dart | Go |
|---|---|---|
| **Typing** | Static, sound, nullable-aware | Static, inferred, zero-value safe |
| **Null safety** | Built-in (`?` types) | No null — zero values + explicit errors |
| **Concurrency** | `async`/`await`, `Isolate` | Goroutines + channels |
| **OOP** | Classes, mixins, inheritance | Structs + interfaces (no inheritance) |
| **Compilation** | JIT (dev) / AOT (release) | Always AOT to native binary |
| **Runtime** | Dart VM / Flutter engine | No runtime — single static binary |
| **Package manager** | `pub` / `pubspec.yaml` | `go get` / `go.mod` |

---

## Variables and types

**Dart**
```dart
var name   = 'Gopher';     // inferred as String
int  count = 0;
final pi   = 3.14159;      // runtime constant
const max  = 100;          // compile-time constant
```

**Go**
```go
name  := "Gopher"   // inferred as string
count := 0          // inferred as int
const pi  = 3.14159 // compile-time constant
const max = 100
```

Go has no `var`/`final`/`const` mutability distinction for locals — `:=` is always mutable. Use `const` only for compile-time constants.

---

## Null safety → zero values

Dart added null safety to prevent null reference errors. Go takes a different approach: every type has a safe **zero value** — no null, no `?` annotations needed.

**Dart**
```dart
String? maybeText;          // nullable
int?    maybeCount;
if (maybeText != null) {
  print(maybeText.length);  // smart cast
}
```

**Go**
```go
var text  string  // zero value: ""
var count int     // zero value: 0

// Pointers can be nil — use them when "absent" is meaningful
var p *string
if p != nil {
    fmt.Println(len(*p))
}
```

For optional values across API boundaries, Go uses pointers or a `(value, ok)` return pattern instead of nullable types.

---

## Functions and named parameters

**Dart**
```dart
String greet({required String name, int times = 1}) {
  return '$name! ' * times;
}
greet(name: 'Gopher', times: 3);
```

**Go**
```go
// Go has no named parameters — use a config struct for many options
func greet(name string, times int) string {
    return strings.Repeat(name+"! ", times)
}
greet("Gopher", 3)

// Multiple return values replace optional outputs
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}
```

---

## Classes → structs + interfaces

Dart uses class-based OOP with mixins and inheritance. Go uses structs with methods and implicit interfaces.

**Dart**
```dart
abstract class Shape {
  double area();
}

class Circle implements Shape {
  final double radius;
  Circle(this.radius);

  @override
  double area() => 3.14159 * radius * radius;
}

class Rectangle implements Shape {
  final double width, height;
  Rectangle(this.width, this.height);

  @override
  double area() => width * height;
}
```

**Go**
```go
type Shape interface {
    Area() float64
}

type Circle struct{ Radius float64 }
func (c Circle) Area() float64 { return 3.14159 * c.Radius * c.Radius }

type Rectangle struct{ Width, Height float64 }
func (r Rectangle) Area() float64 { return r.Width * r.Height }

// Both satisfy Shape automatically — no "implements" keyword
func printArea(s Shape) {
    fmt.Printf("Area: %.2f\n", s.Area())
}
```

Go interfaces are satisfied implicitly — like Dart's structural typing but without the `implements` declaration.

---

## Async/await → goroutines

Dart's `async`/`await` runs on a single-threaded event loop (similar to JavaScript). Go's goroutines run concurrently on multiple OS threads.

**Dart**
```dart
Future<String> fetchData(String url) async {
  final response = await http.get(Uri.parse(url));
  return response.body;
}

// Parallel fetch
final results = await Future.wait([
  fetchData('/users'),
  fetchData('/posts'),
]);
```

**Go**
```go
func fetchData(url string) (string, error) {
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)
    return string(body), nil
}

// Parallel fetch with goroutines + channels
type result struct{ data string; err error }
ch := make(chan result, 2)
go func() { d, e := fetchData("/users"); ch <- result{d, e} }()
go func() { d, e := fetchData("/posts"); ch <- result{d, e} }()
r1, r2 := <-ch, <-ch
```

Goroutines are much cheaper than Dart isolates (start at ~2 KB vs ~2 MB). You can spawn millions.

---

## Isolates → goroutines + channels

Dart isolates don't share memory — they communicate via message passing. Go goroutines share memory but provide channels for safe message passing.

**Dart**
```dart
// Dart: spawn an isolate, pass data via SendPort
final port = ReceivePort();
await Isolate.spawn(heavyWork, port.sendPort);
final result = await port.first as int;
```

**Go**
```go
// Go: goroutine + channel
ch := make(chan int)
go func() {
    sum := 0
    for i := 0; i < 1_000_000; i++ { sum += i }
    ch <- sum
}()
result := <-ch
fmt.Println(result)
```

---

## Error handling

Dart throws exceptions; Go returns errors as values.

**Dart**
```dart
try {
  final n = int.parse('abc');
} on FormatException catch (e) {
  print('Error: $e');
}
```

**Go**
```go
n, err := strconv.Atoi("abc")
if err != nil {
    fmt.Println("Error:", err)
}
```

No checked/unchecked distinction. Errors are just values — composable, testable, and visible in function signatures.

---

## `pubspec.yaml` → `go.mod`

**Dart**
```yaml
# pubspec.yaml
dependencies:
  http: ^1.1.0
  shelf: ^1.4.1
```
```bash
dart pub get
```

**Go**
```bash
go mod init myapp
go get net/http           # stdlib — already included
go get github.com/gin-gonic/gin@latest
```

Dependencies are declared in `go.mod` and pinned with checksums in `go.sum`. The toolchain manages everything — no separate pub tool.

---

## Next steps

- **[A Tour of Go](/tour/)** — interactive browser-based introduction
- **[Effective Go](/doc/effective_go)** — idiomatic patterns every Go developer should read
- **[Go by Example](https://gobyexample.com)** — short, focused code samples

<a class="StartLang-back" href="/start">← Back to Get Started</a>

</div>
