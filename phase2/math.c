#include "math.h"

static int my_internal_helper(int a, int b) {
    return a + b;
}

int add(int a, int b) {
    return my_internal_helper(a, b);
}
