'use strict';	
const SEARCH_LEN = 1024;

const Converter = class {
	constructor() {
		this.name = "Converter";
		this.dec_sep = ".";
	}
	
	splitNumberString(ns) {
		const parts = ['','',''];
		const idx1  = ns.indexOf('.');
		const idx2  = ns.indexOf('p');
		if(idx1 != -1) {
			parts[0] = ns.substring(0,idx1);
			if(idx2 != -1) {
				parts[1] = ns.substring(idx1+1,idx2);
				parts[2] = ns.substring(idx2+1);
			}
			else
				parts[1] = ns.substring(idx1+1);
		}
		else
			parts[0] = ns;
		return parts;
	}
	
	possiblePrimes(n) {
		let i,j;
		 let a = [];
		
		 for(i=0; i <= n; i++)
			 a[i] = i;
		 a[1] = 0;
		
		 for(j=2; j * j < n; j++)
			 for(i=j*2; i <= n; i += j)
				 if(a[i] % j == 0)
					 a[i] = 0;
		 return a.filter(item => item > 0);
	}

	primeFractorization(n) {
		const primes = numbers.converter.possiblePrimes(n);
		let res = [];
	   
		primes.filter(item => n % item == 0).forEach(function(item){
		   while(n % item == 0) {
			   res.push(item);
			   n /= item;
		   }
	   }, n);
	   return res;
    }
    
	analysePattern(a) {
		const LEN = a.length;
		var found;
		var j, i,plen;

		for(let start = 0; start < 12; ++start) {
			for(plen=1; (plen+start) < LEN/2; ++plen) {
		  		found = true;
				for(i= start; (i+plen+plen) < LEN; i += plen) {
					found = true;
					for(j = i; j < plen; j++) {
						if(a[j] != [j+plen]) {
							break;
						}
					}
					found = j == plen;
					if(!found) {
						break;
					}
				}
				if(found) {
					console.log("plen:",plen);
					return a.slice(start,start+plen).join("");
				}
			}
		}				
		if(typeof window === 'undefined') {
			console.log("Periode zu lang!");  
		}
		return "";
	}

	fillupNumber(n, digits) {
		let res = Array.from(n.toString());
		for(let i=res.length; i < digits; ++i)
			res.unshift(" ");
		return res.join("");
	}
	
	decimalToDual(n, targetSystem) {
		const parts = numbers.converter.splitNumberString(n);
		const res = {
			result: "",
			data: [],
			iLen: 0,
			ppLen:0,
			pLen: 0
		};

		let len = parts[0].length;
		let int = len > 0 ? parseInt(parts[0]) : 0;
		let frac, p;
		let flags = [];
		
		if(int == 0) {
			res.result = "0";
		}
		else {
			while(int > 0) {
				p  = (int % targetSystem).toString(targetSystem);
				res.data.push(this.fillupNumber(int, len) + " : " + targetSystem + " = "
					+ this.fillupNumber(Math.trunc(int/targetSystem), len) + " REST " + p);
				flags.unshift(p);
				int = Math.trunc(int / targetSystem);
				++res.iLen;
			}
			res.result = flags.join("");
		}

		if(parts[1].length > 0 && parts[2].length == 0) {
			frac = parseInt(parts[1]);
		    if(frac > 0) {
				res += this.dec_sep; 
				let cnt = 0;
				let pattern = [];
				while(frac > 0 && cnt < SEARCH_LEN) {
					p = frac * targetSystem;
					let dec = Math.pow(10, frac.toString().length);
					int = Math.trunc(p / dec);
					pattern.push(int.toString());
					frac = p % dec;
					++cnt;
				}
				if(frac > 0) {
					res.result += this.analysePattern(pattern);
				}
				else {
					frac = parseInt(parts[1]);
					len = parts[1].length;
					pattern.forEach((item) => {
						res.data.push(this.fillupNumber(frac, len) + " * " +
							targetSystem + " = " + item + this.dec_sep);
					});
					res.ppLen = cnt;
					res.result += pattern.join("");
				}
			}
		}
		else if(parts[2].length > 0) {
			frac = parseInt(parts[2]);
			if(frac > 0) {
				const f = new Fraction().fromFractionalNumber(n, 10);
				const x = f.toFractionalNumber(targetSystem);
				let idx = x.indexOf(this.dec_sep);
				if(idx != -1) {
					res += this.dec_sep;
					res += x.substring(idx+1);
				}
			}
		}
		return res;
	}
	
	dualToAny(ns,srcSystem,destSystem, msg) {
		const parts = this.splitNumberString(ns);
		let res;
		let p = 0;
		let s, z;
		
		if(srcSystem == destSystem) {
			return ns;								// there's nothing to do.
		}
		
		if(destSystem == 10) {
			if(parts[0].length > 0 && parts[0] !== "0") {
				parts[0].split("").forEach(function(c) {
					z = parseInt(c, 16);
					s = p * srcSystem + z;
					if(msg != undefined) {
						msg.push(this.fillupNumber(p,5)+" * " + srcSystem + " + " + z + " = " + this.fillupNumber(s,5));
					}
					p = s;
				});
				res = p.toString();
			}
			else
				res = "0";
			
			if(parts[1].length > 0) {
				p = 0;
				res += this.dec_sep;
				if(parts[2].length == 0) {		// there's no periodical part
					for(let i=parts[1].length-1; i >=0; i--) {
						z = parseInt(parts[1][i], 16);
						s = p / srcSystem + z;
						if(msg != undefined) {
							
						}
						p = s;
					}
					p /= srcSystem;
				}
				res += p.toString();
			}
		}
		 
		else {
			let a = [];
			let ns = parts[0];
			if(srcSystem != 2) {
				p = parseInt(ns, srcSystem);
				while(p > 0) {
					a.unshift((p % 2).toString());
					p = Math.trunc(p / 2);
				}
				ns = a.join("");
			}
			if(destSystem != 2) {
				const len = destSystem == 8 ? 3 : 4;
				a = Array.from(ns);
				p = a.length;
				while(p % len != 0) {	// auffuellen
					a.unshift('0');
					++p;
				}
				ns = a.join("");
				let rs = "";
				for(z=0; z <= ns.length-len; z += len) {
					let ps = ns.substring(z,z+len); 
					p = parseInt(ps, 2); 
					rs += p.toString(destSystem);
				}
				ns = rs;
			}
			res = ns;
		}
		
		return res;	
	}
	
	toString() {
		return this.name;
	}
}

const Fraction = class {
	greatestCommonDivisor() {
		let gcd = Math.min(this.numerator, this.denominator);
		for(let i = gcd; i > 1; --i) {
			if(this.numerator % i == 0 && this.denominator % i == 0) {
				return i;
			}
		}
		return 1;
	}

	reduceFraction() {
		if(this.numerator > 1 && this.denominator > 1) {
			let gcd = this.greatestCommonDivisor();
			this.numerator 	 /= gcd;
			this.denominator /= gcd;
		}
	}

	setValues(z, n) {
		this.denominator = n;
		this.integer = Math.trunc(z/n);
		this.numerator = z % n;
		this.reduceFraction();
		return this;
	}
	
	constructor() {
		this.name = "Fraction";
		this.integer = 0;
		this.numerator = 0;
		this.denominator = 1;
	}
	
	toFractionalNumber(targetSystem) {
		const primes = numbers.converter.primeFractorization(this.denominator);
		let res = numbers.converter.decimalToDual(this.integer.toString(),targetSystem,null);
		res += numbers.converter.dec_sep;		
		let pattern = [];
		let z = this.numerator;
		let p, int, cnt=0;
	
		if(true) {
			//primes.some(item => item == 2) || targetSystem == 10 && primes.some(item => item == 5)) {
			while(z >  0 && cnt < SEARCH_LEN) {
				p = z * targetSystem;
				int = Math.trunc(p / this.denominator);
				pattern.push(int.toString(targetSystem));
				z = p % this.denominator;
				++cnt;
			}
			if(z > 0) {
				res += numbers.converter.analysePattern(pattern);
			}
			else
				res += pattern.join("");
		} 
		else  {
			let n = this.denominator;
			p = targetSystem;
			if(p == 2)
				p <<= 1;
			res += "p";
			
			while(p < n) 
				p *= targetSystem;
			
			if(p-1 == n) {
				// nenner = x ^ targetSystem"
			} else {
				while((p-1) % n != 0 && p * targetSystem < Number.MAX_VALUE) 
					p *= targetSystem;
				if((p-1) % n == 0) {
					const i = (p-1) / n;
					z *= i;
					n *= i;
				}
			}
			
			pattern = Array.from(n.toString(targetSystem)).fill("0");
			const zw = z.toString(targetSystem);
			for(let a=zw.length-1, b=pattern.length-1; a >=0; a--,b--) {
				pattern[b] = zw.charAt(a);
			}
			res += pattern.join("");
		}
		return res;
	}

	fromFractionalNumber(number, srcSystem) {
		const parts = numbers.converter.splitNumberString(number)
		this.integer = parseInt(parts[0], srcSystem);
		const vp =  parseInt(parts[1], srcSystem);
		const  p =  parseInt(parts[2], srcSystem);
		
		if(parts[2].length == 0) {
			this.denominator = 1;
			this.numerator = vp;
			if(this.numerator != 0)
				this.denominator = Math.pow(srcSystem, parts[1].length);
		}
		else { 
			if(parts[1].length == 0) {
				this.numerator = p;
				this.denominator = Math.pow(srcSystem, parts[2].length) - 1;
			} else {
				this.numerator =  vp * Math.pow(srcSystem, parts[2].length) + p;
				this.numerator -= vp;
				this.denominator = Math.pow(srcSystem, parts[1].length + parts[2].length) -
					Math.pow(srcSystem, parts[1].length); 
			}
		}
		this.reduceFraction();
		return this;
	}
	
	equals(o) {
		if(o != null  && o.name == 'Fraction')
			return this.numerator == o.numerator && 
				this.denominator == o.denominator; 
		return false;
	}
	
	toString() {
		let res = "";
		if(this.integer != 0)
			res += this.integer.toString() + "  ";

		res += this.numerator.toString() + " / ";
		res += this.denominator.toString();

		return res;
	}
}

const numbers = (function() {
	return {
		converter: 	new Converter(),
		fraction1:  new Fraction(),  fraction2:  new Fraction()
	};
}());

const main = function() {	
	const inputbar	= document.getElementById('input');
	const resultbar	= document.getElementById('result');
	const button	= document.getElementById('convert');
	const isysbox 	= document.getElementById('isys');
	const osysbox	= document.getElementById('osys');
	const msgbar	= document.getElementById('msgbar');
	const cmdbar  	= document.getElementById('comment');
	const canvas 	= document.querySelector("canvas");
	const items = [ {key:2,rex:/[0-1]*[,|.]?[0-1]?[p]?[0-1]+/,des:"dualen"},
					{key:8,rex:/[0-7]*[.|,]?[0-7]?[p]?[0-7]+/,des:"oktalen"},
					{key:10,rex:/[0-9]*[.|,|/]?[0-9]?[p]?[0-9]+/,des:"dezimalen"},
					{key:16,rex:/[A-Fa-f0-9]*[.|,]?[A-Fa-f0-9]?[p]?[A-Fa-f0-9]+/,des:"hexadezimalen"}];
	let srcSystem = 10;
	let destSystem= 2;

	const clearCanvas = function () {
		const ctx = canvas.getContext("2d");
		ctx.save();
		ctx.setTransform(1,0,0,1,0,0);
		canvas.width = canvas.width;	// clear canvas
		ctx.restore();
		return ctx;
	}

	const writeLines = function(a, ctx,y) {
		ctx.save();
		ctx.font = "12px Monospace";
		
		a.forEach((line) =>  {
			ctx.fillText(line,0, y);
			y += 20;
		});
		ctx.restore(); 
		return y;
	}
	
	function decimalToDualIllustration(o) {
		const ctx = clearCanvas();
		let y = 60;
		let txt = "";
		
		ctx.save();
		ctx.font = "16px Arial";
		ctx.fillText("Umwandlung einer Dezimalzahl in eine Zahl zur Basis B nach dem Horner-Schema",0, 20);
		if(o.iLen > 0) {
			if(o.ppLen > 0 || o.pLen > 0) {
				ctx.font = "12px Arial";
				ctx.fillText("Beginnen wir zunächst mit dem ganzzahligen Anteil.",0, 40);
				txt = "Der ganzahlige Teil ";
			}
			else {
				txt = "Das Ergebnis ";
			}
			y = writeLines(o.data,ctx,y) - 20;
			ctx.font = "12px Monospace";
			let x = ctx.measureText(o.data[0]).width + 20;
			ctx.moveTo(x,y);
			ctx.lineTo(x,60);
			ctx.stroke();
			
			ctx.font = "12px Arial";
			ctx.fillText("durch Ganzzahldivision.",x+40,60);
			ctx.fillText(txt + "ergibt sich aus dem REST, der in umgekehrter Reihenfolge auszulesen ist.",x+40, y-40);
		}
		ctx.restore();
		
	}

	button.addEventListener('click', function() {
		const sel = items.find(item => item.key == srcSystem);	// object of source system
		let s = inputbar.value.replace(/ /g,"");				// remove spaces
		let idx= s.search(/[.|,]/);
		if(idx != -1) {											// decimal separator is ,
			numbers.converter.dec_sep = s.substring(idx,idx+1);	// for the German-speaking area
		}
		const valid = s.match(sel.rex).join("") === s;			// regular expression
		s = s.replace(",",".");									// needed for arithmetic calculation
		
		if(valid) {
			msgbar.textContent = "";							// clear error message
			if(srcSystem == 10) {
				idx = s.indexOf("/");
				if(idx != -1) {
					const n = parseInt(s.substring(idx+1,s.length));
					if(n == 0) {
						msgbar.textContent = "Nenner darf nicht 0 sein!";
					} else {
						numbers.fraction1.setValues(parseInt(s.substring(0,idx)),n); 
						resultbar.textContent = numbers.fraction1.toFractionalNumber(destSystem);
					}
				} else {
					let res = numbers.converter.decimalToDual(s,destSystem);
					resultbar.textContent = res.result;
					decimalToDualIllustration(res);
				}
			} else {
				resultbar.textContent = numbers.converter.dualToAny(s,srcSystem,destSystem, null);
			}
		} else {
			resultbar.textContent = "";
			msgbar.textContent = inputbar.value + " ist kein gültiger Wert im "
				+ sel.des + " Zahlensystem!";
		}
	});
	isysbox.addEventListener('change', function() {
		srcSystem = parseInt(this.options[this.selectedIndex].value);
	},false);
	osysbox.addEventListener('change', function() {
		destSystem = parseInt(this.options[this.selectedIndex].value);
	},false);
/*	
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
	});
	*/
}

//if(typeof window === 'undefined') {
	module.exports = numbers;
//}
