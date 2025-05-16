## Phase 1

```
$ gcc -v example.o math.o -o example
Apple clang version 15.0.0 (clang-1500.1.0.2.5)
Target: arm64-apple-darwin24.4.0
Thread model: posix
InstalledDir: …
duplicate symbol '_my_internal_helper' in:
    /Users/krinkle/Temp/sandbox/example.o
    /Users/krinkle/Temp/sandbox/math.o
ld: 1 duplicate symbols
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

## Phase 2: With `static` on either or both

```
# Difftastic
$ difft phase1/ phase2/
```

```
$ ./build
+ gcc -c math.c -o math.o
+ gcc -c math_exe.c -o math_exe.o
+ gcc math.o math_exe.o -o math_exe
+ gcc -c example.c -o example.o
+ gcc example.o math.o -o example
```

No error, and both executables work as expected.

```
$ ./math_exe 
Add (expect=8): 8

$ ./example
Add (expect=14): 14
my_internal_helper (expect=3): 3
```

## Phase 3: Helpers moved to a separate file

```
$ ./build
+ gcc -c math.c -o math.o
+ gcc -c math_helper.c -o math_helper.o
+ gcc -c math_exe.c -o math_exe.o
+ gcc math.o math_helper.o math_exe.o -o math_exe
+ gcc -c example.c -o example.o
+ gcc -c example_helper.c -o example_helper.o
+ gcc math.o math_helper.o example.o example_helper.o -o example
duplicate symbol '_my_internal_helper' in:
    /Users/krinkle/Temp/sandbox/phase3/math_helper.o
    /Users/krinkle/Temp/sandbox/phase3/example_helper.o
ld: 1 duplicate symbols
```

Using `export CFLAGS=-fvisibility=hidden` does not change this.

## Phase 4: Shared dynamic link

```
# Difftastic
$ difft phase3/ phase4/
```
```
$ ./build 
+ gcc -c math.c -o math.o
+ gcc -c math_helper.c -o math_helper.o
+ gcc --shared math.o math_helper.o -o math.so
+ gcc -c math_exe.c -o math_exe.o
+ gcc math.o math_helper.o math_exe.o -o math_exe
+ gcc -c example.c -o example.o
+ gcc -c example_helper.c -o example_helper.o
+ gcc math.so example.o example_helper.o -o example
```

No error, and both executables work as expected.

```
$ ./math_exe   
Add (expect=8): 8

$ ./example
Add (expect=14): 14
my_internal_helper (expect=3): 3
```