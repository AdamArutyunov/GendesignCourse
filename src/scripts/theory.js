const lesson1 = `console.log(123)
console.log('jhdfalfjda')
console.log(true)

console.log(3 + 4)
console.log('Hello, ' + 'World!')
console.log(true && false)

let a = 4 > 5
console.log(a)

const PI = 3.1415
console.log(PI * 2)
`;

const lesson2 = `console.log(4 > 5 && 'a' < 'c')

let a = 5
if (a > 3 && 5 < 10) {
	console.log("This is correct!")
}

while (i > 0) {
	console.log(i)
	i -= 1
}

for (let j = 0; j < 100; j = j + 1) console.log(j)
`;

const lesson3 = `function drawCircle(x, y, radius, color) {
	fill(color)
	noStroke()

	circle(x, y, radius)
}

drawCircle(50, 50, 10, '#FF0000')

function draw() {
	let x = random(50)
	let y = random(50)
	let randomColor = color(random(255), random(255), random(255))

	background(0)

	drawCircle(x, y, 10, randomColor)
}
`;
