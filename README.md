# What is this?

A TypeScript (Deno) project following along with [Using the Specification
Pattern to Build a Data-Driven Rules Engine].

### license

See the [LICENSE] file.

### prerequisites

- [`deno`]

### running (from the command-line / console / terminal / shell / whatever you call it)

From the root of this repository (the directory containing _this_ file)...

#### the module executable

```shell
deno run app.ts
```

Now make a GET HTTP request to `http://127.0.0.1:8080/new-price/:currPrice/:newPrice`, e.g.:

```
http :8080/new-price/17/31
```

<small>This example uses the [`httpie`] utility.</small>

#### the module's tests

```shell
deno test
```

##### test tips

On macOS I use [`fd`] with [`entr`] to execute `deno test` when any
TypeScript file changes:

```
fd --type=file --extension=ts | entr deno test
```

[Using the Specification Pattern to Build a Data-Driven Rules Engine]: https://blog.jonblankenship.com/2019/10/04/using-the-specification-pattern-to-build-a-data-driven-rules-engine/
[LICENSE]: ./LICENSE
[`deno`]: https://deno.land
[`httpie`]: https://httpie.org/
[`fd`]: https://github.com/sharkdp/fd
[`entr`]: https://github.com/clibs/entr
