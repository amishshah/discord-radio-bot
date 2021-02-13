function wait(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

exports.wait = wait;
