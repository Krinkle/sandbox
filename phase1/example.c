#include <stdio.h>
#include "math.h"

int my_internal_helper(int a, int b) {
    return a - b;
}

int main() {
    int a = 10, b = 4;
    printf("Add (expect=14): %d\n", add(a, b));
    printf("my_internal_helper (expect=3): %d\n", my_internal_helper(5, 2));
    return 0;
}
