#include <stdio.h>

char *helper3(void);
void noop1(void);

int main(int, char**) {
	noop1();
	printf("%s\n", helper3());
}
