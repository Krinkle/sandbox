setTimeout(function () {
	console.log('TAP version 13');
});

setTimeout(function () {
	console.log('ok 1 First');
}, 100);

setTimeout(function () {
	console.log('ok 2 Second');
}, 100);

setTimeout(function () {
	console.log('ok 3 Third');
}, 200);

setTimeout(function () {
	console.log('1..3');
	console.log('# pass 3');
	console.log('# skip 0');
	console.log('# todo 0');
	console.log('# fail 0');
}, 300);
