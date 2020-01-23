const numbers = require('./numbers');
const systems = [2,8,10,16];
const loops = 101;


test('Converts decimal integers into binary numbers and back', () => {
	for(let i=1; i <= loops; i++) {
		const a = numbers.converter.decimalToDual(i.toString(),2).result;
		const b = numbers.converter.dualToAny(a,2,8);		// binary to octal
		const c = numbers.converter.dualToAny(b,8,16);		// octal to hexa
		const d = numbers.converter.dualToAny(c,16,10);		// hexa to dec
		expect(parseInt(d)).toBe(i);
	}
});

/*
describe('Converts fractions [1/2 ,..,9/10] into rational numbers and back', () => {
//	test.each(systems)('Test for %d-er number system', (sys) =>  {
		const sys = 2;
		for(let n = 2; n <= loops; n++ ) {
			for(let z=1; z < n; z++) {
				if(n==2 || z==1 || 
					n % z != 0) {
					let f1 = numbers.fraction1.setValues(z,n);
					let number = f1.toFractionalNumber(sys);
					let f2 = numbers.fraction2.fromFractionalNumber(number,sys);
					
					expect(f2.toString()).toBe(f1.toString());
				}
			}
		}
//	});
});
*/




