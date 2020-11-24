import test from 'ava';
import { encryptString, decryptString } from '../source';

import cryptoRandomString = require('crypto-random-string');

function randomString() {
	return cryptoRandomString({
		length: Math.ceil(Math.random() * 100),
		type: 'ascii-printable',
	});
}

// More than one encryption is possible.
const fixtures = [
	{
		plain: 'Hello World',
		encrypted: [
			'!!(AP#M4i]$9<c0+|L\\#%a4/C8`m)yD(,F*,Ui25+)Uq\\,#TiI;Oj-I7,$0@.dfF#$9=}]~J<p6@;/sR-Zk~^4Fn,4>)y8\\KK:A#7&XIc~]&&%?v6<n>u7jk2@V9b,`R[3LpZmG3UxXG:!VcV,aP2?!JE^6',
			'!!(AP#M4i]$9<c0+|L\\#%a4/C\\kkJi,e$<|FMQO\\[*tbeCH_V/2M\\fQ,i2hW.dfF#$9[,s\'"aKcFK]Y;Gpi?XC$o*h<|=:^8K]51?Dx9D89~Q,=Z}?!GUf^B9rbgT0lM<cE"]D+9ELNj`f5S<@!)iz!Gzx^',
		],
		password: 'P4s$w0rd!',
	},
	{
		plain: 'Hello, World!',
		encrypted: [
			'!!(AP#M4i]$9<c0+bwZ\'%a4/C[m3w\\7a]uV#ymw*.J^WO9\'G0/>7xu7>g-3H.dfF#$9]n!<{k8FJ,aqh:s2of+$C"$4Y;][]#,&0~y+lR}=7p;1h?>(}=R[gI.!>(>`?dN2`,Ve8\'If+:$9GQ*/zDn!=t1$',
		],
		password: 'P4s$w0rd!',
	},
	{
		plain: 'Hello, World!',
		encrypted: [
			'!!(AP#M4i]$9<c0+bwZ\'%a4/C:^ULU==U*g{WFke\\:s9Y`~5`w9KV"M*o8e}.dfF#$9@J>Kv4Y~,kL${_X$qX+cg3T2tqGy\'55gQF+s{O+>!4H=gU6{/mVCn=gcd%2M[l)AMR7Z^!++{4q4~/{E(*z!.I)n',
		],
		password: 'P4s$w0rD!',
	},
	{
		plain: '',
		encrypted: [
			'!!(AP#M4i]$9<c0(v3:g%a4/CA6HtL|=`tI^dt?G12<+i!Q]Cz}7DK<":.SL.dfF#$9<xn3_RoQ+|qI_^-X=3{U=qk4K6cXEl]#?$IS/K\'>_R8C=>kD%bT8^+zZtz4Z{6/#vBzp!@XY9',
		],
		password: 'foo',
	},
	{
		plain: '',
		encrypted: [
			'!!(AP#M4i]$9<c0(v3:g%a4/C==G<i{ueJO>ATxL")?3R*mjr\\<:$.\\Lx|]3.dfF#$9]1SDtVgV^V@svJF2Yy^VtdP!)aRg&knBi5sHTI99l&F*2"_(/V*(W@YELOBgKn%`Cf1r!\\:qx',
		],
		password: 'bar',
	},
	{
		plain: '§ Lorem ipsum dolor sit amet.',
		encrypted: [
			'!!(AP#M4i]$9<c0/51=8%a4/C}S1~<3;*%yL`-}C{}%8@EKppXJUem@"R~0).dfF#$9[{jMZkE_=13m_[Ms~Y9+SMFDzZz43#Wpv*6ln9}eNj7;FpK9`P^.U9:*MF#{5I^J}f0H_cr_o{7Z2s\'N`Lw\\H1_;0aFW2JlWC<\\rXw6$OQF3!gr8$',
		],
		password: 'FooBar¹²³',
	},
	{
		plain: 'This is the secret',
		encrypted: [
			'!!(AP#M4i]$9<c0,iw4;%a4/C%*@EB0jp\'+$$pww]yLPd3[G\'2/eS`@_u/[@.dfF#$9]Xl2:o:@FkoOA\'@jq}=`f$W!>gbX1L678@ghM`.=7V(K:db]M5i{u5[ga~CojWx\'M_e7;#~lD-aVDs-D_o)+e16d:-`Dz!bVJ3',
		],
		password: 'P4s$w0Rd!',
	},
];

test('Decrypts correctly', async t => {
	for (const { plain, encrypted, password } of fixtures) {
		for (const encryptedValue of encrypted) {
			t.is(await decryptString(encryptedValue, password), plain);
		}
	}
});

test('Encrypts correctly', async t => {
	const augmentedFixtures = fixtures.slice();

	for (let i = 0; i < 3; i++) {
		augmentedFixtures.push({
			plain: randomString(),
			password: randomString(),
			encrypted: [],
		});
	}

	for (const { plain, password } of augmentedFixtures) {
		const encrypted = await encryptString(plain, password);
		t.is(await decryptString(encrypted, password), plain);
	}
});

test('Throws DecryptionError correctly', async t => {
	await t.throwsAsync(async () => decryptString('', ''));

	for (const { encrypted } of fixtures) {
		for (const encryptedValue of encrypted) {
			await t.throwsAsync(async () => decryptString(encryptedValue, ''));
			for (let i = 0; i < 2; i++) {
				await t.throwsAsync(async () => decryptString(encryptedValue, randomString()));
			}
		}
	}

	for (let i = 0; i < 2; i++) {
		await t.throwsAsync(async () => decryptString(randomString(), randomString()));
	}
});
