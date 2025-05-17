#include <stdio.h>

char *helper();
void noop1(void);
void noop2(void);

int main(int, char**) {
	// Call noop1 and noop2 so that both shared libraries are used at runtime
	noop1();
	noop2();

	printf("%s\n", helper());
}
