#include <stdio.h>
#include "math.h"
#include "example_helper.h"

int main() {
    int a = 10, b = 4;
    printf("Add (expect=14): %d\n", add(a, b));
    printf("my_internal_helper (expect=3): %d\n", my_internal_helper(5, 2));
    return 0;
}
